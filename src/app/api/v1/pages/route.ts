import { listPages, createPage } from "@/lib/repositories/pages";

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
  } catch {
    return Response.json({ error: "Failed to create page" }, { status: 500 });
  }
}
