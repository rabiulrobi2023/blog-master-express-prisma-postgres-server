import jwt, { SignOptions } from "jsonwebtoken";

import { IJwtTokenPayload } from "../interface";
import config from "../config";


const jwtAccessTokenGenerator = (payload: IJwtTokenPayload) => {
  const { id, name, email, role } = payload;
  const token = jwt.sign(
    { id, name, email, role },
    config.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: config.JWT_ACCESS_TOKEN_EXPIRE_IN } as SignOptions,
  );
  return token;
};

const jwtRefreshTokenGenerator = (payload: IJwtTokenPayload) => {
  const { id, name, email, role } = payload;
  const token = jwt.sign(
    { id, name, email, role },
    config.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: config.JWT_REFRESH_TOKEN_EXPIRE_IN } as SignOptions,
  );
  return token;
};

const verifyJwtToken = (
  token: string,
  secret: string,
): { success: boolean; data: IJwtTokenPayload } => {
  try {
    const result = jwt.verify(token, secret) as IJwtTokenPayload;
    return {
      success: true,
      data: result,
    };
  } catch (error: any) {
    return {
      success: false,
      data: error.message,
    };
  }
};

export const jwtUtils = {
  jwtAccessTokenGenerator,
  jwtRefreshTokenGenerator,
  verifyJwtToken,
};
