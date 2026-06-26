import { Router } from "express";
import { UserRouter } from "../modules/user/user.route";

const router = Router();
const routerArr = [
  {
    path: "/user",
    route: UserRouter,
  },
];

routerArr.forEach((route) => router.use(route.path, route.route));

export default router;
