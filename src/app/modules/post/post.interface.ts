import { PostStatus } from "../../../../generated/prisma/enums";
import { PostWhereInput } from "../../../../generated/prisma/models";

export interface ICreatePostPayload {
  title: string;
  content: string;
  thumbnail?: string;
  tags?: string[];
}

export interface IUpdatePost {
  title?: string;
  content?: string;
  tags?: string[];
  thumbnail?: string;
  status?: PostStatus;
}

export interface IPostQuery extends PostWhereInput {
  searchTerm?: string;
  limit?: string;
  page?: string;
  sortBy?: string;
  sortOrder?: string;
}
