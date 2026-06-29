import ms, { StringValue } from "ms";

import { Response } from "express";
import config from "../config";
import { NodeEnv } from "../../../generated/prisma/enums";

const setAccessTokenIntoCookie = (res: Response, token: string) => {
  const maxAge = ms(config.JWT_ACCESS_TOKEN_EXPIRE_IN as StringValue);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: config.NODE_ENV === NodeEnv.PRODUCTION,
    sameSite: "lax",
    maxAge: maxAge,
  });
};

const setRefreshTokenIntoCookie = (res: Response, token: string) => {
  const maxAge = ms(config.JWT_REFRESH_TOKEN_EXPIRE_IN as StringValue);

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: config.NODE_ENV === NodeEnv.PRODUCTION,
    sameSite: "lax",
    maxAge: maxAge,
  });
};

export const cookieUtils = {
  setAccessTokenIntoCookie,
  setRefreshTokenIntoCookie,
};
