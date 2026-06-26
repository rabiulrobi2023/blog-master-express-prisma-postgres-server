import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import env from "./config";
import router from "./app/routes";

const app: Application = express();
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Server is running...");
});

app.use("/api/v1", router);

export default app;
