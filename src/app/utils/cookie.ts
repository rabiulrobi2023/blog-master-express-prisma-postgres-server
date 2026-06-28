import ms, { StringValue } from "ms";

import { Response } from "express";
import config from "../config";


const setAccessTokenIntoCookie = (token: string, res: Response) => {
  const maxAge = ms(config.JWT_ACCESS_TOKEN_EXPIRE_IN as StringValue);

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAge,
  });
};

const setRefreshTokenIntoCookie = (token: string, res: Response) => {
  const maxAge = ms(config.JWT_REFRESH_TOKEN_EXPIRE_IN as StringValue);

  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: maxAge,
  });
};

export const cookieUtils = {
  setAccessTokenIntoCookie,
  setRefreshTokenIntoCookie,
};
