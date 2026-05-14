import { readStore } from "@/lib/data";

export async function GET() {
  const { questionBank } = readStore();
  return Response.json(questionBank);
}
