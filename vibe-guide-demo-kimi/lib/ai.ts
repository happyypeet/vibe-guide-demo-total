import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY!,
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL!,
    'X-Title': 'VibeGuide',
  },
});

export interface ProjectAnalysis {
  projectDescription: string;
  detailedRequirements: string;
  userAnswers: Record<string, string>;
}

export interface GeneratedDocuments {
  userJourney: string;
  prd: string;
  frontendDesign: string;
  backendDesign: string;
  databaseDesign: string;
}

export class AIService {
  async generateQuestions(projectDescription: string): Promise<string[]> {
    try {
      const prompt = `基于以下项目描述，生成3-5个需要用户回答的关键问题，以帮助更好地理解项目需求：

项目描述：${projectDescription}

请生成简洁、具体的问题，每个问题不超过50字。以JSON数组格式返回：["问题1", "问题2", ...]`;

      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: '你是一个专业的项目需求分析师，擅长提出深入的问题来澄清项目需求。请只返回JSON格式的数组，不要添加其他文字。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('AI响应为空');

      return JSON.parse(content);
    } catch (error) {
      console.error('生成问题失败:', error);
      return [
        '项目的主要目标用户群体是谁？',
        '项目的核心功能有哪些？',
        '项目的技术栈偏好是什么？',
        '项目的预期上线时间是？',
        '项目的预算范围大概是多少？'
      ];
    }
  }

  async generateDocuments(analysis: ProjectAnalysis): Promise<GeneratedDocuments> {
    try {
      const prompt = `基于以下项目信息，生成完整的开发文档：

项目描述：${analysis.projectDescription}
详细需求：${analysis.detailedRequirements}
用户回答：${JSON.stringify(analysis.userAnswers, null, 2)}

请生成以下5个文档，使用Markdown格式：

1. 用户旅程地图 - 详细描述用户从初次接触到完成目标的完整流程
2. 产品需求文档(PRD) - 包含功能需求、非功能需求、技术规格等
3. 前端设计文档 - 包含页面结构、组件设计、状态管理等
4. 后端设计文档 - 包含API设计、数据库模型、服务架构等
5. 数据库设计文档 - 包含数据表结构、关系设计、索引策略等

请以JSON格式返回：
{
  "userJourney": "用户旅程地图内容",
  "prd": "产品需求文档内容",
  "frontendDesign": "前端设计文档内容",
  "backendDesign": "后端设计文档内容",
  "databaseDesign": "数据库设计文档内容"
}`;

      const response = await openai.chat.completions.create({
        model: 'anthropic/claude-3.5-sonnet',
        messages: [
          { role: 'system', content: '你是一个经验丰富的全栈开发专家，擅长根据项目需求生成详细的技术文档。请确保文档内容专业、完整、实用。' },
          { role: 'user', content: prompt }
        ],
        max_tokens: 4000,
        temperature: 0.7,
      });

      const content = response.choices[0]?.message?.content;
      if (!content) throw new Error('AI响应为空');

      return JSON.parse(content);
    } catch (error) {
      console.error('生成文档失败:', error);
      return this.getFallbackDocuments(analysis);
    }
  }

