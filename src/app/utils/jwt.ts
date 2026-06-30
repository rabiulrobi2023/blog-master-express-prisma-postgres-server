import jwt, { SignOptions } from "jsonwebtoken";

import config from "../config";

import { IJwtTokenPayload } from "../interface/interface";

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

const verifyJwtToken = (token: string, secret: string): IJwtTokenPayload =>
  jwt.verify(token, secret) as IJwtTokenPayload;

export const JwtUtils = {
  jwtAccessTokenGenerator,
  jwtRefreshTokenGenerator,
  verifyJwtToken,
};
