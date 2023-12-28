import { initTRPC } from "@trpc/server";

/*
 * Initialize tRPC for backend
 * Should only be called once
 */
const t = initTRPC.context().create();

// Base router and procedure helpers
export const router = t.router;
export const publicProcedure = t.procedure; // procedure that can be used by all the users
