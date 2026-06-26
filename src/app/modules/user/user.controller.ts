import { Request, Response } from "express";
import { UserService } from "./user.service";
import { StatusCodes } from "http-status-codes";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await UserService.registerUserIntoDB(req.body);
 sendResponse(res, {
    statusCode: StatusCodes.CREATED,
    message: "User created successfully",
    data: result
 })
});
export const UserContrller = {
  registerUser,
};
