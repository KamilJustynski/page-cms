import { SlugConflictError } from "@/lib/errors";
import { listPages, createPage } from "@/lib/repositories/pages";
import { problemResponse } from "@/lib/http/problem";

export async function GET() {
  const pages = await listPages();
  return Response.json(pages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const newPage = await createPage(body);

    return Response.json(newPage, {
      headers: {
        Location: `/api/v1/pages/${newPage.id}`,
      },
      status: 201,
    });
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
      detail: "Failed to create page",
      code: "SERVER_ERROR",
    });
  }
}
