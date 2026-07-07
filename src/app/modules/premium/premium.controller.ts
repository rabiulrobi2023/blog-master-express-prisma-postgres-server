import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { PremiumContentService } from "./premium.service";

const getPermiumContent = catchAsync(async (req, res, next) => {
  const query= req.query
  const result = await PremiumContentService.getPremiumContentFromDB(query);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Premium content retrived successfully",
    data: result
  });
});

export const PremiumContentController = {
  getPermiumContent,
};
