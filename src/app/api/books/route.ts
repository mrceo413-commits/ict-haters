import { readStore } from "@/lib/data";

export async function GET() {
  const { books } = readStore();
  return Response.json(books);
}
