import { stripe } from "./../../../lib/stripe";
import { Product } from "./../../../payload-types";
import { appendUser } from "./../../hooks/appendUser";
import { PRODUCT_CATEGORIES } from "../../../config";
import { CollectionConfig } from "payload/types";
import { syncUser } from "./../../hooks/syncUser";
import { adminOrHasAccess } from "./access/adminOrHasAccess";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: adminOrHasAccess,
    update: adminOrHasAccess,
    delete: adminOrHasAccess,
  },
  fields: [
    {
      // field for the user who added the product
      name: "userId",
      type: "relationship",
      relationTo: "users",
      required: true,
      hasMany: false,
      admin: {
        condition: () => false,
      },
    },
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      required: true,
    },
    {
      name: "price",
      label: "Price in USD",
      type: "number",
      min: 0,
      max: 1000,
      required: true,
    },
    {
      name: "category",
      label: "Category",
      type: "select",
      options: PRODUCT_CATEGORIES.map(({ label, value }) => ({ label, value })),
      required: true,
    },
    {
      name: "images",
      label: "Product Images",
      type: "array",
      minRows: 1,
      maxRows: 4,
      required: true,
      labels: {
        singular: "Image",
        plural: "Images",
      },
      fields: [
        {
          name: "image",
          type: "upload",
          relationTo: "media",
          required: true,
        },
      ],
    },
    {
      name: "productFile",
      label: "Product File(s)",
      type: "relationship",
      relationTo: "productFile",
      required: true,
      hasMany: false,
    },
    {
      name: "status",
      label: "Product Status",
      type: "select",
      defaultValue: "pending",
      options: [
        {
          label: "Pending",
          value: "pending",
        },
        {
          label: "Approved",
          value: "approved",
        },
        {
          label: "Denied",
          value: "denied",
        },
      ],
      required: true,
      // defining only admin can access this field
      access: {
        create: ({ req: { user } }) => user.role === "admin",
        update: ({ req: { user } }) => user.role === "admin",
      },
    },
    {
      name: "priceId",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: "stripeId",
      type: "text",
      access: {
        create: () => false,
        read: () => false,
        update: () => false,
      },
      admin: {
        hidden: true,
      },
    },
  ],
  hooks: {
    afterChange: [syncUser],
    beforeChange: [
      appendUser,
      async (args) => {
        // check if the product is being creaated or updated
        if (args.operation === "create") {
          // if creating new one create product in Strip
          const data = args.data as Product;

          // Create product in stripe to get id for price and stripe
          const createdProduct = await stripe.products.create({
            name: data.name,
            default_price_data: {
              currency: "USD",
              unit_amount: Math.round(data.price * 100),
            },
          });
          // passing the data returned from Strip to our db
          const updated: Product = {
            ...data, // spread our original data
            priceId: createdProduct.default_price as string,
            stripeId: createdProduct.id,
          };

          return updated;
        } else if (args.operation === "update") {
          // if updating the product then update the existing product in Stripe
          const data = args.data as Product;

          // Create product in stripe to get id for price and stripe
          const updatedProduct = await stripe.products.update(data.stripeId!, {
            name: data.name,
            default_price: data.priceId!,
          });
          // passing the data returned from Strip to our db
          const updated: Product = {
            ...data, // spread our original data
            priceId: updatedProduct.default_price as string,
            stripeId: updatedProduct.id,
          };

          return updated;
        }
      },
    ],
  },
};
