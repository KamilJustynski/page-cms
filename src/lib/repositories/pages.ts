import type { Page } from "@/generated/prisma/client";
import { SlugConflictError } from "@/lib/errors";
import type { CreatePageInput, UpdatePageInput } from "@/lib/validation/page";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";

export async function listPages(): Promise<Page[]> {
  return prisma.page.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createPage(page: CreatePageInput): Promise<Page> {
  const { slug, title, status = "draft" } = page;

  try {
    return await prisma.page.create({ data: { slug, title, status } });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      throw new SlugConflictError(slug);
    }
    throw error;
  }
}

export async function getPageById(id: string): Promise<Page | null> {
  return prisma.page.findUnique({ where: { id } });
}

export async function patchPage(
  id: string,
  updates: Partial<UpdatePageInput>,
): Promise<Page | null> {
  const { slug, title, status } = updates;

  try {
    return await prisma.page.update({
      where: { id },
      data: { slug, title, status, updatedAt: new Date() },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") return null;
      if (error.code === "P2002" && slug) throw new SlugConflictError(slug);
    }
    throw error;
  }
}

export async function deletePage(id: string): Promise<boolean> {
  try {
    await prisma.page.delete({ where: { id } });
    return true;
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return false;
    }
    throw error;
  }
}
