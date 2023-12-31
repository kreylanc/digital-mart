import express from "express";
import { getPayloadClient } from "./get-payload";
import { nextApp, nextHandler } from "./next-utils";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./trpc";
import { inferAsyncReturnType } from "@trpc/server";

const app = express();
const PORT = Number(process.env.PORT) || 3000;

// defining the context type for tRPC
const createContext = ({
  req,
  res,
}: trpcExpress.CreateExpressContextOptions) => ({
  req,
  res,
});
// infer context type
export type ExpressContext = inferAsyncReturnType<typeof createContext>;

const start = async () => {
  // call payload to initialize the CMS
  const payload = await getPayloadClient({
    initOptions: {
      express: app,
      // get admin url on initialize
      onInit: async (cms) => {
        cms.logger.info(`ADMIN URL ${cms.getAdminURL}`);
      },
    },
  });

  // Using express adapter from tRPC to connect with express
  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));

  nextApp.prepare().then(() => {
    payload.logger.info("Next.js started");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
