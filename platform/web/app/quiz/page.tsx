import { Suspense } from "react";
import { QuizPageClient } from "./QuizPageClient";

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <main style={{ padding: "2rem", maxWidth: 560, margin: "0 auto" }}>
          <p style={{ color: "var(--muted)" }}>加载测验…</p>
        </main>
      }
    >
      <QuizPageClient />
    </Suspense>
  );
}
