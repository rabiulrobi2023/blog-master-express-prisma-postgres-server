import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

import { NodeEnv } from "../../../generated/prisma/enums";
import config from "../config";
import { ErrorRequestHandler, Request } from "express";

interface IErrorSource {
  path: string;
  message?: string;
}

type TError = {
  success: boolean;
  statusCode: number;
  message: string;
  source?: IErrorSource[];
  stack?: string;
  error?: AppError | string;
};

const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let response: TError = {
    success: false,
    statusCode: error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    message: error.message || "Something went wormg",
    source: [],
    stack: config.NODE_ENV === NodeEnv.DEVELOPMENT ? error.stack : "",
    error: config.NODE_ENV === NodeEnv.DEVELOPMENT ? error : "",
  };

  if (error instanceof AppError) {
    ((response.statusCode = error.statusCode),
      (response.message = error.message),
      (response.source = [
        {
          path: "",
          message: error.message,
        },
      ]));
  } else if (error instanceof jwt.JsonWebTokenError) {
    ((response.statusCode = 401),
      (response.message = "Invalid token"),
      (response.source = [
        {
          path: "",
          message: error.message,
        },
      ]));
  } else if (error instanceof jwt.TokenExpiredError) {
    ((response.statusCode = 401),
      (response.message = "Token has expired"),
      (response.source = [
        {
          path: "",
          message: error.message,
        },
      ]));
  }

  res.status(response.statusCode).json(response);
};

export default globalErrorHandler;
