import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "VibeGuide",
  },
});

export async function generateQuestions(description: string): Promise<string[]> {
  try {
    const prompt = `
作为一个专业的产品经理和系统架构师，基于以下项目描述，生成3-5个深入的问题来帮助完善项目需求：

项目描述：
${description}

请生成具体、有针对性的问题，帮助了解：
1. 目标用户和使用场景
2. 核心功能需求和优先级
3. 技术要求和约束
4. 性能和扩展性需求
5. 用户体验期望

每个问题都应该简洁明了，直接回答即可提供有价值的信息。
`;

    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-3.5-sonnet",
      messages: [
        {
          role: "user",
          content: prompt,
        }
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const response = completion.choices[0].message.content || '';
    
    // 解析问题列表 - 改进的解析逻辑
    const lines = response.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    const questions: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 匹配编号开始的行
      if (line.match(/^\d+[\.\)]\s/)) {
        let question = '';
        
        // 查找下一行的引号内容
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          const quoteMatch = nextLine.match(/^"([^"]*)"?/);
          if (quoteMatch) {
            question = quoteMatch[1];
          } else {
            // 如果没有引号，尝试直接使用标题后的内容
            const titleMatch = line.match(/^\d+[\.\)]\s*(.+)：?$/);
            if (titleMatch) {
              question = titleMatch[1];
            }
          }
        }
        
        if (question && question.length > 10) {
          questions.push(question);
        }
      }
    }
    
    // 如果解析失败，使用备用方案
    if (questions.length === 0) {
      const fallbackQuestions = response
        .split('\n')
        .filter(line => line.trim().match(/^[\d\-\*]\s/))
        .map(line => line.replace(/^[\d\-\*\.\)]\s*/, '').trim())
        .filter(q => q.length > 10);
      
      questions.push(...fallbackQuestions);
    }

    return questions.slice(0, 5); // 最多返回5个问题
  } catch (error) {
    console.error('Failed to generate questions:', error);
    
    if (error instanceof Error) {
      // OpenRouter API 错误
      if (error.message.includes('401')) {
        throw new Error('AI服务认证失败，请检查API密钥');
      }
      if (error.message.includes('429')) {
        throw new Error('AI服务请求过于频繁，请稍后重试');
      }
      if (error.message.includes('model')) {
        throw new Error('AI模型不可用，请联系管理员');
      }
      throw new Error(`AI服务错误：${error.message}`);
    }
    
    throw new Error('AI问题生成失败');
  }
}

export async function generateDocs(description: string, requirements: string) {
  try {
    const basePrompt = `
项目描述：
${description}

详细需求：
${requirements}

基于以上信息，`;

    const docTypes = [
      {
        key: 'userJourneyMap',
        prompt: `${basePrompt}请生成详细的用户旅程地图，包括：
1. 用户角色定义
2. 关键使用场景
3. 用户行为流程
4. 接触点分析
5. 痛点和机会点识别
请使用Markdown格式，结构清晰。`
      },
      {
        key: 'productRequirements',
        prompt: `${basePrompt}请生成完整的产品需求文档(PRD)，包括：
1. 产品概述和目标
2. 用户需求分析
3. 功能需求列表（按优先级）
4. 非功能性需求
5. 验收标准
6. 里程碑规划
请使用Markdown格式，结构清晰。`
      },
      {
        key: 'frontendDesign',
        prompt: `${basePrompt}请生成前端设计文档，包括：
1. 技术架构选择
2. 组件设计规范
3. 页面结构设计
4. 交互设计方案
5. 响应式设计考虑
6. 性能优化策略
请使用Markdown格式，结构清晰。`
      },
      {
        key: 'backendDesign',
        prompt: `${basePrompt}请生成后端设计文档，包括：
1. 系统架构设计
2. API接口设计
3. 数据流设计
4. 安全性设计
5. 性能和扩展性考虑
6. 部署和运维方案
请使用Markdown格式，结构清晰。`
      },
      {
        key: 'databaseDesign',
        prompt: `${basePrompt}请生成数据库设计文档，包括：
1. 数据模型设计
2. 表结构设计
3. 索引设计
4. 数据关系图
5. 数据完整性约束
6. 性能优化建议
请使用Markdown格式，结构清晰。`
      }
    ];

    const results: Record<string, string> = {};
    
    // 并发生成所有文档
    const promises = docTypes.map(async (docType) => {
      const completion = await openai.chat.completions.create({
        model: "anthropic/claude-3.5-sonnet",
        messages: [
          {
            role: "user",
            content: docType.prompt,
          }
        ],
        temperature: 0.7,
        max_tokens: 3000,
      });

      return {
        key: docType.key,
        content: completion.choices[0].message.content || ''
      };
    });

    const docResults = await Promise.all(promises);
    
    docResults.forEach(({ key, content }) => {
      results[key] = content;
    });

    return results;
  } catch (error) {
    console.error('Failed to generate documents:', error);
    throw new Error('AI文档生成失败');
  }
}