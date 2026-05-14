import { NextRequest } from "next/server";
import { validateCredentials, generateToken } from "@/lib/auth";

const tokens = new Set<string>();

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { id, password } = body;

  if (!validateCredentials(id, password)) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = generateToken();
  tokens.add(token);

  return Response.json({ token });
}

export function isValidToken(token: string): boolean {
  return tokens.has(token);
}
