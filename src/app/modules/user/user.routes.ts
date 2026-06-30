import { Router } from "express";
import { UserContrller } from "./user.controller";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";

const router = Router();

router.post("/register", UserContrller.registerUser);
router.post(
  "/me",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  UserContrller.getMe,
);

router.put(
  "/my-profile",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),
  UserContrller.updateProfile,
);

export const userRouter = router;
