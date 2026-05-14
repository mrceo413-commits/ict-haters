import { NextRequest } from "next/server";
import { validateCredentials, generateToken } from "@/lib/auth";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const tokens = new Map<string, number>();

function cleanExpiredTokens() {
  const now = Date.now();
  for (const [token, createdAt] of tokens) {
    if (now - createdAt > TOKEN_TTL_MS) tokens.delete(token);
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, password } = body;

  if (!validateCredentials(id, password)) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  cleanExpiredTokens();
  const token = generateToken();
  tokens.set(token, Date.now());

  return Response.json({ token });
}

export async function DELETE(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    tokens.delete(auth.slice(7));
  }
  return Response.json({ success: true });
}

export function isValidToken(token: string): boolean {
  const createdAt = tokens.get(token);
  if (createdAt === undefined) return false;
  if (Date.now() - createdAt > TOKEN_TTL_MS) {
    tokens.delete(token);
    return false;
  }
  return true;
}
