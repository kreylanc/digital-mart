"use client";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ShoppingCart } from "lucide-react";
import { Separator } from "./ui/separator";
import { formatPrice } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import Image from "next/image";

const Cart = () => {
  const items = 0;
  const fee = 1;
  return (
    <Sheet>
      <SheetTrigger className="group flex -m-2 items-center gap-x-2 p-2 transition-colors">
        <ShoppingCart
          aria-hidden="true"
          className="text-slate-500 group-hover:text-slate-600 "
        />
        <span className="text-slate-600 text-sm font-medium group-hover:text-slate-700">
          0
        </span>
      </SheetTrigger>
      <SheetContent className="flex w-full sm:max-w-lg flex-col gap-3">
        <SheetHeader>
          <SheetTitle>Cart ({items})</SheetTitle>
        </SheetHeader>

        {items > 0 ? (
          <>
            <div>
              <p>Cart Items</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-1.5 space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Fee</span>
                <span>{formatPrice(fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Total</span>
                <span>{formatPrice(fee)}</span>
              </div>
            </div>
            <SheetFooter className="mt-4">
              <SheetTrigger asChild>
                <Link
                  href="/cart"
                  className={buttonVariants({ className: "w-full" })}
                >
                  Proceed to Checkout
                </Link>
              </SheetTrigger>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-col mb-6 flex-1 items-center justify-center">
            <div className="relative h-60 w-60">
              <Image
                src="/hippo-empty-cart.png"
                fill
                alt="empty shopping cart"
              />
            </div>
            <h3 className="font-bold text-lg mt-2">Cart is empty.</h3>
            <Link
              href="/products"
              className={buttonVariants({
                variant: "link",
                className: "text-blue-500",
              })}
            >
              Add items to your cart.
            </Link>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Cart;
