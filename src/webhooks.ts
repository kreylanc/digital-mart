import express from "express";
import { WebhookRequest } from "./server";
import type Stripe from "stripe";
import { stripe } from "./lib/stripe";
import { getPayloadClient } from "./get-payload";
import { Resend } from "resend";
import { ReceiptEmailHtml } from "./components/emails/ReceiptEmail";
import { Product } from "./payload-types";

// initialize resend
const resend = new Resend(process.env.RESEND_API_KEY);

export const stripeWebhookHandler = async (
  req: express.Request,
  res: express.Response
) => {
  // Validate the request comes from Stripe
  const webhookRequest = req as any as WebhookRequest;
  const body = webhookRequest.rawbody;
  const signature = req.headers["stripe-signature"] || "";

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (err) {
    return res
      .status(400)
      .send(
        `Webhook Error: ${err instanceof Error ? err.message : "Unknown Error"}`
      );
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (!session?.metadata?.userId || !session?.metadata?.orderId) {
    return res.status(400).send(`Webhook Error: No user present in metadata`);
  }

  // if checkout was succesfully completed
  // update the _isPaid value from user's order

  if (event.type === "checkout.session.completed") {
    const payload = await getPayloadClient();

    // get the user details using the userID from the metadata passsed to Stripe
    const user = await payload.findByID({
      collection: "users",
      id: session.metadata.userId,
    });

    // if user doesn't exist respond with an error
    if (!user) return res.status(404).json({ error: "No such user exists." });

    // get the order details using the orderID from stripe's metadata
    const order = await payload.findByID({
      collection: "orders",
      depth: 2,
      id: session.metadata.orderId,
    });

    if (!order) return res.status(404).json({ error: "No such order exists." });

    // Now updating the _isPaid data to true in orders collection
    await payload.update({
      collection: "orders",
      data: {
        _isPaid: true,
      },
      where: {
        id: {
          equals: session.metadata.orderId,
        },
      },
    });

    // send receipt email
    try {
      const data = await resend.emails.send({
        from: "DigitalHippo <noreply@frontendroadmap.com>",
        to: [user.email],
        subject: "Thanks for your order! This is your receipt.",
        html: ReceiptEmailHtml({
          date: new Date(),
          email: user.email,
          orderId: session.metadata.orderId,
          products: order.productId as Product[],
        }),
      });
      res.status(200).json({ data });
    } catch (error) {
      res.status(500).json({ error });
    }
  }

  return res.status(200).send;
};
