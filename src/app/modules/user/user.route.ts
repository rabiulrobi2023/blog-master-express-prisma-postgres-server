import { Router } from "express";
import { UserContrller } from "./user.controller";

const router = Router();

router.post("/register", UserContrller.registerUser);
router.post("/me", UserContrller.getMe);

export const UserRouter = router;
