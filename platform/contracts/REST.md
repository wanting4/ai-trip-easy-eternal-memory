# REST API 契约（草稿 v0.1）

Base URL: `https://api.example.com/v1`（占位）

所有写操作需 **Bearer** 或 Session；以下为形状说明，非最终路径。

---

## Trips

### `POST /trips`

创建行程。

```json
{
  "title": "Oahu 2026",
  "startDate": "2026-04-17",
  "endDate": "2026-04-21",
  "timezone": "Pacific/Honolulu"
}
```

### `GET /trips/:tripId`

含 `days[]` 摘要。

### `PATCH /trips/:tripId`

更新标题、标记 `completed`（结束后才允许 VLOG）。

---

## Days & photos

### `POST /trips/:tripId/days/:dayId/photos`

**multipart**：`file` + 可选 `takenAt`。

响应：

```json
{
  "photoAsset": { "id": "uuid", "storageKeyOriginal": "…" }
}
```

### `GET /trips/:tripId/days/:dayId/photos`

列表原图 + 最新修图 job 状态。

---

## Gemini 修图

### `POST /photo-assets/:photoId/enhance`

Body：

```json
{ "presetId": "natural_v1" }
```

响应（异步）：

```json
{ "jobId": "uuid", "status": "queued" }
```

### `GET /enhancement-jobs/:jobId`

轮询直到 `ready` / `failed`。

---

## VLOG

### `POST /trips/:tripId/vlog`

前置：`trip.status === "completed"`（或显式 `force: true` 内测）。

响应：

```json
{ "jobId": "uuid", "status": "queued" }
```

### `GET /vlog-jobs/:jobId`

---

## Webhooks（可选）

- `POST /internal/webhooks/gemini` — 若不用轮询而用提供商回调（按实际选型）。

---

版本与 `platform/types/entities.ts` 同步迭代。
