# Platform — 旅行照片 / Gemini 修图 / VLOG 框架

本目录是**与当前静态行程页分离**的产品骨架：类型、契约、环境变量约定。  
实现应用时可：

- **方案 A**：在本仓库新增 `platform/web`（Next.js）并 `npm install`；或  
- **方案 B**：新建独立 repo，把本目录复制为子模块或初始结构。

## 目录

| 路径 | 说明 |
|------|------|
| `web/` | **Next.js 15 应用**（`npm install` / `npm run dev`）— Vercel 子目录部署入口 |
| `types/` | 领域实体 TypeScript 定义（供前后端共享） |
| `contracts/` | HTTP API 草稿（Markdown） |
| `jobs/` | 异步任务说明（修图、成片） |
| `env.example` | 环境变量清单（勿提交真实密钥） |

## 原则

1. **原图与修图版本**永远分对象存储 key，数据库只存指针与元数据。  
2. **修图与 VLOG** 必须是 **异步 Job**（HTTP 只返回 `jobId` + 轮询/Webhook）。  
3. **Gemini 调用只在服务端**（密钥永不进浏览器）。

## 与 `docs/TRIP_MEDIA_PLATFORM.md`

愿景、阶段、架构图以文档为准；本目录随实现更新 `contracts` 与 `types`。
