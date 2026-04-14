/**
 * 领域模型草稿 — 实现时对齐数据库表与 API 契约。
 * 当前仓库无 TS 构建链，本文件供 IDE/未来 monorepo 引用。
 */

export type ISODate = string;
export type ISODateTime = string;
export type UUID = string;

/** 一次旅行（可与现有行程 HTML 映射为同一 logicalId） */
export interface Trip {
  id: UUID;
  ownerUserId: UUID;
  title: string;
  /** 与 index 行程对齐，如 2026-04-17 */
  startDate: ISODate;
  endDate: ISODate;
  timezone: string;
  createdAt: ISODateTime;
  updatedAt: ISODateTime;
  /** 行程结束后才允许触发 VLOG 主任务 */
  status: "planning" | "in_progress" | "completed";
}

export interface TripDay {
  id: UUID;
  tripId: UUID;
  /** 当地日历日 */
  date: ISODate;
  sortIndex: number;
  /** 可选：与 HTML 里 D1/D2 文案同步的 slug */
  slug?: string;
}

/** 用户上传的原图 */
export interface PhotoAsset {
  id: UUID;
  tripDayId: UUID;
  storageKeyOriginal: string;
  mimeType: string;
  width?: number;
  height?: number;
  takenAt?: ISODateTime;
  createdAt: ISODateTime;
  /** 客户端生成缩略图 key，可选 */
  storageKeyThumbnail?: string;
}

export type EnhancementStatus =
  | "queued"
  | "processing"
  | "ready"
  | "failed";

/** 一次「一键修图」任务（Gemini 出图或出参再合成） */
export interface EnhancementJob {
  id: UUID;
  photoAssetId: UUID;
  status: EnhancementStatus;
  /** 修图结果；可与 original 同 bucket 不同 key */
  storageKeyEnhanced?: string;
  /** 用户选的预设：自然 / 胶片 / 夜景 等 */
  presetId: string;
  provider: "gemini";
  errorMessage?: string;
  createdAt: ISODateTime;
  finishedAt?: ISODateTime;
}

export type VlogJobStatus =
  | "queued"
  | "scripting"
  | "rendering"
  | "ready"
  | "failed";

/** 行程结束后整条 VLOG 渲染 */
export interface VlogRenderJob {
  id: UUID;
  tripId: UUID;
  status: VlogJobStatus;
  /** 成片 mp4 等 */
  storageKeyOutput?: string;
  /** 可选：Gemini 生成的分镜/字幕 JSON */
  scriptJsonKey?: string;
  createdAt: ISODateTime;
  finishedAt?: ISODateTime;
}

/** 通知用户「修图好了 / VLOG 好了」 */
export interface OutboundNotification {
  id: UUID;
  userId: UUID;
  channel: "email" | "push" | "sms";
  payload: Record<string, unknown>;
  sentAt?: ISODateTime;
}
