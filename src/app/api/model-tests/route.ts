import { readStore } from "@/lib/data";

export async function GET() {
  const { modelTests } = readStore();
  return Response.json(modelTests);
}
