import { getPageById, patchPage, deletePage } from "@/lib/repositories/pages";
import { problemResponse, validationProblem } from "@/lib/http/problem";
import { SlugConflictError } from "@/lib/errors";
import { updatePageSchema } from "@/lib/validation/page";

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
    const parsedBody = updatePageSchema.safeParse(body);

    if (!parsedBody.success) return validationProblem(parsedBody.error);

    const updatedPage = await patchPage(id, parsedBody.data);

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

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const deletedPage = await deletePage(id);
    if (!deletedPage) {
      return problemResponse({
        title: "Not Found",
        status: 404,
        detail: `Page with id "${id}" not found.`,
        code: "NOT_FOUND",
      });
    }

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return problemResponse({
      title: "Internal Server Error",
      status: 500,
      detail: "Failed to delete page",
      code: "SERVER_ERROR",
    });
  }
}
