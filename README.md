# Food Ordering App 🍽️

一个现代化的食品订购应用，使用 Next.js 15 和 Supabase 构建。支持多语言（中文/英文），提供流畅的用户体验和现代化的界面设计。

## ✨ 特性

- 🚀 基于 Next.js 15 App Router 的现代化 Web 应用
- 🌐 支持中英文双语切换
- 🎨 使用 Radix UI 和 Tailwind CSS 构建的精美界面
- 🌙 支持深色/浅色主题
- 📱 完全响应式设计，完美支持移动端
- 🔒 使用 Supabase 进行身份验证和数据存储
- 📝 使用 React Hook Form 和 Zod 进行表单验证
- 🎯 TypeScript 支持，提供完整的类型安全
- 🎨 Tailwind CSS 样式，支持自定义主题
- 📦 PWA 支持，可安装为桌面应用
- 🔄 实时数据更新
- 🛒 购物车功能
- 🔍 实时搜索功能
- 📋 订单管理系统

## 🛠️ 技术栈

- [Next.js 15](https://nextjs.org/) - React 框架
- [React 18](https://reactjs.org/) - UI 库
- [TypeScript](https://www.typescriptlang.org/) - 类型安全
- [Supabase](https://supabase.io/) - 后端服务
- [Radix UI](https://www.radix-ui.com/) - 无样式组件库
- [Tailwind CSS](https://tailwindcss.com/) - 样式框架
- [React Hook Form](https://react-hook-form.com/) - 表单处理
- [Zod](https://github.com/colinhacks/zod) - 数据验证
- [Framer Motion](https://www.framer.com/motion/) - 动画效果
- [Next PWA](https://github.com/shadowwalker/next-pwa) - PWA 支持

## 🚀 快速开始

1. 克隆仓库
```bash
git clone https://github.com/yourusername/food-ordering-app.git
cd food-ordering-app
```

2. 安装依赖
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. 配置环境变量
创建 `.env.local` 文件并添加必要的环境变量：
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

5. 在浏览器中打开 [http://localhost:3000](http://localhost:3000)

## 📦 构建部署

构建生产版本：
```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

启动生产服务器：
```bash
npm run start
# 或
yarn start
# 或
pnpm start
```

## 📁 项目结构

```
food-ordering-app/
├── app/                 # Next.js App Router 页面
├── components/         # React 组件
│   ├── ui/            # UI 组件
│   └── pages/         # 页面组件
├── contexts/          # React Context
├── lib/               # 工具函数和配置
├── public/            # 静态资源
└── styles/            # 全局样式
```

## 🤝 贡献

欢迎提交 Pull Requests！对于重大更改，请先开 issue 讨论您想要更改的内容。

1. Fork 本仓库
2. 创建您的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交您的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启一个 Pull Request

## 📝 许可证

[MIT](https://choosealicense.com/licenses/mit/)

## 👥 作者

- Your Name - [@yourusername](https://github.com/yourusername)

## 🙏 致谢

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.io/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/) 