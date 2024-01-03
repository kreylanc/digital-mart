import { CollectionConfig } from "payload/types";
import { appendUser } from "../hooks/appendUser";
import { isAdminOrSelf } from "../access/isAdminOrSelf";

export const Media: CollectionConfig = {
  slug: "media",
  // Hide the collection from the admin dashboard
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    // admins or user themselves
    read: async ({ req }) => {
      const referer = req.headers.referer;

      if (!req.user || !referer?.includes("sell")) {
        return true;
      }

      return await isAdminOrSelf()({ req });
    },
    update: isAdminOrSelf(),
    delete: isAdminOrSelf(),
  },
  fields: [
    {
      name: "alt",
      required: true,
      type: "text",
    },
    {
      name: "userId",
      type: "relationship",
      relationTo: "users",
      hasMany: false,
      required: true,
      admin: {
        condition: () => false,
      },
    },
  ],
  upload: {
    staticURL: "/media",
    staticDir: "media",
    imageSizes: [
      {
        name: "thumnail",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
      {
        name: "tablet",
        width: 1024,
        // By specifying `undefined` or leaving a height undefined,
        // the image will calculate height automatically
        height: undefined,
        position: "centre",
      },
    ],
    mimeTypes: ["image/*"],
  },
  hooks: {
    // before creating or updating, attach the user's id to the file
    // so only that user can access it
    beforeChange: [appendUser],
  },
};
