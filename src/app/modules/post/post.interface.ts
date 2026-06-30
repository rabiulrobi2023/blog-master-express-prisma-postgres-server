import { PostStatus } from "../../../../generated/prisma/enums";

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
