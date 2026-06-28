import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";

import router from "./app/routes";
import config from "./app/config";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFoundRoute from "./app/middlewares/notFoundRoute";

const app: Application = express();
app.use(
  cors({
    origin: config.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.use("/api/v1", router);
app.use(globalErrorHandler)
app.use(notFoundRoute)

export default app;
