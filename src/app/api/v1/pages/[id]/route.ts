import { getPageById } from "@/lib/repositories/pages";
import { problemResponse } from "@/lib/http/problem";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const page = await getPageById(id);

  if (!page) {
    return problemResponse({
      title: "Not Found",
      status: 404,
      detail: `Page with id "${id}" not found.`,
      code: "NOT_FOUND",
    });
  }

  return Response.json(page);
}
