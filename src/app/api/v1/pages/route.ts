import { SlugConflictError } from "@/lib/errors";
import { listPages, createPage } from "@/lib/repositories/pages";
import { problemResponse, validationProblem } from "@/lib/http/problem";
import { createPageSchema } from "@/lib/validation/page";

export async function GET() {
  const pages = await listPages();
  return Response.json(pages);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsedBody = createPageSchema.safeParse(body);

    if (!parsedBody.success) return validationProblem(parsedBody.error);

    const newPage = await createPage(parsedBody.data);

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
