# VibeGuide - 智能AI开发文档平台

VibeGuide 是一个智能AI开发文档平台，能够非常方便的帮助编程新手生成项目的一系列开发文档，包括用户旅程地图、产品需求PRD、前端设计文档、后端设计文档、数据库设计等。

## ✨ 功能特性

- 🚀 **智能文档生成** - 使用 Claude AI 生成专业的开发文档
- 📝 **多步骤项目创建** - 描述项目 → 深入需求 → 生成文档
- 💰 **点数制付费** - 按项目数量付费，灵活的价格方案
- 🎨 **现代化界面** - 基于 Next.js 14 + Tailwind CSS + Shadcn/UI
- 🔐 **用户认证** - 基于 Supabase 的完整用户认证系统
- 💳 **在线支付** - 集成 zpay 支付系统
- 📱 **响应式设计** - 支持桌面端和移动端
- 📄 **Markdown 导出** - 支持单个和批量文档下载

## 🏗️ 技术栈

- **前端**: Next.js 14 (App Router) + TypeScript
- **样式**: Tailwind CSS + Shadcn/UI
- **数据库**: Supabase (PostgreSQL)
- **ORM**: Drizzle ORM
- **AI**: Anthropic Claude Sonnet 4 (通过 OpenRouter)
- **支付**: zpay
- **认证**: Supabase Auth

## 🚀 快速开始

### 环境要求

- Node.js 18+ 
- pnpm/npm/yarn

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-username/vibe-guide.git
   cd vibe-guide
   ```

2. **安装依赖**
   ```bash
   pnpm install
   ```

3. **配置环境变量**
   ```bash
   cp .env.example .env.local
   ```
   
   编辑 `.env.local` 文件，填入以下配置：
   ```env
   DATABASE_URL=your_supabase_database_url
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ZPAY_PID=your_zpay_pid
   ZPAY_PKEY=your_zpay_key
   NEXT_PUBLIC_SITE_URL=your_site_url
   ```

4. **设置数据库**
   ```bash
   # 生成数据库迁移文件
   pnpm db:generate
   
   # 推送数据库结构
   pnpm db:push
   ```

5. **启动开发服务器**
   ```bash
   pnpm dev
   ```

   访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🔧 环境变量配置

| 变量名 | 描述 | 必需 |
|--------|------|------|
| `DATABASE_URL` | Supabase 数据库连接 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `OPENROUTER_API_KEY` | OpenRouter API 密钥 | ✅ |
| `ZPAY_PID` | zpay 商户 ID | ✅ |
| `ZPAY_PKEY` | zpay 商户密钥 | ✅ |
| `NEXT_PUBLIC_SITE_URL` | 网站域名 | ✅ |

## 📁 项目结构

```
vibe-guide/
├── app/                    # Next.js App Router
│   ├── auth/              # 认证相关页面
│   ├── dashboard/         # 后台仪表盘
│   ├── pricing/           # 价格页面
│   └── api/               # API 路由
├── components/            # React 组件
│   ├── ui/               # Shadcn UI 组件
│   ├── dashboard/        # 仪表盘组件
│   └── project/          # 项目相关组件
├── lib/                   # 工具库
│   ├── db/              # 数据库相关
│   ├── supabase/        # Supabase 客户端
│   ├── auth.ts          # 认证工具
│   ├── ai.ts            # AI 服务
│   └── zpay.ts          # 支付工具
├── docs/                 # 项目文档
└── drizzle/              # 数据库迁移
```

## 🎯 核心功能

### 1. 用户认证系统
- 基于 Supabase Auth 的完整用户认证
- 支持邮箱密码登录/注册
- 自动用户数据同步

### 2. 项目创建流程
- **步骤 1**: 描述项目需求（最少 20 字符）
- **步骤 2**: AI 深入分析并生成问题
- **步骤 3**: 生成专业文档

### 3. AI 文档生成
- 用户旅程地图
- 产品需求 PRD
- 前端设计文档
- 后端设计文档
- 数据库设计

### 4. 支付系统
- 集成 zpay 支付网关
- 支持支付宝和微信支付
- 自动点数充值

### 5. 项目管理
- 项目列表查看
- 项目详情展示
- 文档预览和下载
- 项目编辑功能

## 🛠️ 开发命令

```bash
# 开发服务器
pnpm dev

# 构建项目
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库相关
pnpm db:generate    # 生成迁移文件
pnpm db:push        # 推送数据库结构
pnpm db:studio      # 打开数据库管理界面
```

## 📝 使用说明

### 对于用户

1. **注册账户** - 访问网站并注册新账户
2. **购买点数** - 选择合适的价格方案购买项目点数
3. **创建项目** - 按照三步骤流程创建新项目
4. **生成文档** - AI 自动生成专业的开发文档
5. **下载使用** - 导出 Markdown 格式的文档

### 对于开发者

1. **环境配置** - 确保所有环境变量正确配置
2. **数据库设置** - 运行数据库迁移
3. **AI 配置** - 配置 OpenRouter API 密钥
4. **支付配置** - 配置 zpay 商户信息

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🆘 支持

如果您在使用过程中遇到问题，请：

1. 查看 [Issues](https://github.com/your-username/vibe-guide/issues) 页面
2. 搜索现有问题或创建新的 Issue
3. 提供详细的问题描述和复现步骤

## 🎉 致谢

- [Next.js](https://nextjs.org/) - React 框架
- [Supabase](https://supabase.com/) - 后端即服务
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Shadcn/ui](https://ui.shadcn.com/) - UI 组件库
- [Anthropic](https://anthropic.com/) - AI 服务提供商
- [zpay](https://z-pay.cn/) - 支付网关

---

**开始使用 VibeGuide，让 AI 为您的项目生成专业文档！** 🚀