import Link from "next/link";
import { getSupabaseServerClient } from "@/lib/supabase/server";
import { CreateTripRoomButton } from "./CreateTripRoomButton";

type ProfileRow = {
  id: string;
  score: number | null;
  title: string | null;
};

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, score, title")
    .eq("id", id)
    .maybeSingle<ProfileRow>();

  if (error) {
    return (
      <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
        <p style={{ color: "#fca5a5" }}>加载失败：{error.message}</p>
        <p>
          <Link href="/quiz">返回测验</Link>
        </p>
      </main>
    );
  }

  if (!data) {
    return (
      <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
        <p>未找到该档案。</p>
        <p>
          <Link href="/quiz">返回测验</Link>
        </p>
      </main>
    );
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700 }}>你的旅行档案</h1>
      <p style={{ color: "var(--muted)", fontSize: "0.9rem", wordBreak: "break-all" }}>
        ID：{data.id}
      </p>
      <dl
        style={{
          marginTop: "1.5rem",
          display: "grid",
          gap: "0.75rem",
        }}
      >
        <div>
          <dt style={{ color: "var(--muted)", fontSize: "0.85rem" }}>分数</dt>
          <dd style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{data.score ?? "—"}</dd>
        </div>
        <div>
          <dt style={{ color: "var(--muted)", fontSize: "0.85rem" }}>称号</dt>
          <dd style={{ margin: "0.25rem 0 0", fontWeight: 600 }}>{data.title ?? "—"}</dd>
        </div>
      </dl>
      <CreateTripRoomButton profileId={data.id} />

      <p style={{ marginTop: "2rem" }}>
        <Link href="/quiz">再测一次</Link>
        {" · "}
        <Link href="/">首页</Link>
      </p>
    </main>
  );
}
