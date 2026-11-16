import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export function GET() {
  return NextResponse.json({ status: "ok", service: "maceioia", chatMode: "local" }, { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex" } });
}
