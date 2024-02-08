import PaymentStatus from "@/components/PaymentStatus";
import { getPayloadClient } from "@/get-payload";
import { getLabel } from "@/lib/getLabel";
import { getServerSideUser } from "@/lib/payload-utils";
import { formatPrice } from "@/lib/utils";
import { Product, ProductFile, User } from "@/payload-types";
import { ImageIcon } from "lucide-react";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

type PageProps = {
  searchParams: {
    [key: string]: string | number | undefined;
  };
};
const ThankYouPage = async ({ searchParams }: PageProps) => {
  // get orderId from the link
  const orderId = searchParams.orderId;

  if (!orderId) return notFound();
  const nextCookies = cookies();

  // get the current user
  const { user } = await getServerSideUser(nextCookies);

  const payload = await getPayloadClient();

  // get the order data from db matching the url orderId

  const order = await payload.findByID({
    collection: "orders",
    depth: 2,
    id: orderId,
  });

  if (!order) return notFound();

  const userOrderId =
    typeof order.userId === "string" ? order.userId : order.userId.id; // get the userId from the order

  /*
   * Check if the user who ordered matches the logged in user
   */

  if (userOrderId !== user?.id) {
    return redirect(`/sign-in?origin=thank-you?orderId=${orderId}`);
  }

  const products = order.productId as Product[];
  //
  const cartTotal = products.reduce(
    (total, product) => total + product.price,
    0
  );

  return (
    <div className="relative lg:min-h-full">
      <div className="hidden lg:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12">
        <Image
          src="/checkout-thank-you.jpg"
          alt="Thank you for checking out"
          className="w-full h-full object-cover object-center"
          fill
        />
      </div>

      <div className="mx-auto px-4 py-16 sm:px-6 sm:py-24 max-w-2xl lg:max-w-4xl xl:max-w-6xl lg:px-8">
        <div>
          <p className="text-sm font-medium text-secondary-foreground">
            Order sucessful
          </p>
          <h1 className="mt-2 text-xl lg:text-3xl font-bold">
            Thanks for ordering
          </h1>
          {order._isPaid ? (
            <p className="text-muted-foreground mt-2">
              Your order was processed and your assets are available to download
              below. We&apos;ve sent your receipt and order details to{" "}
              {typeof order.userId !== "string" ? (
                <span className="font-medium text-primary">{user.email}</span>
              ) : (
                "your email"
              )}
            </p>
          ) : (
            <p className="text-muted-foreground mt-2">
              We appreciate your order and we&apos;re currently processing it.
              So hang tight and we&apos;ll send you confirmation very soon.
            </p>
          )}

          <div className="mt-16 text-sm">
            <p className="text-muted-foreground">Order nr.</p>
            <p className="mt-2 font-bold">{order.id}</p>

            <ul className="mt-6 divide-y divide-gray-200 border-t border-gray-200 text-base">
              {(order.productId as Product[]).map((product, index) => {
                const label = getLabel(product.category);
                const { image } = product.images[0];
                const fileLink = (product.productFile as ProductFile)
                  .url as string;
                return (
                  <li
                    key={`${product.id} ${index}`}
                    className="flex py-6 sm:py-10"
                  >
                    <div className="h-24 w-24 relative">
                      {typeof image !== "string" && image.url ? (
                        <Image
                          src={image.url}
                          alt={image.alt}
                          fill
                          className="rounded-lg object-cover object-center"
                        />
                      ) : (
                        <ImageIcon className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex flex-col flex-1 justify-between ml-4 text-sm">
                      <div>
                        <h2 className="font-medium">
                          <Link href={`/product/${product.id}`}>
                            {product.name}
                          </Link>
                        </h2>
                        <p className="text-muted-foreground mt-0.5">
                          Category: {label}
                        </p>
                      </div>

                      {order._isPaid ? (
                        <a
                          href={fileLink}
                          download={product.name}
                          className="text-blue-600 hover:underline underline-offset-2"
                        >
                          Download asset
                        </a>
                      ) : null}
                    </div>
                    <p className="font-semibold">
                      {formatPrice(product.price)}
                    </p>
                  </li>
                );
              })}
            </ul>

            <div className="space-y-6 border-t border-gray-200 pt-6 text-sm text-muted-foreground font-medium">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p className="text-primary">{formatPrice(cartTotal)}</p>
              </div>
              <div className="flex justify-between">
                <p>Transaction Fee</p>
                <p className="text-primary">{formatPrice(1)}</p>
              </div>
              <div className="flex justify-between items-center pt-6 border-t border-gray-200 text-primary">
                <p className="text-base">Total</p>
                <p className="text-base">{formatPrice(cartTotal + 1)}</p>
              </div>
            </div>
          </div>

          <PaymentStatus
            orderEmail={(order.userId as User).email}
            orderId={order.id}
            isPaid={order._isPaid}
          />
          <div className="mt-16 border-t border-gray-200 text-right py-6">
            <Link
              href="/product"
              className="text-sm text-blue-600 font-medium hover:text-blue-500"
            >
              Continue Shopping &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThankYouPage;