  private getFallbackDocuments(analysis: ProjectAnalysis): GeneratedDocuments {
    const { projectDescription, detailedRequirements } = analysis;
    
    return {
      userJourney: `# 用户旅程地图

## 阶段1：发现阶段
- **触发点**：用户意识到需要${projectDescription}
- **行为**：搜索解决方案，发现我们的产品
- **情感**：好奇、期待

## 阶段2：考虑阶段
- **行为**：浏览功能介绍，查看定价
- **情感**：谨慎、比较
- **触点**：官网、产品演示

## 阶段3：决策阶段
- **行为**：注册试用，体验核心功能
- **情感**：兴奋、略有担忧
- **触点**：注册流程、引导教程

## 阶段4：使用阶段
- **行为**：创建项目，使用AI功能
- **情感**：满意、依赖
- **触点**：项目管理、AI助手

## 阶段5：忠诚阶段
- **行为**：持续使用，推荐给他人
- **情感**：信任、推荐
- **触点**：客户支持、社区`,

      prd: `# 产品需求文档

## 1. 产品概述
${detailedRequirements}

## 2. 目标用户
- 编程新手
- 独立开发者
- 小型创业团队

## 3. 功能需求
### 3.1 核心功能
- AI驱动的项目需求分析
- 自动生成技术文档
- 项目管理系统
- 支付集成

### 3.2 文档类型
- 用户旅程地图
- 产品需求文档
- 前端设计文档
- 后端设计文档
- 数据库设计文档

## 4. 非功能需求
- 响应式设计
- 快速加载
- 安全认证
- 数据保护

## 5. 技术规格
- Next.js 14
- TypeScript
- TailwindCSS
- Supabase
- Drizzle ORM`,

      frontendDesign: `# 前端设计文档

## 1. 技术栈
- Next.js 14 (App Router)
- TypeScript
- TailwindCSS
- Shadcn/UI组件库
- React Hook Form

## 2. 页面结构
### 2.1 公共页面
- 首页 (/)
- 定价页 (/pricing)
- 登录页 (/auth/login)
- 注册页 (/auth/sign-up)

### 2.2 受保护页面
- 项目列表 (/projects)
- 新建项目 (/projects/new)
- 项目详情 (/projects/:id)
- 个人中心 (/my)

## 3. 组件设计
### 3.1 通用组件
- 导航栏
- 侧边栏
- 项目卡片
- 步骤条

### 3.2 状态管理
- 使用React Context进行全局状态管理
- 本地状态使用useState和useReducer

## 4. 响应式设计
- 移动端优先
- 断点：sm、md、lg、xl
- 弹性布局`,

      backendDesign: `# 后端设计文档

## 1. 技术栈
- Next.js API Routes
- Supabase Auth
- Drizzle ORM
- PostgreSQL

## 2. API设计
### 2.1 认证相关
- POST /api/auth/login
- POST /api/auth/register
- POST /api/auth/logout

### 2.2 项目相关
- GET /api/projects - 获取用户项目列表
- POST /api/projects - 创建新项目
- GET /api/projects/:id - 获取项目详情
- PUT /api/projects/:id - 更新项目
- DELETE /api/projects/:id - 删除项目

### 2.3 支付相关
- POST /api/payment/create - 创建支付订单
- POST /api/payment/callback - 支付回调

### 2.4 AI相关
- POST /api/ai/questions - 生成问题
- POST /api/ai/documents - 生成文档

## 3. 中间件
- 认证中间件
- 权限检查中间件
- 请求验证中间件`,

      databaseDesign: `# 数据库设计文档

## 1. 数据表结构

### 1.1 用户表 (users)
- id: UUID (主键)
- email: 邮箱地址
- full_name: 全名
- avatar_url: 头像URL
- project_points: 项目点数
- created_at: 创建时间
- updated_at: 更新时间

### 1.2 项目表 (projects)
- id: UUID (主键)
- user_id: 用户ID (外键)
- title: 项目标题
- description: 项目描述
- detailed_requirements: 详细需求
- ai_questions: AI生成的问题数组
- user_answers: 用户回答记录
- documents: 生成的文档内容
- is_completed: 是否完成
- created_at: 创建时间
- updated_at: 更新时间

### 1.3 支付表 (payments)
- id: UUID (主键)
- user_id: 用户ID (外键)
- amount: 支付金额
- project_points: 获得的项目点数
- payment_method: 支付方式
- status: 支付状态
- payment_id: 支付平台ID
- created_at: 创建时间
- updated_at: 更新时间

## 2. 索引设计
- users.email: 唯一索引
- projects.user_id: 普通索引
- payments.user_id: 普通索引
- payments.payment_id: 唯一索引

## 3. 关系设计
- users 1:N projects
- users 1:N payments`
    };
  }
}

export const aiService = new AIService();