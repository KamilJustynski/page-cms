import { listPages, createPage } from "@/lib/repositories/pages";
import { errorProblem, validationProblem } from "@/lib/http/problem";
import { createPageSchema } from "@/lib/validation/page";
import { requireAuth } from "@/lib/auth/guard";

export async function GET() {
  const pages = await listPages();
  return Response.json(pages);
}

export async function POST(request: Request) {
  try {
    const denied = await requireAuth();
    if (denied) return denied;
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
    return errorProblem(error, "Failed to create page");
  }
}
