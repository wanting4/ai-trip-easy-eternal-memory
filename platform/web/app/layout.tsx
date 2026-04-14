import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trip Media · platform/web",
  description: "Scaffold for photos, Gemini enhance, and VLOG jobs — see platform/README.md",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
