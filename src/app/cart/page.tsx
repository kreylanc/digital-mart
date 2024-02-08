"use client";

import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { getLabel } from "@/lib/getLabel";
import { cn, formatPrice } from "@/lib/utils";
import { trpc } from "@/trpc/client";
import { Check, Loader2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const CartPage = () => {
  // get states from zustand cart state
  const { items, removeItem } = useCart();
  // state for when the component is mounted
  const [isMounted, setIsMounted] = useState(false);

  // Initialize useRouter
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // call stripe checkout session end point
  const { mutate: createCheckoutSession, isLoading } =
    trpc.payment.createSession.useMutation({
      onSuccess: ({ url }) => {
        if (url) {
          router.push(url);
        }
      },
      onError: (err) => {
        if (err.data?.code === "UNAUTHORIZED") {
          toast.error(err.message);
        } else {
          toast.error("Something went wrong. Please try again later.");
        }
      },
    });

  // to pass as an input when calling the API
  const productIds = items.map(({ product }) => product.id);

  const cartTotal = items.reduce(
    (total, { product }) => total + product.price,
    0
  );

  const fee = 1;

  return (
    <div className="mx-auto w-full px-4 pb-24 pt-16 sm:px-6 sm:max-w-2xl lg:max-w-4xl xl:max-w-6xl lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
        Shopping Cart
      </h1>
      <div className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
        {/* Product Item details i.e price, image, name, etc */}
        <div
          className={cn("lg:col-span-7", {
            "rounded-lg border-2 border-dashed border-zinc-200 p-4 sm:p-12":
              isMounted && items.length === 0,
          })}
        >
          <h2 className="sr-only">Items in your shopping cart</h2>
          {items.length === 0 && isMounted ? (
            <div className="flex flex-col items-center justify-center relative">
              <Image
                src="/hippo-empty-cart.png"
                alt="hippo empty shopping cart"
                loading="eager"
                className="object-cover object-center sm:h-40 sm:w-40"
                width={1024}
                height={1024}
              />
              <h2 className="text-xl sm:text-2xl font-medium text-center">
                Your cart is empty.
              </h2>
              <p className="text-muted-foreground mt-2 text-center">
                Whoops! Nothing to show here yet.
              </p>
            </div>
          ) : null}

          <ul
            className={cn({
              "divide-y divide-gray-200 border-y border-gray-200":
                isMounted && items.length > 0,
            })}
          >
            {isMounted &&
              items.map(({ product }, index) => {
                // get current label category
                const label = getLabel(product.category);
                // get single image
                const image = product.images[0].image;

                return (
                  <li
                    key={`${product.id} ${index}`}
                    className="flex py-6 sm:py-10"
                  >
                    <div className="flex relative w-full">
                      <div className="relative h-24 w-24 ">
                        {typeof image !== "string" && image.url ? (
                          <Image
                            src={image.url}
                            alt={image.alt}
                            fill
                            className="rounded-lg h-full w-full object-cover object-center sm:h-48 sm:w-48"
                          />
                        ) : null}
                      </div>
                      <div className="flex flex-col ml-4 text-sm gap-y-1">
                        <h2 className="font-medium">
                          <Link href={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h2>
                        <p className="text-muted-foreground">
                          Category: {label}
                        </p>
                        <p className="font-semibold">
                          {formatPrice(product.price)}
                        </p>
                        <p className="flex items-center gap-1 mt-4">
                          <Check className="text-green-500" size={14} />
                          <span>Eligible for instant delivery.</span>
                        </p>
                      </div>
                      {/* Remove Item Button */}
                      <div className="absolute right-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          aria-label="remove item"
                          onClick={() => removeItem(product.id)}
                        >
                          <X aria-hidden="true" className="text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </li>
                );
              })}
          </ul>
        </div>
        {/* Cart Summary */}
        <section className="mt-4 bg-slate-50/70 px-4 py-6 rounded-lg sm:p-6 lg:mt-0 lg:col-span-5">
          <h3 className="font-medium text-lg">Order Summary</h3>
          <div className="divide-y border-slate-300 mt-4 flex flex-col">
            <div className="flex justify-between py-4 text-sm">
              <p className="text-slate-600">Subtotal</p>
              <p className="font-medium">
                {isMounted ? (
                  formatPrice(cartTotal)
                ) : (
                  <Loader2 size={16} className="animate-spin" />
                )}
              </p>
            </div>
            <div className="flex justify-between py-4 text-sm">
              <p className="text-slate-600">Flat transaction fee</p>
              <p className="font-medium">
                {isMounted ? (
                  formatPrice(fee)
                ) : (
                  <Loader2 size={16} className="animate-spin" />
                )}
              </p>
            </div>
            <div className="flex justify-between py-4 text-base ">
              <p className="font-medium text-slate-800">Order total</p>
              <p className="font-medium">
                {isMounted ? (
                  formatPrice(cartTotal + fee)
                ) : (
                  <Loader2 size={16} className="animate-spin" />
                )}
              </p>
            </div>
          </div>
          <div className="mt-6">
            <Button
              onClick={() => createCheckoutSession({ productIds })}
              className="w-full"
              size="lg"
              disabled={items.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-1.5" size={16} />
                  <span>Checkout</span>
                </>
              ) : (
                "Checkout"
              )}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default CartPage;
