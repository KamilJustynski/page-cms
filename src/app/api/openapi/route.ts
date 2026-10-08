import { openApiDocument } from "@/lib/openapi/document";
import { requireAuth } from "@/lib/auth/guard";

export async function GET() {
  const denied = await requireAuth();
  if (denied) return denied;
  return Response.json(openApiDocument);
}
