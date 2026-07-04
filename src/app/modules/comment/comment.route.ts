import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { CommentController } from "./comment.controller";

const router = Router();

router.post("/", auth(Role.ADMIN, Role.USER), CommentController.createComment);

router.get("/:commentId", CommentController.getCommentById);

router.get("/author/:authorId", CommentController.getCommentByAuthorId);

router.patch(
  "/:commentId",
  auth(Role.ADMIN, Role.USER),
  CommentController.updateComment,
);

router.delete(
  "/:commentId",
  auth(Role.ADMIN, Role.USER),
  CommentController.deleteComment,
);

router.patch(
  "/moderate/:commentId",
  auth(Role.ADMIN),
  CommentController.moderateCommnent,
);

export const commentRouter = router;
