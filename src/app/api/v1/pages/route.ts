import { listPages } from "@/lib/repositories/pages";

export async function GET() {
  const pages = await listPages();
  return Response.json(pages);
}
