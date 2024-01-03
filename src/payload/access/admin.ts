import { User } from "../../payload-types";
import { Access } from "payload/config";

/* Access function to check whether user is an admin or not */
export const admin: Access<any, User> = ({ req: { user } }) => {
  if (user) {
    if (user.role === "admin") {
      return true;
    }
  }
  return false;
};
