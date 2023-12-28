/*
 * Contains tRPC HTTP response handler
 */

import { appRouter } from "@/trpc";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";

const handler = (req: Request) => {
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: () => ({}),
  });
};

// the handler will now handle all the GET and POST request through this endpoint
export { handler as GET, handler as POST };
