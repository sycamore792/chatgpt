# ChatGPT Clone

[English](#english) | [中文](#中文)

## English

An open-source implementation of ChatGPT, featuring a pixel-perfect UI that matches OpenAI's official interface.

### Features

- 💯 Pixel-perfect UI matching OpenAI's ChatGPT
- 🚀 Built with modern tech stack (Next.js 15, React, TypeScript, Tailwind CSS)
- 💻 Responsive design that works on all devices
- 🎨 Clean and intuitive user interface
- 📁 File attachment support
- 🔄 Collapsible sidebar for better space utilization
- 🌙 Smooth animations and transitions
- 🔍 Chat search functionality
- 📱 Mobile-friendly design

### Screenshots

![Main Interface](/assets/example1.png)
*Main chat interface with sidebar*

![Mobile View](/assets/example2.png)
*Main interface with collapsed sidebar*

![Dark Mode](/assets/example3.png)
*Question and answer interface*

### Tech Stack

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Lucide Icons
- Shadcn/ui

### Getting Started

1. Clone the repository
```bash
git clone https://github.com/sycamore792/chatgpt.git
```

2. Install dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Configure environment variables
```bash
# Create a .env.local file in the root directory
cp .env.example .env.local

# Edit the .env.local file with your configuration
# OPENAI_API_KEY=your_openai_api_key
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Start the development server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

1. Build the application
```bash
npm run build
# or
yarn build
# or
pnpm build
```

2. Configure environment variables on your hosting platform
```
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=your_app_url
```

3. Deploy the application to your preferred hosting platform (Vercel, Netlify, etc.)

### Roadmap

- 🔮 Integration with multiple AI models (Claude, Gemini, etc.)
- 🔐 User authentication
- 💾 Persistent chat history
- 🖼️ Multimodal input support (voice, images)
- 🧠 Cross-session memory management
- 📊 Usage analytics and statistics
- 🌐 Multi-language support
- 🔌 Plugin system for extending functionality
- 🤝 Collaborative chat sessions

---

## 中文

一个开源的 ChatGPT 实现，完美复刻了 OpenAI 官方的用户界面。

### 特点

- 💯 完美还原 OpenAI ChatGPT 的界面设计
- 🚀 采用现代技术栈开发（Next.js 15、React、TypeScript、Tailwind CSS）
- 💻 响应式设计，适配各种设备
- 🎨 清爽直观的用户界面
- 📁 支持文件附件功能
- 🔄 可收起的侧边栏设计
- 🌙 流畅的动画和过渡效果
- 🔍 聊天搜索功能
- 📱 移动端友好设计

### 截图展示

![主界面](/assets/example1.png)
*带侧边栏的主聊天界面*

![移动端视图](/assets/example2.png)
*侧边栏收起的主页面展示*

![深色模式](/assets/example3.png)
*问答页面展示*

### 技术栈

- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Lucide Icons
- Shadcn/ui

### 快速开始

1. 克隆仓库
```bash
git clone https://github.com/sycamore792/chatgpt.git
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
```bash
# 在根目录创建 .env.local 文件
cp .env.example .env.local

# 编辑 .env.local 文件，填入您的配置
# OPENAI_API_KEY=你的OpenAI_API密钥
# NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. 启动开发服务器
```bash
npm run dev
# 或
yarn dev
# 或
pnpm dev
```

4. 用浏览器打开 [http://localhost:3000](http://localhost:3000) 查看结果。

### 部署

1. 构建应用
```bash
npm run build
# 或
yarn build
# 或
pnpm build
```

2. 在您的托管平台上配置环境变量
```
OPENAI_API_KEY=你的OpenAI_API密钥
NEXT_PUBLIC_APP_URL=你的应用URL
```

3. 将应用部署到您选择的托管平台（Vercel、Netlify等）

### 开发路线图

- 🔮 集成多种AI模型（Claude、Gemini等）
- 🔐 用户认证
- 💾 持久化聊天历史
- 🖼️ 多模态的输入（语音，图像）
- 🧠 跨会话记忆管理
- 📊 使用分析和统计功能
- 🌐 多语言支持
- 🔌 插件系统以扩展功能
- 🤝 协作式聊天会话

---

## License

MIT License
