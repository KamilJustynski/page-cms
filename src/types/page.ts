export type Page = {
  id: string;
  slug: string;
  title: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
  updatedAt: string;
};

export type PageInput = Omit<
  Page,
  "id" | "createdAt" | "updatedAt" | "status"
> & {
  status?: Page["status"];
};
