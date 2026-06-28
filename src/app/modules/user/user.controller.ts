import { Request, Response } from "express";
import { UserService } from "./user.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { jwtUtils } from "../../utils/jwt";
import config from "../../config";


const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerUserIntoDB(req.body);
  sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: result,
  });
});

const getMe = catchAsync(async (req: Request, res: Response) => {
  const cookies = req.cookies;

  console.log(req.headers.authorization);
  const { accessToken } = cookies;
  const user = jwtUtils.verifyJwtToken(
    accessToken,
    config.JWT_ACCESS_TOKEN_SECRET,
  );

  console.log(user);

  const result = await UserService.getMeFromDB(accessToken);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Self profile data retived successfully",
    data: result,
  });
});
export const UserContrller = {
  registerUser,
  getMe,
};
