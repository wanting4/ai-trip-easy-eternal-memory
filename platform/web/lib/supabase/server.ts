import { createClient } from "@supabase/supabase-js";

export function getSupabaseServerClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) {
    const missing = [
      !url && "NEXT_PUBLIC_SUPABASE_URL",
      !anonKey && "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ].filter(Boolean) as string[];
    throw new Error(
      `缺少环境变量: ${missing.join(", ")}。请在 platform/web/.env.local 中写在独立一行（anon key 勿换行），保存后重新执行 npm run dev。`,
    );
  }
  return createClient(url, anonKey);
}
