import { publicProcedure } from "./../trpc";
import { router } from "../trpc";
import { credValidator } from "@/lib/validators/acc-credential-validation";
import { getPayloadClient } from "@/get-payload";
import { TRPCError } from "@trpc/server";

export const authRouter = router({
  /*  end point for registering
        check for input validation
     */
  createUser: publicProcedure
    .input(credValidator)
    .mutation(async ({ input }) => {
      // destruct the input
      const { email, password } = input;

      const payload = await getPayloadClient();

      // search db if user already exists
      const { docs: user } = await payload.find({
        collection: "users",
        where: {
          email: {
            equals: email,
          },
        },
      });

      //   if exists, throw an error
      if (user.length !== 0)
        throw new TRPCError({
          code: "CONFLICT",
          message: "User already exists",
        });

      // else create a new user

      await payload.create({
        collection: "users",
        data: {},
      });
    }),
});
