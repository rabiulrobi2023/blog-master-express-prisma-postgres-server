import { Router } from "express";
import auth from "../../middlewares/auth";
import { Role } from "../../../../generated/prisma/enums";
import { PremiumContentController } from "./premium.controller";
import { subscriptionGuard } from "../../middlewares/subcriptionGuard";

const router = Router();

router.get(
  "/",
  auth(Role.ADMIN, Role.AUTHOR, Role.USER),subscriptionGuard(),
  PremiumContentController.getPermiumContent,
);

export const premiumContentRouter = router;
