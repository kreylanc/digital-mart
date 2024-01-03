import { admin } from "./../../access/admin";
import { User } from "../../../payload-types";
import { appendUser } from "./../../hooks/appendUser";
import { Access, CollectionConfig } from "payload/types";

const ownedOrPurchased: Access = async ({ req }) => {
  const user = req.user as User | null;

  if (user) {
    // admin can access everything
    if (user.role === "admin") return true;

    // for other users

    /*
      Find the products owned by the current user
      Desctructing and getting the docs property and renaming it to products
    */
    const { docs: products } = await req.payload.find({
      collection: "productFile",
      depth: 0, // dont populate the returned field with the user
      where: {
        userId: {
          equals: user.id,
        },
      },
    });

    // mapping and geting the productFile ids
    const ownProductFileIds = products.map((item) => item.id).flat();

    /* For users who bought the products
     * Find the orders where the userId matches with the current user
     */
    const { docs: orders } = await req.payload.find({
      collection: "orders",
      depth: 1, // populate the data one level deep to get the productFile from product
      where: {
        userId: {
          equals: user.id,
        },
      },
    });

    /* Due to depth being 1
      The productId field will be populated with the corresponding data from product collection
     */
    const purchasedProductFileIds = orders
      .map((order) => {
        return order.productId.map((product) => {
          // if its string, then the data was not populated with product data and only contains productId
          if (typeof product === "string") {
            return req.payload.logger.error(
              "Search depth not sufficient to find the purchased file."
            );
          }

          // returns the file Id
          return typeof product.productFile === "string"
            ? product.productFile
            : product.productFile.id;
        });
      })
      .filter(Boolean)
      .flat();

    return {
      // query if the file id is in the list of owned and purchased fileIds
      id: {
        in: [...ownProductFileIds, ...purchasedProductFileIds],
      },
    };
  }

  return false;
};

export const ProductFile: CollectionConfig = {
  slug: "productFile",
  // hide from admin dashboard for normal users
  admin: {
    hidden: ({ user }) => user.role !== "admin",
  },
  access: {
    read: ownedOrPurchased,
    update: admin,
    delete: admin,
  },
  upload: {
    staticURL: "/product-files",
    staticDir: "product-files",
    mimeTypes: ["image/*", "font/*", "application/postscript"],
  },
  fields: [
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
  hooks: {
    beforeChange: [appendUser],
  },
};
