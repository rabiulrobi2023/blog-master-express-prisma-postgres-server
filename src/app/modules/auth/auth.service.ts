import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import { jwtUtils } from "../../utils/jwt";
import { IJwtTokenPayload } from "../../interface";
import AppError from "../../utils/AppError";
import { StatusCodes } from "http-status-codes";

const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirstOrThrow({ where: { email } });
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(StatusCodes.BAD_REQUEST, "Invalid password");
  }

  if (user.activeStatus === "BLOCKED") {
    throw new Error("User has blocked");
  }

  const jwtTokenPayload: IJwtTokenPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwtUtils.jwtAccessTokenGenerator(jwtTokenPayload);
  const refreshToken = jwtUtils.jwtRefreshTokenGenerator(jwtTokenPayload);

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUserIntoDB,
};
