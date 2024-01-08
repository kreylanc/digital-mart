import { getPayloadClient } from "./../get-payload";
import { z } from "zod";
import { authRouter } from "./routers/auth";
import { publicProcedure, router } from "./trpc";
import { QueryValidator } from "../lib/validators/query-validator";

// Defining api routers
export const appRouter = router({
  auth: authRouter,
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(), // a pointer determining the page number for pagination
        query: QueryValidator,
      })
    )
    .query(async ({ input }) => {
      // desctructuring input
      const { query, cursor } = input;

      const { sort, limit, ...queryOpts } = query; // desctructure query

      /*
       * Parsing the category property to be valid for passing it in Payload where query
       */
      const parsedQueryOpts: Record<string, { equals: string }> = {};

      Object.entries(queryOpts).forEach(([key, value]) => {
        parsedQueryOpts[key] = {
          equals: value,
        };
      });

      const page = cursor || 1;

      const payload = await getPayloadClient();

      const {
        docs: products,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          status: {
            equals: "approved",
          },
          ...parsedQueryOpts,
        },
        sort,
        limit,
        depth: 1,
        page,
      });

      return { products, nextPage: hasNextPage ? nextPage : null };
    }),
});

// Export the type of appRouter
export type AppRouter = typeof appRouter;
