import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { CommentService } from "./comment.service";

const createComment = catchAsync(async (req, res, next) => {
  const authorId = req.user.id;
  const payload = req.body;
  const result = await CommentService.createCommentIntDB(authorId, payload);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "Comments created successfully",
    data: result,
  });
});

const getCommentById = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  const result = await CommentService.getCommentByCommentIdFromDB(
    commentId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Comment retrived successfully",
    data: result,
  });
});

const getCommentByAuthorId = catchAsync(async (req, res, next) => {
  const authorId = req.params.authorId;
  const result = await CommentService.getCommentsByAuthorIdFromDB(
    authorId as string,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Comment retrived successfully",
    data: result,
  });
});

const updateComment = catchAsync(async (req, res, next) => {
  const authorId = req.user.id;
  const commentId = req.params.commentId;
  const payload = req.body;
  const result = await CommentService.updateCommentIntoDB(
    authorId,
    commentId as string,
    payload,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Comment updated successfully",
    data: result,
  });
});

const deleteComment = catchAsync(async (req, res, next) => {
  const user = req.user;
  const commentId = req.params.commentId;

  const result = await CommentService.deleteComment(user, commentId as string);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Comment deleted successfully",
    data: result,
  });
});

const moderateCommnent = catchAsync(async (req, res, next) => {
  const commentId = req.params.commentId;
  const payload = req.body;

  const result = await CommentService.moderateCommentIntoDB(
    commentId as string,
    payload,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Comment moderated successfully",
    data: result,
  });
});

export const CommentController = {
  createComment,
  getCommentById,
  getCommentByAuthorId,
  updateComment,
  deleteComment,
  moderateCommnent,
};
