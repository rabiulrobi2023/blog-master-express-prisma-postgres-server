import { StatusCodes } from "http-status-codes";

import { prisma } from "../../lib/prisma";
import { stripe } from "../../lib/stripe";
import AppError from "../../utils/AppError";
import config from "../../config";

import Stripe from "stripe";
import {
  handleCheckoutCompleted,
  handleSubscriptionUpdate,
} from "./subscription.utils";

const createCheckoutSession = async (userId: string) => {
  const transectionResult = await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        subscription: true,
      },
    });
    if (!user) {
      throw new AppError(StatusCodes.NOT_FOUND, "User not found");
    }

    let stripeCustomerId = user.subscription?.stripeCustomerId;
    if (!stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        name: user?.name,
        email: user?.email,
        metadata: { userId: user?.id },
      });
      stripeCustomerId = stripeCustomer.id;
    }

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: config.STRIPE_PRICE_ID, quantity: 1 }],
      mode: "subscription",
      customer: stripeCustomerId,
      payment_method_types: ["card"],
      success_url: `${config.FRONTEND_URL}/premium?success=true`,
      cancel_url: `${config.FRONTEND_URL}/payment?success=false`,
      metadata: {
        userId: user.id,
      },
    });
    return session.url;
  });
  return {
    paymentUrl: transectionResult,
  };
};

const handleWebhook = async (payload: Buffer, signature: string) => {
  const endPorintSecret = config.STRIPE_WEBHOOK_SECRET;
  const event = stripe.webhooks.constructEvent(
    payload,
    signature,
    endPorintSecret,
  );
  console.log("Type:", event.type);
  console.log("Object", event.data.object);
  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutCompleted(event.data.object);
      break;

    case "customer.subscription.updated":
      await handleSubscriptionUpdate(event.data.object);
      break;
    case "customer.subscription.deleted":
      await handleSubscriptionUpdate(event.data.object);
      break;
    default:
      console.log(`No events matched. Unhandled event type ${event.type}.`);
      break;
  }
};

const getMySubscriptionFromDB = async (userId: string) => {
  const subscription = await prisma.subscription.findUnique({
    where: {
      userId,
    },
  });

  if (!subscription) {
    throw new AppError(StatusCodes.NOT_FOUND, "There is no any subscription");
  }



  return {
    status: subscription.status,
    isSubscibed: true,
    startDate: subscription.startDate,
    endDate: subscription.endDate,
  };
};

export const SubscriptionService = {
  createCheckoutSession,
  handleWebhook,
  getMySubscriptionFromDB,
};
