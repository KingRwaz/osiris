import { NextResponse } from "next/server";
import { getEnabledComponents, SYSTEM_VERSION } from "@/lib/system/config";
import { executeQuery } from "@/lib/system/orchestrator";
import type { IntelligenceQuery } from "@/lib/system/types";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    platform: "OSIRIS",
    version: SYSTEM_VERSION,
    status: "operational",
    generatedAt: new Date().toISOString(),
    components: getEnabledComponents(),
  });
}

export async function POST(request: Request) {
  let body: IntelligenceQuery;

  try {
    body = (await request.json()) as IntelligenceQuery;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body.query || body.query.trim().length < 2) {
    return NextResponse.json({ error: "A non-empty query is required." }, { status: 400 });
  }

  const origin = new URL(request.url).origin;
  const response = await executeQuery({
    query: body.query.trim(),
    domains: body.domains,
    limit: body.limit,
  }, origin);

  return NextResponse.json(response, {
    headers: { "Cache-Control": "no-store" },
  });
}
