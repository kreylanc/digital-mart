import { authRouter } from "./routers/auth";
import { router } from "./trpc";

// Defining api routers
export const appRouter = router({
  auth: authRouter,
});

// Export the type of appRouter
export type AppRouter = typeof appRouter;
