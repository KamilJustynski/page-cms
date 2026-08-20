export type Page = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
};
