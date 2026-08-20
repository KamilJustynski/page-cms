import type { Page } from "@/types/page";

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
