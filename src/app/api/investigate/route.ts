import { NextResponse } from "next/server";
import { investigate } from "@/lib/osiris/core/engine";
import type { IntelligenceQuery } from "@/lib/osiris/core/types";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: IntelligenceQuery;

  try {
    body = (await request.json()) as IntelligenceQuery;
  } catch {
    return NextResponse.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  if (!body.question || body.question.trim().length < 2) {
    return NextResponse.json({ error: "A non-empty investigation question is required." }, { status: 400 });
  }

  const result = investigate({ ...body, question: body.question.trim() });
  return NextResponse.json(result);
}
