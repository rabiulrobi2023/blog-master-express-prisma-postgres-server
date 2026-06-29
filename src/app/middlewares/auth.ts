import { jwtUtils } from "./../utils/jwt";
import config from "../config";
import catchAsync from "../utils/catchAsync";
import AppError from "../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";

const auth = (...roles: string[]) => {
  return catchAsync(async (req, res, next) => {
    const accessToken =
      req.cookies.accessToken ||
      (req.headers.authorization?.startsWith("Bearer ")
        ? req.headers.authorization?.split(" ")[1]
        : req.headers.authorization);

    if (!accessToken) {
      throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
    }

    const decoded = jwtUtils.verifyJwtToken(
      accessToken,
      config.JWT_ACCESS_TOKEN_SECRET,
    );

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    if (!roles.includes(decoded.role)) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "You are not authorized to perform this action.",
      );
    }

    if (user.activeStatus === "BLOCKED") {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Your account has been blocked",
      );
    }

    req.user = decoded;
    next();
  });
};

export default auth;
