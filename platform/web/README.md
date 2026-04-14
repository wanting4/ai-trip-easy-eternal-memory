# `platform/web` — Next.js (Vercel-ready)

## 开发

```bash
cd platform/web
npm install
npm run dev
```

打开 <http://localhost:3000>；健康检查：<http://localhost:3000/api/health>。

## 部署（Vercel）

1. 在 Vercel 新建 Project，**Root Directory** 设为 `platform/web`（或从 monorepo 选子目录）。  
2. Build / Install 使用默认即可（`next build`）。  
3. 将 `platform/env.example` 里的变量逐步加到 Vercel Environment（勿提交密钥）。

## 与根目录静态行程

- 根目录 `index.html` 可继续单独部署（GitHub Pages 等）。  
- 本 App 演进为「账号 / 上传 / Gemini / 队列」后，可用环境变量 `NEXT_PUBLIC_TRIP_STATIC_URL` 链回只读行程（后续你自己加）。

## 版本

- Next 15 · React 19 · TypeScript 5
