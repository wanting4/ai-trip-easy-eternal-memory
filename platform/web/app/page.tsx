import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: "2rem", maxWidth: 640 }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>Trip Media Platform</h1>
      <p style={{ color: "var(--muted)" }}>
        Next.js scaffold under <code>platform/web</code>. Static itinerary stays at repo root{" "}
        <code>index.html</code>; this app is for uploads, jobs, and APIs later.
      </p>
      <ul>
        <li>
          <Link href="/api/health">GET /api/health</Link> — smoke test for Vercel
        </li>
      </ul>
    </main>
  );
}
