import { User } from "../../payload-types";
import { Access } from "payload/config";

export const isAdminOrSelf =
  (): Access =>
  async ({ req }) => {
    // get user from the request and give it type of User or undefined
    const user = req.user as User | undefined;

    // if a user is logged in
    if (user) {
      // if its an admin give access
      if (user.role === "admin") return true;

      // for other users only give access to their own items
      return {
        // checks the user field and returns items matching with the currently logged in user id
        userId: {
          equals: user.id,
        },
      };
    }

    // no access to not authenticated user
    return false;
  };
