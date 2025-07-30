import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    'X-Title': 'VibeGuide',
  },
})

export interface AIQuestion {
  question: string
  type: 'technical' | 'business' | 'user_experience'
}

export interface AIDocument {
  type: string
  title: string
  content: string
}

export async function generateQuestions(projectDescription: string): Promise<AIQuestion[]> {
  const prompt = `
基于以下项目描述，生成3-5个关键问题来帮助深入理解项目需求。问题应该涵盖技术实现、业务逻辑和用户体验等方面。

项目描述：${projectDescription}

请以JSON格式返回问题数组，每个问题包含question和type字段，type可以是：technical、business、user_experience。
`

  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content || '[]'
  
  try {
    return JSON.parse(content)
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    return []
  }
}

export async function generateDocuments(projectData: {
  description: string
  questions: string[]
  answers: string[]
}): Promise<AIDocument[]> {
  const prompt = `
基于以下项目信息，生成专业的开发文档。项目描述：${projectData.description}

用户回答的问题：
${projectData.questions.map((q, i) => `${i + 1}. ${q}\n回答：${projectData.answers[i]}`).join('\n\n')}

请生成以下5种文档：
1. 用户旅程地图 (user_journey)
2. 产品需求PRD (prd)
3. 前端设计文档 (frontend_design)
4. 后端设计文档 (backend_design)
5. 数据库设计 (database_design)

每个文档都应该包含详细的内容，以Markdown格式返回。请以JSON格式返回文档数组，每个文档包含type、title和content字段。
`

  const response = await openai.chat.completions.create({
    model: 'anthropic/claude-sonnet-4',
    messages: [
      {
        role: 'user',
        content: prompt,
      },
    ],
    temperature: 0.7,
  })

  const content = response.choices[0]?.message?.content || '[]'
  
  try {
    return JSON.parse(content)
  } catch (error) {
    console.error('Failed to parse AI response:', error)
    return []
  }
}