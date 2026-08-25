import { getPageById, patchPage } from "@/lib/repositories/pages";
import { problemResponse } from "@/lib/http/problem";
import { SlugConflictError } from "@/lib/errors";

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

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedPage = await patchPage(id, body);
    if (!updatedPage) {
      return problemResponse({
        title: "Not Found",
        status: 404,
        detail: `Page with id "${id}" not found.`,
        code: "NOT_FOUND",
      });
    }
    return Response.json(updatedPage);
  } catch (error) {
    if (error instanceof SlugConflictError) {
      return problemResponse({
        title: "Conflict",
        status: 409,
        detail: error.message,
        code: "SLUG_CONFLICT",
      });
    }

    if (error instanceof SyntaxError) {
      return problemResponse({
        title: "Bad Request",
        status: 400,
        detail: "The request body contains invalid JSON.",
        code: "INVALID_JSON",
      });
    }

    console.error(error);
    return problemResponse({
      title: "Internal Server Error",
      status: 500,
      detail: "Failed to update page",
      code: "SERVER_ERROR",
    });
  }
}
