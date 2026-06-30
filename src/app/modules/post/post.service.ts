import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { ICreatePostPayload, IUpdatePost } from "./post.interface";

const createPostIntoDB = async (
  authorId: string,
  payload: ICreatePostPayload,
) => {
  const result = await prisma.post.create({
    data: {
      ...payload,
      authorId,
      tags: payload.tags ?? [],
    },
  });
  return result;
};
const getAllPostsFromDB = async () => {
  const result = await prisma.post.findMany({
    include: {
      author: {
        omit: {
          password: true,
          email: true,
          activeStatus: true,
        },
      },
      comments: true,
    },
  });
  return result;
};
const getSinglePostFromDB = async (postId: string) => {
  if (!postId.trim()) {
    throw new AppError(StatusCodes.NOT_FOUND, "Post id not found");
  }
  return await prisma.post.update({
    where: { id: postId },
    data: {
      views: { increment: 1 },
    },
    include: {
      author: {
        omit: {
          password: true,
          id: true,
        },
      },
    },
  });
};

const getMyPostsFromDB = async (authorId: string) => {
  console.log(authorId);
  const result = await prisma.post.findMany({
    where: { authorId },
    include: {
      comments: true,
      author: {
        omit: {
          password: true,
        },
      },
      _count: {
        select: {
          comments: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
};
const updatePostIntoDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
  payload: IUpdatePost,
) => {
  const post = await prisma.post.findUniqueOrThrow({ where: { id: postId } });

  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, "Post not found");
  }

  if (!isAdmin && post.authorId != authorId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not the author of this post",
    );
  }

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: payload,
    include: {
      author: {
        omit: {
          password: true,
        },
      },
    },
  });
  return result;
};
const deletePostFromDB = async (
  postId: string,
  authorId: string,
  isAdmin: boolean,
) => {
  const post = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
  });

  if (!isAdmin && post.authorId != authorId) {
    throw new AppError(
      StatusCodes.UNAUTHORIZED,
      "You are not the author of this post",
    );
  }
  await prisma.post.delete({ where: { id: postId } });
  return null;
};

export const PostService = {
  createPostIntoDB,
  getAllPostsFromDB,
  getSinglePostFromDB,
  getMyPostsFromDB,
  updatePostIntoDB,
  deletePostFromDB,
};
