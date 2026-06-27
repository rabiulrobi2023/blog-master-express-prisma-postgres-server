import jwt, { SignOptions } from "jsonwebtoken";
import env from "../../config";
import { IJwtTokenPayload } from "../../interface";

export const jwtAccessTokenGenerator = (payload: IJwtTokenPayload) => {
  const { id, name, email, role } = payload;
  const token = jwt.sign(
    { id, name, email, role },
    env.JWT_ACCESS_TOKEN_SECRET,
    { expiresIn: env.JWT_ACCESS_TOKEN_EXPIRE_IN } as SignOptions,
  );
  return token;
};

export const jwtRefreshTokenGenerator = (payload: IJwtTokenPayload) => {
  const { id, name, email, role } = payload;
  const token = jwt.sign(
    { id, name, email, role },
    env.JWT_REFRESH_TOKEN_SECRET,
    { expiresIn: env.JWT_REFRESH_TOKEN_EXPIRE_IN } as SignOptions,
  );
  return token;
};
