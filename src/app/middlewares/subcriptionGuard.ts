import { StatusCodes } from "http-status-codes";
import { prisma } from "../lib/prisma";
import AppError from "../utils/AppError";
import catchAsync from "../utils/catchAsync";

export const subscriptionGuard = () => {
  return catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });

    if (!subscription) {
      throw new AppError(
        StatusCodes.FORBIDDEN,
        "Please subscribe to get access to premium contents",
      );
    }

    const isActive = subscription.status === "ACTIVE";
    if (!isActive) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Please subscribe again to get access to Premium Contents",
      );
    }

    const isExpired =
      new Date(new Date().toString()) > new Date(subscription.endDate);

    if (isExpired) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        "Your subscription has expired. Please subscribe again",
      );
    }
    next();
  });
};
