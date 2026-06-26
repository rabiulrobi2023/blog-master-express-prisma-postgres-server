import { Router } from "express";
import { UserContrller } from "./user.controller";

const router = Router();

router.post("/register", UserContrller.registerUser);

export const UserRouter = router;
