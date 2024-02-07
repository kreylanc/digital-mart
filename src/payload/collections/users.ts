import { admin } from "./../access/admin";
import { CollectionConfig } from "payload/types";
import { isAdminOrSelf } from "../access/isAdminOrSelf";
import { PrimaryActionEmailHtml } from "../../components/emails/PrimaryActionEmail";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // send email to users for verification
    verify: {
      generateEmailHTML: ({ token }) => {
        return PrimaryActionEmailHtml({
          actionLabel: "Verify your account",
          buttonText: "Verify Account",
          href: `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}`,
        });
      },
    },
  }, // need to be authorized to access this collection
  access: {
    // define the access control of the collection
    read: isAdminOrSelf(),
    create: () => true,
    update: admin,
    delete: admin,
  },
  admin: {
    hidden: ({ user }) => user.role !== "admin",
    defaultColumns: ["id"],
  },
  fields: [
    {
      name: "products",
      label: "Products",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "product_files",
      label: "Product Files",
      admin: {
        condition: () => false,
      },
      type: "relationship",
      relationTo: "productFile",
      hasMany: true,
    },
    {
      // The role field to select whether as an admin or a user
      name: "role",
      type: "select",
      options: [
        {
          label: "Admin",
          value: "admin",
        },
        {
          label: "User",
          value: "user",
        },
      ],
      required: true,
      defaultValue: "user",
    },
  ],
};
