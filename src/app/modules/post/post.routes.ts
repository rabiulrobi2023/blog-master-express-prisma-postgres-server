import { Router } from "express";
import { PostContrller } from "./post.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();
router.post("/", auth(Role.USER), PostContrller.createPost);
router.get("/", PostContrller.getAllPost);
router.get("/my-posts", auth(Role.ADMIN, Role.USER), PostContrller.getMyPost);
router.get("/stats", auth(Role.ADMIN), PostContrller.getPostStats);
router.get("/:postId", PostContrller.getSinglePost);
router.patch("/:postId", auth(Role.USER, Role.ADMIN), PostContrller.updatePost);
router.delete(
  "/:postId",
  auth(Role.ADMIN, Role.USER),
  PostContrller.deletePost,
);

export const postRouter = router;
