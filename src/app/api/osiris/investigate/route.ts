import { NextRequest, NextResponse } from "next/server";
import { investigate } from "@/lib/osiris/core/engine";
import type { IntelligenceDomain, IntelligenceQuery } from "@/lib/osiris/core/types";

const domains = new Set<IntelligenceDomain>([
  "geopolitical", "financial", "trade", "agriculture", "infrastructure",
  "cyber", "environment", "aviation", "maritime", "space", "social", "general",
]);

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const question = typeof body.question === "string" ? body.question.trim() : "";
  if (!question) return NextResponse.json({ error: "question is required" }, { status: 400 });

  const domain = typeof body.domain === "string" && domains.has(body.domain) ? body.domain as IntelligenceDomain : undefined;
  const limit = typeof body.limit === "number" ? Math.max(1, Math.min(100, Math.floor(body.limit))) : 25;
  const entity = typeof body.entity === "string" ? body.entity.trim() : undefined;

  const query: IntelligenceQuery = { question, domain, entity, limit };
  return NextResponse.json(await investigate(query), { headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: NextRequest) {
  const question = request.nextUrl.searchParams.get("question")?.trim() ?? "";
  if (!question) return NextResponse.json({ error: "question is required" }, { status: 400 });
  const domainParam = request.nextUrl.searchParams.get("domain");
  const domain = domainParam && domains.has(domainParam as IntelligenceDomain) ? domainParam as IntelligenceDomain : undefined;
  const limitParam = Number(request.nextUrl.searchParams.get("limit") ?? "25");
  const limit = Number.isFinite(limitParam) ? Math.max(1, Math.min(100, Math.floor(limitParam))) : 25;
  const entity = request.nextUrl.searchParams.get("entity")?.trim() || undefined;
  return NextResponse.json(await investigate({ question, domain, entity, limit }), { headers: { "Cache-Control": "no-store" } });
}
