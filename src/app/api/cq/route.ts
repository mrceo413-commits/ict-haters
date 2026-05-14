import { NextRequest } from "next/server";
import { readStore } from "@/lib/data";

export async function GET(request: NextRequest) {
  const chapter = request.nextUrl.searchParams.get("chapter");
  if (!chapter) {
    return Response.json({ error: "chapter required" }, { status: 400 });
  }

  const { cqContent } = readStore();
  const entry = cqContent[chapter];

  if (!entry) {
    return Response.json({ error: "Chapter not found" }, { status: 404 });
  }

  return Response.json(entry);
}
