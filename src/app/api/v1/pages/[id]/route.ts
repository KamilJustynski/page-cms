import { getPageById, patchPage, deletePage } from "@/lib/repositories/pages";
import {
  errorProblem,
  notFoundProblem,
  validationProblem,
} from "@/lib/http/problem";
import { pageParamsSchema, updatePageSchema } from "@/lib/validation/page";
import { requireAuth } from "@/lib/auth/guard";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const parsedParams = pageParamsSchema.safeParse(await params);

  if (!parsedParams.success) return validationProblem(parsedParams.error);

  const { id } = parsedParams.data;
  const page = await getPageById(id);

  if (!page) return notFoundProblem("Page", id);

  return Response.json(page);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAuth();
    if (denied) return denied;
    const parsedParams = pageParamsSchema.safeParse(await params);
    if (!parsedParams.success) return validationProblem(parsedParams.error);
    const { id } = parsedParams.data;
    const body = await request.json();
    const parsedBody = updatePageSchema.safeParse(body);

    if (!parsedBody.success) return validationProblem(parsedBody.error);

    const updatedPage = await patchPage(id, parsedBody.data);

    if (!updatedPage) return notFoundProblem("Page", id);
    return Response.json(updatedPage);
  } catch (error) {
    return errorProblem(error, "Failed to update page");
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const denied = await requireAuth();
    if (denied) return denied;
    const parsedParams = pageParamsSchema.safeParse(await params);
    if (!parsedParams.success) return validationProblem(parsedParams.error);
    const { id } = parsedParams.data;
    const deletedPage = await deletePage(id);

    if (!deletedPage) return notFoundProblem("Page", id);

    return new Response(null, { status: 204 });
  } catch (error) {
    return errorProblem(error, "Failed to delete page");
  }
}
