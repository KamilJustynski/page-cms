import { auth } from "@/auth";
import { problemResponse } from "@/lib/http/problem";

export async function requireAuth(): Promise<Response | null> {
  const session = await auth();
  if (session) return null;

  return problemResponse({
    title: "Unauthorized",
    status: 401,
    detail: "Authentication required",
    code: "UNAUTHORIZED",
  });
}
