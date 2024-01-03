import { CollectionConfig } from "payload/types";
import { isAdminOrSelf } from "../access/isAdminOrSelf";
import { admin } from "../access/admin";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "Your Orders",
    description: "A summary of all your orders.",
  },
  access: {
    // admin or the user themselves
    read: isAdminOrSelf(),
    // Only admins
    update: admin,
    delete: admin,
    create: admin,
  },
  fields: [
    {
      name: "userId",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
      admin: {
        hidden: true,
      },
    },
    {
      // if order was paid or not
      name: "_isPaid",
      access: {
        // Only admins can read
        read: ({ req }) => req.user.role === "admin",
        // Updating and creating is automatically done, no on is allowed to change
        update: () => false,
        create: () => false,
      },
      type: "checkbox",
      admin: {
        hidden: true,
      },
      required: true,
    },
    {
      name: "productId",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      required: true,
    },
  ],
};
