import { Router } from "express";
import { userRouter } from "../modules/user/user.routes";
import { authRouter } from "../modules/auth/auth.routes";
import { postRouter } from "../modules/post/post.routes";

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
];

routerArr.forEach((route) => router.use(route.path, route.route));

export default router;
