import { StatusCodes } from "http-status-codes";
import { prisma } from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  ICreateCommentPayload,
  IUpdateCommentPayload,
} from "./comment.interface";
import { IJwtTokenPayload } from "../../interface/interface";
import { CommentStatus } from "../../../../generated/prisma/enums";

const createCommentIntDB = async (
  authorId: string,
  payload: ICreateCommentPayload,
) => {
  const post = await prisma.post.findUnique({ where: { id: payload.postId } });
  if (!post) {
    throw new AppError(StatusCodes.NOT_FOUND, "Post not found");
  }

  if (post.status === "DRAFT" && post.authorId != authorId) {
    throw new AppError(StatusCodes.BAD_REQUEST, "The post is in draft");
  }
  const commentData = {
    authorId,
    ...payload,
  };

  const result = await prisma.comment.create({
    data: commentData,
  });
  return result;
};

const getCommentByCommentIdFromDB = async (commentId: string) => {
  const result = await prisma.comment.findUnique({
    where: { id: commentId, status: "APPROVED" },
    include: {
      post: {
        select: {
          content: true,
          author: { select: { name: true } },
        },
      },
    },
  });
  if (!result) {
    throw new AppError(
      StatusCodes.NOT_FOUND,
      "Comment not found! May be rejected",
    );
  }
  return result;
};

const getCommentsByAuthorIdFromDB = async (authorId: string) => {
  const result = await prisma.comment.findMany({
    where: { authorId: authorId },
    include: {
      post: {
        select: {
          content: true,
          author: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });
  return result;
};

const updateCommentIntoDB = async (
  authorId: string,
  commentId: string,
  payload: IUpdateCommentPayload,
) => {
  const comment = await prisma.comment.findUnique({
    where: { id: commentId, status: "APPROVED" },
  });
  
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Comment not found");
  }

  if (authorId != comment.authorId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not permitted to update",
    );
  }

  const result = await prisma.comment.update({
    where: { id: commentId },
    data: payload,
  });
  return result;
};

const deleteComment = async (user: IJwtTokenPayload, commentId: string) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Comment not found");
  }
  if (user.role != "ADMIN" && user.id != comment.authorId) {
    throw new AppError(
      StatusCodes.FORBIDDEN,
      "You are not permitted to detete the post",
    );
  }
  const result = await prisma.comment.delete({ where: { id: commentId } });
  return null;
};

const moderateCommentIntoDB = async (
  commentId: string,
  payload: { status: CommentStatus },
) => {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) {
    throw new AppError(StatusCodes.NOT_FOUND, "Comment fot found");
  }

  if (comment.status === payload.status) {
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `Comment status is already ${payload.status}`,
    );
  }

  const result = await prisma.comment.update({
    where: { id: commentId },
    data: {
      status: payload.status,
    },
  });
  return result;
};

export const CommentService = {
  createCommentIntDB,
  getCommentByCommentIdFromDB,
  getCommentsByAuthorIdFromDB,
  updateCommentIntoDB,
  deleteComment,
  moderateCommentIntoDB,
};
