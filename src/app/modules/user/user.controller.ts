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
  const user = req.user;
  const result = await UserService.getMeFromDB(user.id);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Self profile data retived successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req, res, next) => {
  const data = req.body;
  const { userUpdateData, profileUpdateData } = data;
  const id = req.user.id;
  const result = await UserService.updateProfileIntoDB(
    id,
    userUpdateData,
    profileUpdateData,
  );
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Profile updated successfully",
    data: result,
  });
});
export const UserContrller = {
  registerUser,
  getMe,
  updateProfile,
};
