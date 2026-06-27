import bcrypt from "bcryptjs";
import { prisma } from "../../../lib/prisma";
import { ILoginUser } from "./auth.interface";
import {
  jwtAccessTokenGenerator,
  jwtRefreshTokenGenerator,
} from "../../../utils/jwt/jwtTokenGenerator";
import { IJwtTokenPayload } from "../../../interface";

const loginUserIntoDB = async (payload: ILoginUser) => {
  const { email, password } = payload;
  const user = await prisma.user.findFirstOrThrow({ where: { email } });
  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Invalid password");
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

  const accessToken = jwtAccessTokenGenerator(jwtTokenPayload);
  const refreshToken = jwtRefreshTokenGenerator(jwtTokenPayload);

  return {
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  loginUserIntoDB,
};
