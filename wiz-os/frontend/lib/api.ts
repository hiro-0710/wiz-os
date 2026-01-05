export async function setWizMode(mode: string) {
  const api = process.env.NEXT_PUBLIC_WIZ_API_URL;

  if (!api) {
    console.error("❌ NEXT_PUBLIC_WIZ_API_URL が設定されていません");
    return;
  }

  try {
    await fetch(`${api}/mode/${mode}`, { method: "POST" });
  } catch (err) {
    console.error("⚠️ mode API error:", err);
  }
}
