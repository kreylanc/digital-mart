import { CollectionAfterChangeHook } from "payload/types";

// This hook is used for adding products created by users to their own collection
export const syncUser: CollectionAfterChangeHook = async ({ req, doc }) => {
  // get the user data from payload
  const fullUser = await req.payload.findByID({
    collection: "users",
    id: req.user.id,
  });

  // if user exists and its an object i.e. it is not just a string of userId
  if (fullUser && typeof fullUser === "object") {
    // deconstruct to get products field
    const { products } = fullUser;

    // get all the product ID if the user owns any
    const allIDs = [
      ...(products?.map((product) =>
        typeof product === "object" ? product.id : product
      ) || []),
    ];

    const createdProductIDs = allIDs.filter(
      (id, index) => allIDs.indexOf(id) === index
    );

    const dataToUpdate = [...createdProductIDs, doc.id]; // append the currently created Product ID

    await req.payload.update({
      collection: "users",
      id: fullUser.id,
      data: {
        products: dataToUpdate,
      },
    });
  }
};
