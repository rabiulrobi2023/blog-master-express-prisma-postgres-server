import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";

import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";
import { IJwtTokenPayload } from "../../interface/interface";
import config from "../../config";
import { JwtUtils } from "../../utils/jwt";

const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findFirstOrThrow({ where: { email } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not registered");
  }
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid password");
  }

  if (user.activeStatus === "BLOCKED") {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account has been blocked.");
  }

  const jwtTokenPayload: IJwtTokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = JwtUtils.jwtAccessTokenGenerator(jwtTokenPayload);
  const refreshToken = JwtUtils.jwtRefreshTokenGenerator(jwtTokenPayload);

  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (existingRefreshToken: string) => {
  if (!existingRefreshToken) {
    throw new AppError(StatusCodes.UNAUTHORIZED, "Unauthorized access");
  }

  const decoded = JwtUtils.verifyJwtToken(
    existingRefreshToken,
    config.JWT_REFRESH_TOKEN_SECRET,
  );

  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) {
    throw new AppError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.activeStatus === "BLOCKED") {
    throw new AppError(StatusCodes.FORBIDDEN, "Your account has been blocked");
  }

  const jwtTokenPayload: IJwtTokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = JwtUtils.jwtAccessTokenGenerator(jwtTokenPayload);
  const refreshToken = JwtUtils.jwtRefreshTokenGenerator(jwtTokenPayload);

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUserIntoDB,
  refreshToken,
};
