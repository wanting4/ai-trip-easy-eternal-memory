import Link from "next/link";
import { headers } from "next/headers";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type TripRow = {
  id: string;
  title: string | null;
  start_date: string | null;
  end_date: string | null;
  timezone: string | null;
  status: string | null;
};

type ProfileEmbed = {
  title: string | null;
  mbti_label: string | null;
};

type MemberRow = {
  user_id: string;
  profiles: ProfileEmbed | ProfileEmbed[] | null;
};

function profileFromJoin(
  profiles: MemberRow["profiles"],
): ProfileEmbed | null {
  if (!profiles) return null;
  if (Array.isArray(profiles)) return profiles[0] ?? null;
  return profiles;
}

async function getRequestOrigin(): Promise<string> {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  if (!host) return "";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export default async function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();

  const { data: trip, error: tripError } = await supabase
    .from("trips")
    .select("id, title, start_date, end_date, timezone, status")
    .eq("id", id)
    .maybeSingle<TripRow>();

  if (tripError) {
    return (
      <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
        <p style={{ color: "#fca5a5" }}>加载失败：{tripError.message}</p>
        <p>
          <Link href="/">返回首页</Link>
        </p>
      </main>
    );
  }

  if (!trip) {
    return (
      <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
        <p>未找到该行程。</p>
        <p>
          <Link href="/">返回首页</Link>
        </p>
      </main>
    );
  }

  const origin = await getRequestOrigin();
  const shareQuizPath = `/quiz?trip_id=${encodeURIComponent(id)}`;
  const shareQuizUrl = origin ? `${origin}${shareQuizPath}` : shareQuizPath;

  const { data: members, error: membersError } = await supabase
    .from("trip_members")
    .select("user_id, profiles(title, mbti_label)")
    .eq("trip_id", id)
    .returns<MemberRow[]>();

  return (
    <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <a
          href={shareQuizUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            padding: "0.85rem 1rem",
            borderRadius: 12,
            background: "#0ea5e9",
            color: "#fafafa",
            fontWeight: 700,
            textDecoration: "none",
            font: "inherit",
            boxSizing: "border-box",
          }}
        >
          分享测验邀请
        </a>
        <p
          style={{
            margin: "0.5rem 0 0",
            fontSize: "0.75rem",
            color: "var(--muted)",
            wordBreak: "break-all",
          }}
        >
          {shareQuizUrl}
        </p>
        {membersError ? (
          <p style={{ color: "#fca5a5", fontSize: "0.9rem", marginTop: "0.75rem", marginBottom: 0 }}>
            成员列表加载失败：{membersError.message}
          </p>
        ) : null}
      </div>

      <h1 style={{ fontSize: "1.35rem", fontWeight: 700 }}>旅行房间</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", wordBreak: "break-all" }}>
        行程 ID：{trip.id}
      </p>
      <dl
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <div>
          <dt style={{ color: "var(--muted)", fontSize: "0.85rem" }}>标题</dt>
          <dd style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{trip.title ?? "—"}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--muted)", fontSize: "0.85rem" }}>日期</dt>
          <dd style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>
            {trip.start_date ?? "—"} — {trip.end_date ?? "—"}
          </dd>
        </div>
        <div>
          <dt style={{ color: "var(--muted)", fontSize: "0.85rem" }}>时区</dt>
          <dd style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{trip.timezone ?? "—"}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--muted)", fontSize: "0.85rem" }}>状态</dt>
          <dd style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{trip.status ?? "—"}</dd>
        </div>
      </dl>

      <section style={{ marginTop: "2rem" }}>
        <h2 style={{ fontSize: "1.05rem", fontWeight: 600, margin: "0 0 0.75rem" }}>
          成员 · 测验称号
        </h2>
        {members?.length ? (
          <ul style={{ margin: 0, paddingLeft: "1.25rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {members.map((m) => {
              const p = profileFromJoin(m.profiles);
              const honor = p?.title?.trim() || "—";
              const mbti = p?.mbti_label?.trim();
              return (
                <li key={m.user_id}>
                  <strong>{honor}</strong>
                  {mbti ? (
                    <span style={{ color: "var(--muted)", fontSize: "0.9rem", marginLeft: "0.35rem" }}>
                      （MBTI：{mbti}）
                    </span>
                  ) : null}
                </li>
              );
            })}
          </ul>
        ) : (
          <p style={{ color: "var(--muted)", margin: 0 }}>暂无成员。</p>
        )}
      </section>

      <p style={{ marginTop: "2rem" }}>
        <Link href="/">首页</Link>
      </p>
    </main>
  );
}
