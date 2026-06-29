import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { cookieUtils } from "../../utils/cookie";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req.body);
  const { accessToken, refreshToken } = result;
  cookieUtils.setAccessTokenIntoCookie(res, accessToken);
  cookieUtils.setRefreshTokenIntoCookie(res, refreshToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: result,
  });
});

const refreshToken = catchAsync(async (req, res, next) => {
  const existingRefreshToken = req.cookies.refreshToken;
  const result = await AuthService.refreshToken(existingRefreshToken);
  const { accessToken, refreshToken } = result;
  cookieUtils.setAccessTokenIntoCookie(res, accessToken);
  cookieUtils.setRefreshTokenIntoCookie(res, refreshToken);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Token refreshed successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser, refreshToken
};
