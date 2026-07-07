import { StatusCodes } from "http-status-codes";
import AppError from "../utils/AppError";
import jwt from "jsonwebtoken";

import { NodeEnv } from "../../../generated/prisma/enums";
import config from "../config";
import { ErrorRequestHandler } from "express";
import { Prisma } from "../../../generated/prisma/client";

interface IErrorSource {
  path: string;
  message?: string;
}

const globalErrorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  let statusCode =
    typeof error?.statusCode === "number"
      ? error.statusCode
      : StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error instanceof Error ? error.message : "Something went wrong";
  let source: IErrorSource[] = [];

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error instanceof jwt.TokenExpiredError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Token has expired";
  } else if (error instanceof jwt.JsonWebTokenError) {
    statusCode = StatusCodes.UNAUTHORIZED;
    message = "Invalid token";
  } else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2000":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "The provided value is too long";
        break;

      case "P2001":
      case "P2025":
        statusCode = StatusCodes.NOT_FOUND;
        message = "The requested resource was not found";
        break;

      case "P2002":
        statusCode = StatusCodes.CONFLICT;
        message = `${
          (error.meta?.target as string[] | undefined)?.join(", ") ?? "Resource"
        } already exists.`;
        break;

      case "P2003":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Foreign key constraint failed";
        break;

      case "P2004":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "A database constaint failed";
        break;

      case "P2005":
      case "P2006":
      case "P2007":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Invalid value provided.";
        break;

      case "P2011":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "A required field cannot be null.";
        break;

      case "P2012":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "A required value is missing.";
        break;

      case "P2014":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "The requested operation violates a required relation.";
        break;

      case "P2016":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "Invalid query.";
        break;

      case "P2020":
        statusCode = StatusCodes.BAD_REQUEST;
        message = "The provided value is out of range.";
        break;

      case "P2021":
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "Database table does not exist.";
        break;

      case "P2022":
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "Database column does not exist.";
        break;

      default:
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "A database error occurred.";
    }
  } else if (error instanceof Prisma.PrismaClientInitializationError) {
    switch (error.errorCode) {
      case "P1000":
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "Authentication failed.";
        break;

      case "P1001":
        statusCode = StatusCodes.SERVICE_UNAVAILABLE;
        message = "Database server is unavailable.";
        break;

      case "P1002":
        statusCode = StatusCodes.GATEWAY_TIMEOUT;
        message = "Database connection timed out.";
        break;

      case "P1003":
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "Database does not exist.";
        break;

      case "P1010":
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "Database access denied.";
        break;

      case "P1017":
        statusCode = StatusCodes.SERVICE_UNAVAILABLE;
        message = "Database connection was closed.";
        break;

      default:
        statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
        message = "Failed to initialize the database connection.";
    }
  } else if (
    error instanceof Prisma.PrismaClientUnknownRequestError ||
    error instanceof Prisma.PrismaClientRustPanicError ||
    error instanceof Prisma.PrismaClientValidationError
  ) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = "An unexpected database error occurred.";
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
    ...(source.length > 0 && source),
    stack: config.NODE_ENV === NodeEnv.DEVELOPMENT ? error.stack : undefined,
    error: config.NODE_ENV === NodeEnv.DEVELOPMENT ? error : undefined,
  });
};

export default globalErrorHandler;
