import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { postRouter } from "../modules/post/post.routes";
import { CommentController } from "../modules/comment/comment.controller";
import { commentRouter } from "../modules/comment/comment.route";

const router = Router();
const routerArr = [
  {
    path: "/user",
    route: userRouter,
  },
  {
    path: "/auth",
    route: authRouter,
  },
  {
    path: "/posts",
    route: postRouter,
  },
  {
    path: "/comments",
    route: commentRouter,
  },
];

routerArr.forEach((route) => router.use(route.path, route.route));

export default router;
