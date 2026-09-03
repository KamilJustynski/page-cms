import type { Page } from "@/types/page";
import { SlugConflictError } from "@/lib/errors";
import type { CreatePageInput, UpdatePageInput } from "@/lib/validation/page";

const pages: Page[] = [
  {
    id: "1",
    slug: "home",
    title: "Home",
    status: "published",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    slug: "about",
    title: "About",
    status: "draft",
    createdAt: "2023-03-10T00:00:00.000Z",
    updatedAt: "2023-03-10T00:00:00.000Z",
  },
  {
    id: "3",
    slug: "contact",
    title: "Contact",
    status: "published",
    createdAt: "2023-07-19T00:00:00.000Z",
    updatedAt: "2023-07-19T00:00:00.000Z",
  },
];

export async function listPages(): Promise<Page[]> {
  return [...pages];
}

export async function createPage(page: CreatePageInput): Promise<Page> {
  const { slug, title, status = "draft" } = page;

  if (pages.some((p) => p.slug === slug)) {
    throw new SlugConflictError(slug);
  }

  const dateNow = new Date().toISOString();
  const newPage = {
    slug,
    title,
    status,
    id: crypto.randomUUID(),
    createdAt: dateNow,
    updatedAt: dateNow,
  };

  pages.push(newPage);
  return newPage;
}

export async function getPageById(id: string): Promise<Page | null> {
  return pages.find((p) => p.id === id) || null;
}

export async function patchPage(
  id: string,
  updates: Partial<UpdatePageInput>,
): Promise<Page | null> {
  const { slug, title, status } = updates;
  const pageIndex = pages.findIndex((p) => p.id === id);
  const existingPage = pages[pageIndex];

  if (!existingPage) {
    return null;
  }

  if (slug && slug !== existingPage.slug) {
    if (pages.some((p) => p.slug === slug)) {
      throw new SlugConflictError(slug);
    }
  }

  const updatedPage = {
    ...existingPage,
    slug: slug ?? existingPage.slug,
    title: title ?? existingPage.title,
    status: status ?? existingPage.status,
    updatedAt: new Date().toISOString(),
  };

  pages[pageIndex] = updatedPage;
  return updatedPage;
}

export async function deletePage(id: string): Promise<boolean> {
  const pageIndex = pages.findIndex((p) => p.id === id);
  const existingPage = pages[pageIndex];

  if (!existingPage) {
    return false;
  }

  pages.splice(pageIndex, 1);
  return true;
}
