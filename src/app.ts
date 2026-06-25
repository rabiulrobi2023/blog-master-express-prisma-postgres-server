import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import env from "./config";
import { prisma } from "./lib/prisma";

const app: Application = express();
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello world");
});

app.get("/test", async (req: Request, res: Response) => {
  const result = await prisma.user.findMany();
  console.log(result);
});

export default app;
