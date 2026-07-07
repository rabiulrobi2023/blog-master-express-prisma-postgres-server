import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { SubscriptionService } from "./subscription.service";

const createCheckoutSession = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await SubscriptionService.createCheckoutSession(userId);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Checkout completed",
    data: result,
  });
});

const handleWebhook = catchAsync(async (req, res, next) => {
  const payload = req.body;
  const signature = req.headers["stripe-signature"];
  const result = await SubscriptionService.handleWebhook(
    payload,
    signature as string,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Checkout completed successfully",
  });
});

const getMySubscription = catchAsync(async (req, res, next) => {
  const userId = req.user.id;
  const result = await SubscriptionService.getMySubscriptionFromDB(userId);
  sendResponse(res, {
    statusCode: StatusCodes.OK,
    message: "Subscription retrived successfully",
    data: result,
  });
});

export const SubscriptionController = {
  createCheckoutSession,
  handleWebhook,
  getMySubscription
};
