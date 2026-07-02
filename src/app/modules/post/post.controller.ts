import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PostService } from "./post.service";
import { Role } from "../../../../generated/prisma/enums";
import { IJwtTokenPayload } from "../../interface/interface";

const createPost = catchAsync(async (req, res, next) => {
  const authorId = req.user.id;
  const payload = req.body;
  const result = await PostService.createPostIntoDB(authorId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Post created successfully",
    data: result,
  });
});

const getAllPost = catchAsync(async (req, res, next) => {
  const result = await PostService.getAllPostsFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Post retrived successfully",
    data: result,
  });
});

const getSinglePost = catchAsync(async (req, res, next) => {
  const { postId } = req.params;

  const result = await PostService.getSinglePostFromDB(postId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Post retrived successfully",
    data: result,
  });
});

const getMyPost = catchAsync(async (req, res, next) => {
  const authorId = req.user.id;

  const result = await PostService.getMyPostsFromDB(authorId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Post retrived successfully",
    data: result,
  });
});

const updatePost = catchAsync(async (req, res, next) => {
  const user: IJwtTokenPayload = req.user;
  const postId = req.params.postId;
  const authorId = user.id;
  const payload = req.body;
  const isAdmin = user.role === Role.ADMIN;
  const result = await PostService.updatePostIntoDB(
    postId as string,
    authorId,
    isAdmin,
    payload,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Post updated successfully",
    data: result,
  });
});

const deletePost = catchAsync(async (req, res, next) => {
  const user: IJwtTokenPayload = req.user;
  const authorId = user.id;
  const isAdmin = user.role === "ADMIN";
  const postId = req.params.postId;

  const result = await PostService.deletePostFromDB(
    postId as string,
    authorId,
    isAdmin,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Post deleted successfully",
    data: result,
  });
});

const getPostStats = catchAsync(async (req, res, next) => {
  const result = await PostService.getPostStatsFromDB();
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Post statisticts retived successfully",
    data: result,
  });
});

export const PostContrller = {
  createPost,
  getAllPost,
  getSinglePost,
  getMyPost,
  updatePost,
  deletePost,
  getPostStats
};
