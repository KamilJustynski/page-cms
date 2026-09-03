import { Status } from "@/lib/validation/page";

export type Page = {
  id: string;
  slug: string;
  title: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
};
