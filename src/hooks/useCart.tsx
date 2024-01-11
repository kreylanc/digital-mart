/* 
    Zustand state management for cart items
    - To add item
    - To remove item
    - Clear items
    - Keep track of items
*/

import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
  product: Product;
};
interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [], // initialize state as an empty array
      /*  To add item to the cart 
        spread the existing array items and append the passed product parameter 
     */
      addItem: (product) =>
        set((state) => ({ items: [...state.items, { product }] })),
      /* To remove item from the cart
        Filter the product id that does not match the passed product id
     */
      removeItem: (productId) =>
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        })),
      clearCart: () => set({ items: [] }),
    }),
    { name: "cartStore", storage: createJSONStorage(() => localStorage) }
  )
);
