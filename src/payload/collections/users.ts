import { CollectionConfig } from "payload/types";

export const Users: CollectionConfig = {
  slug: "users",
  auth: {
    // send email to users for verification
    verify: {
      generateEmailHTML: ({ token, user }) => {
        return `<a href="${process.env.NEXT_PUBLIC_SERVER_URL}/verify-email?token=${token}">Verify your account.</a>`;
      },
    },
  }, // need to be authorized to access this collection
  access: {
    // define the access control of the collection
    read: () => true,
    create: () => true,
  },
  fields: [
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
