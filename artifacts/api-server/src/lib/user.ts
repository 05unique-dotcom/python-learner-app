import type { Request } from "express";

export const ANONYMOUS_USER_ID = "anonymous";

export function getUserId(req: Request): string {
  const header = req.header("x-user-id");
  if (header && header.trim().length > 0) {
    return header.trim();
  }
  return ANONYMOUS_USER_ID;
}
