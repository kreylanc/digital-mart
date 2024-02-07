import { User } from "@/payload-types";
import { ExpressContext } from "@/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { PayloadRequest } from "payload/types";

/*
 * Initialize tRPC for backend
 * Should only be called once
 * Pass the ExpressContext type
 */
const t = initTRPC.context<ExpressContext>().create();

const middleware = t.middleware;

// check if user is authenticated for private procedure
const isAuth = middleware(async ({ ctx, next }) => {
  const req = ctx.req as PayloadRequest;

  const { user } = req as { user: User | null };

  if (!user || !user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You need to sign in for this action!",
    });
  }

  // pass the logged in user as context
  return next({
    ctx: {
      user,
    },
  });
});

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure; // procedure that can be used by all the users
export const privateProcedure = t.procedure.use(isAuth);
