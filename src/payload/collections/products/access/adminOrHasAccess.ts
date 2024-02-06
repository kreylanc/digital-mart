import { User } from "@/payload-types";
import { Access } from "payload/config";

export const adminOrHasAccess: Access = ({ req }) => {
  const user = req.user as User | undefined;

  if (!user) return false;

  if (user.role === "admin") return true;

  // get product IDs that the user owns
  const userOwnedProductIDs = (user.products || []).reduce<Array<string>>(
    (acc, product) => {
      if (!product) return acc;
      // if the product field has only its id as value
      if (typeof product === "string") {
        acc.push(product);
      } else {
        acc.push(product.id);
      }
      return acc;
    },
    []
  );

  return {
    id: {
      in: userOwnedProductIDs,
    },
  };
};
