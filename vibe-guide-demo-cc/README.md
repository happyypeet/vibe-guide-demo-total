# VibeGuide - 智能AI开发文档生成平台

VibeGuide 是一个基于 AI 的智能开发文档生成平台，帮助编程新手快速生成专业的项目开发文档，包括用户旅程地图、产品需求PRD、前后端设计文档、数据库设计等。

## 🚀 功能特性

- **智能AI分析**：基于 Claude Sonnet 4 模型，深度理解项目需求
- **5类核心文档**：用户旅程地图、产品PRD、前端设计、后端设计、数据库设计
- **三步骤流程**：描述项目 → 深入需求 → 创建文档
- **多格式导出**：支持 Markdown 和 HTML 格式预览，单文档或批量 ZIP 下载
- **点数计费系统**：20元10个项目，40元30个项目
- **现代化UI**：基于 TailwindCSS + Shadcn/UI 的简约设计

## 🛠️ 技术栈

- **前端**：Next.js 15 + React 19 + TypeScript + TailwindCSS + Shadcn/UI
- **后端**：Next.js API Routes + Supabase
- **数据库**：PostgreSQL (Supabase) + Drizzle ORM
- **AI能力**：OpenRouter + Claude Sonnet 4
- **支付**：Z-Pay (支付宝/微信)
- **认证**：Supabase Auth

## 📦 安装

1. 克隆项目：
```bash
git clone https://github.com/your-username/vibe-guide-demo-1.git
cd vibe-guide-demo-1
```

2. 安装依赖：
```bash
pnpm install
```

3. 配置环境变量：
```bash
cp .env.example .env.local
```

编辑 `.env.local` 文件，填入以下配置：

```env
# Supabase
DATABASE_URL=your_database_url_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter AI
OPENROUTER_API_KEY=your_openrouter_api_key

# Z-Pay
ZPAY_PID=your_zpay_pid
ZPAY_PKEY=your_zpay_secret_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

4. 初始化数据库：
```bash
pnpm db:push
```

5. 启动开发服务器：
```bash
pnpm dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 🎯 使用流程

### 用户使用流程

1. **注册/登录**：使用邮箱注册账户
2. **购买点数**：根据需求选择基础版(20元/10个项目)或专业版(40元/30个项目)
3. **创建项目**：
   - 步骤1：详细描述项目（至少20字符）
   - 步骤2：回答AI生成的针对性问题（至少50字符）
   - 步骤3：AI生成完整项目文档
4. **查看和导出**：支持 Markdown/HTML 预览和多种格式下载

### 管理员功能

- 用户管理和点数充值记录查看
- 支付订单状态监控
- 系统使用统计

## 📊 数据库设计

### 核心表结构

- **users**: 用户信息和点数余额
- **projects**: 项目基本信息和生成的文档内容
- **payments**: 支付记录和点数充值历史

## 🔧 开发命令

```bash
# 开发
pnpm dev

# 构建
pnpm build

# 启动生产服务器
pnpm start

# 代码检查
pnpm lint

# 数据库操作
pnpm db:generate  # 生成数据库迁移
pnpm db:push      # 推送数据库变更
pnpm db:studio    # 打开数据库管理界面
```

## 🚀 部署

### Vercel 部署（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 配置环境变量
4. 部署完成

### 自定义部署

1. 构建项目：
```bash
pnpm build
```

2. 启动生产服务器：
```bash
pnpm start
```

## 🔒 环境变量说明

| 变量名 | 说明 | 必需 |
|--------|------|------|
| `DATABASE_URL` | Supabase 数据库连接串 | ✅ |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名密钥 | ✅ |
| `OPENROUTER_API_KEY` | OpenRouter API 密钥 | ✅ |
| `ZPAY_PID` | Z-Pay 商户 ID | ✅ |
| `ZPAY_PKEY` | Z-Pay 商户密钥 | ✅ |
| `NEXT_PUBLIC_SITE_URL` | 网站 URL | ✅ |

## 📝 API 文档

### 核心 API 端点

- `POST /api/ai/generate-questions` - 生成项目分析问题
- `POST /api/ai/generate-docs` - 生成项目文档
- `GET /api/projects` - 获取用户项目列表
- `POST /api/projects` - 创建新项目
- `GET /api/projects/[id]` - 获取项目详情
- `POST /api/payment/create` - 创建支付订单
- `POST /api/payment/notify` - 支付结果通知

## 🔐 安全考虑

- 所有 API 路由都有认证保护
- 点数扣除采用事务处理，确保数据一致性
- 支付回调有签名验证
- 用户输入有长度和格式验证
- 敏感信息不会记录到日志

## 🐛 故障排除

### 常见问题

1. **数据库连接失败**
   - 检查 `DATABASE_URL` 是否正确
   - 确保数据库服务正常运行

2. **AI 生成失败**
   - 检查 `OPENROUTER_API_KEY` 是否有效
   - 确认账户余额充足

3. **支付回调失败**
   - 检查 `ZPAY_PID` 和 `ZPAY_PKEY` 配置
   - 确认回调 URL 可正常访问

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。

## 📞 联系我们

- 邮箱：support@vibeguide.com
- 官网：https://vibeguide.com

---

⭐ 如果这个项目对您有帮助，请给我们一个 Star！
