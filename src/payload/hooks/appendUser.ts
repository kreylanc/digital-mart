import { User } from "../../payload-types";
import { BeforeChangeHook } from "payload/dist/collections/config/types";

/* This is used for adding the user id to the field 
  when a field is created or updated by the current user
 */
export const appendUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User;
  // add the current user ID when before the field is created or updated
  return {
    ...data,
    userId: user.id,
  };
};
