# 异步任务（Jobs）

修图与 VLOG **禁止**在 HTTP 请求内同步跑完（易超时、难重试、难观测）。

## 推荐形态

| Job            | 输入              | 输出                 | 说明 |
|----------------|-------------------|----------------------|------|
| `enhance_photo`| `photoAssetId` + preset | `storageKeyEnhanced` | 调 Gemini；写回 Blob；更新 `EnhancementJob` |
| `render_vlog`  | `tripId`          | `storageKeyOutput`   | 读多天 `PhotoAsset`/`Enhancement`；生成时间线；FFmpeg 或视频 API |

## 队列选型（择一）

- **Inngest** / **Trigger.dev**：与 Next.js 集成快，适合 MVP。  
- **Vercel Workflow**：长步骤、可暂停重试。  
- **Cloud Tasks + Cloud Run**：更重、更可控。

## 观测

- 每 Job：`startedAt`, `finishedAt`, `errorMessage`, `retryCount`。  
- 产品内「处理中」状态由客户端轮询 `GET .../jobs/:id` 或 SSE。

## 成本

- 修图：按张 × Gemini 单价计入 `estimatedCostCents`（可选字段，后期加）。
