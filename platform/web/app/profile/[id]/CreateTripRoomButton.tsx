"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

function addDaysIso(d: Date, days: number): string {
  const x = new Date(d);
  x.setUTCDate(x.getUTCDate() + days);
  return x.toISOString().slice(0, 10);
}

type Props = {
  profileId: string;
};

export function CreateTripRoomButton({ profileId }: Props) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function handleClick() {
    setErr(null);
    setBusy(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const today = new Date();
      const start = today.toISOString().slice(0, 10);
      const end = addDaysIso(today, 7);

      const { data: trip, error: tripErr } = await supabase
        .from("trips")
        .insert({
          title: `旅行房间 · ${start}`,
          start_date: start,
          end_date: end,
          timezone: "Asia/Shanghai",
          status: "planning",
        })
        .select("id")
        .single();

      if (tripErr) {
        setErr(tripErr.message);
        return;
      }
      if (!trip?.id) {
        setErr("未返回行程 ID。");
        return;
      }

      const { error: memberErr } = await supabase.from("trip_members").insert({
        trip_id: trip.id,
        user_id: profileId,
      });

      if (memberErr) {
        setErr(memberErr.message);
        return;
      }

      router.push(`/trip/${trip.id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={busy}
        style={{
          width: "100%",
          padding: "1rem 1.25rem",
          borderRadius: 12,
          border: "none",
          background: busy ? "#52525b" : "#0ea5e9",
          color: "#fafafa",
          fontWeight: 700,
          fontSize: "1.05rem",
          cursor: busy ? "not-allowed" : "pointer",
          font: "inherit",
        }}
      >
        {busy ? "创建中…" : "创建我的旅行房间"}
      </button>
      {err ? (
        <p style={{ color: "#fca5a5", marginTop: "0.75rem", marginBottom: 0, textAlign: "center" }}>
          {err}
        </p>
      ) : null}
    </div>
  );
}
