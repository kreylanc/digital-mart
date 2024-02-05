import { stripe } from "./../../lib/stripe";
import { z } from "zod";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../../get-payload";
import type Stripe from "stripe";

export const paymentRouter = router({
  createSession: privateProcedure
    .input(
      z.object({
        productIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { user } = ctx;
      const { productIds } = input;

      if (productIds.length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No items in cart.",
        });
      }

      const payload = await getPayloadClient();

      const { docs: products } = await payload.find({
        collection: "products",
        where: {
          id: {
            in: productIds,
          },
        },
      });

      // get products that has priceId
      const filteredProducts = products.filter((prod) => Boolean(prod.priceId));

      const order = await payload.create({
        collection: "orders",
        data: {
          _isPaid: false,
          productId: filteredProducts.map((prod) => prod.id),
          userId: user.id,
        },
      });

      const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

      filteredProducts.map((product) => {
        line_items.push({
          price: product.priceId!, // since we filtered the product with priceId
          quantity: 1,
        });
      });

      line_items.push({
        price: "price_1OXiRWAD9s9Twas4FrTqSEAh",
        quantity: 1,
        adjustable_quantity: {
          enabled: false,
        },
      });
      try {
        const stripeSession = await stripe.checkout.sessions.create({
          success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
          payment_method_types: ["card", "paypal"],
          mode: "payment",
          metadata: {
            // metadata to be used in Stripe webhook and update payment status
            userId: user.id,
            orderId: order.id,
          },
          line_items,
        });

        return { url: stripeSession.url };
      } catch (err) {
        console.log(err);

        return { url: null };
      }
    }),
  pollOrderStatus: publicProcedure
    .input(z.object({ orderId: z.string() }))
    .query(async ({ input }) => {
      const { orderId } = input;

      const payload = await getPayloadClient();

      const order = await payload.findByID({
        collection: "orders",
        id: orderId,
      });

      if (!order) throw new TRPCError({ code: "NOT_FOUND" });

      return { isPaid: order._isPaid };
    }),
});
