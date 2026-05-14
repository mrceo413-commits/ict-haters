import { randomBytes } from "crypto";

const ADMIN_ID = "Nahid";
const ADMIN_PASSWORD = "2050";

export function validateCredentials(id: string, password: string): boolean {
  return id === ADMIN_ID && password === ADMIN_PASSWORD;
}

export function generateToken(): string {
  return randomBytes(32).toString("hex");
}
