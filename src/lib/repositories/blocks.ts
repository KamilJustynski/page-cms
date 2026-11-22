import type { Block } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma/client";
import { CreateBlockInput, UpdateBlockInput } from "../validation/block";
import { BlockTypeMismatchError, BlockOrderMismatchError } from "../errors";

export async function listBlocks(pageId: string): Promise<Block[]> {
  return prisma.block.findMany({
    where: { pageId },
    orderBy: { position: "asc" },
  });
}

export async function createBlock(
  pageId: string,
  input: CreateBlockInput,
): Promise<Block | null> {
  const { type, data } = input;

  const last = await prisma.block.aggregate({
    where: { pageId },
    _max: { position: true },
  });

  const position = last._max.position === null ? 0 : last._max.position + 1;
  try {
    return await prisma.block.create({
      data: { pageId, type, position, data },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return null;
    }
    throw error;
  }
}

export async function patchBlock(
  id: string,
  updates: UpdateBlockInput,
): Promise<Block | null> {
  const existing = await prisma.block.findUnique({ where: { id } });
  if (!existing) return null;

  if (existing.type !== updates.type) {
    throw new BlockTypeMismatchError(existing.type, updates.type);
  }

  const merged = {
    ...(existing.data as Record<string, unknown>),
    ...updates.data,
  };

  try {
    return await prisma.block.update({
      where: { id },
      data: { data: merged },
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") return null;
    }
    throw error;
  }
}

export async function deleteBlock(id: string): Promise<boolean> {
  try {
    await prisma.block.delete({ where: { id } });
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

export async function reorderBlocks(
  pageId: string,
  blockIds: string[],
): Promise<Block[] | null> {
  return prisma.$transaction(async (tx) => {
    const page = await tx.page.findUnique({
      where: { id: pageId },
      select: { id: true },
    });
    if (!page) return null;

    const existing = await tx.block.findMany({
      where: { pageId },
      select: { id: true },
    });

    const existingIds = new Set(existing.map((block) => block.id));
    const requestedIds = new Set(blockIds);

    const isSameSet =
      blockIds.length === existingIds.size &&
      requestedIds.size === blockIds.length &&
      [...requestedIds].every((id) => existingIds.has(id));

    if (!isSameSet) {
      throw new BlockOrderMismatchError(pageId);
    }

    for (const [index, id] of blockIds.entries()) {
      await tx.block.update({ where: { id }, data: { position: index } });
    }

    return tx.block.findMany({
      where: { pageId },
      orderBy: { position: "asc" },
    });
  });
}
