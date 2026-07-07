import Stripe from "stripe";
import { stripe } from "../../lib/stripe";
import { prisma } from "../../lib/prisma";
import { SubscriptionStatus } from "../../../../generated/prisma/enums";

export const handleCheckoutCompleted = async (
  session: Stripe.Checkout.Session,
) => {
  const userId = session.metadata?.userId as string;
  const stripeCustomerId = session.customer as string;
  const stripeSubscriptionId = session.subscription as string;

  if (!userId || !stripeCustomerId || !stripeSubscriptionId) {
    console.log("Webhook: Missing values for creating checkout session");
  }

  const subscription = await stripe.subscriptions.retrieve(
    stripeSubscriptionId as string,
  );
  const startDate = getSubscriptionPeriod(subscription, "start");
  const endDate = getSubscriptionPeriod(subscription, "end");

  await prisma.subscription.upsert({
    where: {
      userId,
    },
    create: {
      userId,
      stripeCustomerId,
      stripeSubscriptionId,
      startDate,
      endDate,
      status: "ACTIVE",
    },
    update: {
      stripeCustomerId,
      stripeSubscriptionId,
      startDate,
      endDate,
      status: "ACTIVE",
    },
  });
};

export const handleSubscriptionUpdate = async (
  session: Stripe.Subscription,
) => {
  const stripeSubscriptionId = session.id;
  const isSubscriptionExist = await prisma.subscription.findFirst({
    where: {
      stripeSubscriptionId,
    },
  });
  if (!isSubscriptionExist) {
    console.log(
      `Webhook: No subscription found for the subscription id: ${stripeSubscriptionId}`,
    );
    return;
  }

  let status: SubscriptionStatus;

  switch (session.status) {
    case "active":
      status = SubscriptionStatus.ACTIVE;
    case "trialing":
      status = SubscriptionStatus.TRIAL;

    case "canceled":
      status = SubscriptionStatus.CANCELLED;
    default:
      status = SubscriptionStatus.EXPIRED;
  }

  const startDate = getSubscriptionPeriod(session, "start");
  const endDate = getSubscriptionPeriod(session, "end");
  await prisma.subscription.update({
    where: {
      stripeSubscriptionId,
    },
    data: {
      status,
      startDate,
      endDate,
    },
  });
};

const getSubscriptionPeriod = (
  subscription: Stripe.Subscription,
  periodStatus: "start" | "end",
) => {
  const periodInMs =
    periodStatus === "start"
      ? subscription.items.data[0].current_period_start
      : subscription.items.data[0].current_period_end;
  const periodInDateFormat = new Date(periodInMs * 1000);
  return periodInDateFormat;
};
