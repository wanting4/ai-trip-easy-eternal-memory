"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { getHonorTitle, quizQuestions, type QuizQuestion } from "./quizConfig";

function totalFromSelections(
  selections: Partial<Record<string, string>>,
  questions: QuizQuestion[],
): number {
  let sum = 0;
  for (const q of questions) {
    const optionId = selections[q.id];
    if (!optionId) continue;
    const opt = q.options.find((o) => o.id === optionId);
    if (opt) sum += opt.score;
  }
  return sum;
}

function isLikelyUniqueViolation(message: string): boolean {
  return /duplicate|unique/i.test(message);
}

export function QuizPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteTripId = searchParams.get("trip_id")?.trim() || null;

  const [selections, setSelections] = useState<Partial<Record<string, string>>>(
    {},
  );
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const totalScore = useMemo(
    () => totalFromSelections(selections, quizQuestions),
    [selections],
  );

  const honorTitle = useMemo(() => getHonorTitle(totalScore), [totalScore]);

  const allAnswered = quizQuestions.every((q) => Boolean(selections[q.id]));

  function selectOption(questionId: string, optionId: string) {
    setSelections((prev) => ({ ...prev, [questionId]: optionId }));
    setSubmitError(null);
  }

  async function handleSubmit() {
    if (!allAnswered) {
      setSubmitError("请先完成全部题目。");
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    try {
      const supabase = getSupabaseBrowserClient();
      const profileId = crypto.randomUUID();
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: profileId,
          score: totalScore,
          title: honorTitle,
        })
        .select("id")
        .single();

      if (error) {
        setSubmitError(error.message);
        return;
      }
      if (!data?.id) {
        setSubmitError("未返回档案 ID，请检查表是否启用 gen_random_uuid() 或 RLS。");
        return;
      }

      if (inviteTripId) {
        const { error: memberErr } = await supabase.from("trip_members").insert({
          trip_id: inviteTripId,
          user_id: data.id,
        });
        if (memberErr && !isLikelyUniqueViolation(memberErr.message)) {
          setSubmitError(memberErr.message);
          return;
        }
        router.push(`/trip/${inviteTripId}`);
        return;
      }

      router.push(`/profile/${data.id}`);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
      <p style={{ marginBottom: "1rem" }}>
        <Link href="/" style={{ color: "var(--muted)" }}>
          ← 返回首页
        </Link>
      </p>
      <h1 style={{ fontSize: "1.35rem", fontWeight: 700, marginBottom: "0.5rem" }}>
        旅行风格小测验
      </h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem" }}>
        每题选一项，分数会累加；提交后写入档案
        {inviteTripId ? "并加入当前旅行房间。" : "并查看你的称号。"}
      </p>
      {inviteTripId ? (
        <p
          style={{
            marginBottom: "1rem",
            fontSize: "0.9rem",
            color: "#7dd3fc",
          }}
        >
          你正通过邀请参与行程 <code style={{ wordBreak: "break-all" }}>{inviteTripId}</code>
        </p>
      ) : null}

      <ol style={{ paddingLeft: "1.25rem", margin: 0, display: "flex", flexDirection: "column", gap: "1.75rem" }}>
        {quizQuestions.map((q) => (
          <li key={q.id} style={{ listStylePosition: "outside" }}>
            <p style={{ fontWeight: 600, margin: "0 0 0.75rem" }}>{q.prompt}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {q.options.map((opt) => {
                const selected = selections[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => selectOption(q.id, opt.id)}
                    style={{
                      textAlign: "left",
                      padding: "0.65rem 0.85rem",
                      borderRadius: 8,
                      border: selected ? "1px solid #7dd3fc" : "1px solid #3f3f46",
                      background: selected ? "#27272a" : "transparent",
                      color: "var(--fg)",
                      cursor: "pointer",
                      font: "inherit",
                      lineHeight: 1.4,
                    }}
                  >
                    {opt.label}
                    <span style={{ color: "var(--muted)", fontSize: "0.85em", marginLeft: "0.35rem" }}>
                      (+{opt.score})
                    </span>
                  </button>
                );
              })}
            </div>
          </li>
        ))}
      </ol>

      <section
        style={{
          marginTop: "2rem",
          paddingTop: "1.25rem",
          borderTop: "1px solid #27272a",
        }}
      >
        <p style={{ margin: "0 0 0.75rem" }}>
          当前总分：<strong>{totalScore}</strong>
          {" · "}
          称号预览：<strong>{honorTitle}</strong>
        </p>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "0.65rem 1.25rem",
            borderRadius: 8,
            border: "none",
            background: submitting ? "#52525b" : "#0369a1",
            color: "#fafafa",
            fontWeight: 600,
            cursor: submitting ? "not-allowed" : "pointer",
            font: "inherit",
          }}
        >
          {submitting ? "提交中…" : "提交"}
        </button>
        {submitError ? (
          <p style={{ color: "#fca5a5", marginTop: "0.75rem", marginBottom: 0 }}>
            {submitError}
          </p>
        ) : null}
      </section>
    </main>
  );
}
