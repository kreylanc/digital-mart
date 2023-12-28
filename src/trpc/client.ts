import type { AppRouter } from "./index";
import { createTRPCReact } from "@trpc/react-query";
/* 
 Setup the tRPC client for TypeSafety on the frontend  
 Pass in the AppRouter type to know what endpoints are available
 */
export const trpc = createTRPCReact<AppRouter>({});
