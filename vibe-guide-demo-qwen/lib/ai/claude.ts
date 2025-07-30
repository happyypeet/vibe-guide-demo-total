'use server';

import OpenAI from 'openai';

// 初始化OpenRouter客户端
const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "", // Optional. Site URL for rankings on openrouter.ai.
    "X-Title": "VibeGuide", // Optional. Site title for rankings on openrouter.ai.
  },
});

// 生成项目相关问题
export async function generateProjectQuestions(projectDescription: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-sonnet-4",
      messages: [
        {
          role: "system",
          content: "你是一个专业的项目分析师，根据用户提供的项目描述，提出3-5个有针对性的问题，帮助用户更好地明确项目需求。问题应该涵盖用户群体、核心功能、技术要求等方面。每个问题占一行，不要包含序号。"
        },
        {
          role: "user",
          content: `项目描述：${projectDescription}\n\n请根据以上项目描述，提出3-5个问题帮助用户完善需求分析：`
        }
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content || "";
    // 将响应按行分割成问题数组
    return response.split('\n').filter(q => q.trim().length > 0);
  } catch (error) {
    console.error('Error generating project questions:', error);
    // 返回默认问题
    return [
      "您的项目主要面向哪些用户群体？",
      "项目的核心功能有哪些？",
      "您希望项目具备哪些技术特性？",
      "项目的预期完成时间是什么时候？",
      "您对项目的预算范围有什么要求？"
    ];
  }
}

// 生成文档内容
export async function generateDocumentContent(
  projectDescription: string,
  answers: string[],
  documentType: string
): Promise<string> {
  try {
    let documentPrompt = "";
    
    switch (documentType) {
      case 'user-journey':
        documentPrompt = "请根据以下项目描述和用户回答，生成详细的用户旅程地图文档。包括用户角色、使用场景、痛点分析、机会点等。";
        break;
      case 'prd':
        documentPrompt = "请根据以下项目描述和用户回答，生成详细的产品需求文档(PRD)。包括产品概述、功能需求、非功能需求、用户故事、验收标准等。";
        break;
      case 'frontend':
        documentPrompt = "请根据以下项目描述和用户回答，生成前端设计文档。包括技术栈选择、架构设计、组件结构、UI/UX设计要点、性能优化建议等。";
        break;
      case 'backend':
        documentPrompt = "请根据以下项目描述和用户回答，生成后端设计文档。包括技术栈选择、架构设计、API设计、数据流设计、安全考虑等。";
        break;
      case 'database':
        documentPrompt = "请根据以下项目描述和用户回答，生成数据库设计文档。包括ER图描述、表结构设计、字段说明、索引策略、数据关系等。";
        break;
      default:
        documentPrompt = "请根据以下项目描述和用户回答，生成相关文档内容。";
    }

    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-sonnet-4",
      messages: [
        {
          role: "system",
          content: "你是一个专业的技术文档撰写专家，能够根据项目需求生成高质量的技术文档。请使用Markdown格式输出，确保内容结构清晰、专业。"
        },
        {
          role: "user",
          content: `${documentPrompt}\n\n项目描述：${projectDescription}\n\n用户回答：${answers.join('\n')}\n\n请生成详细的文档内容：`
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return completion.choices[0].message.content || "# 文档内容\n\n根据您的项目描述和回答生成的文档内容。";
  } catch (error) {
    console.error('Error generating document content:', error);
    return "# 文档生成失败\n\n抱歉，文档生成过程中出现了错误。请稍后重试。";
  }
}