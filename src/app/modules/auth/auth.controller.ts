import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { cookieUtils } from "../../utils/cookie";

const loginUser = catchAsync(async (req, res) => {
  const result = await AuthService.loginUserIntoDB(req.body);
  cookieUtils.setAccessTokenIntoCookie(result.accessToken, res);
  cookieUtils.setRefreshTokenIntoCookie(result.refreshToken, res);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "User login successfully",
    data: result,
  });
});

export const AuthController = {
  loginUser,
};
