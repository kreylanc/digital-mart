import AddToCart from "@/components/cart/AddToCart";
import ImageSlider from "@/components/ImageSlider";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/products/ProductReel";
import { getPayloadClient } from "@/get-payload";
import { getLabel } from "@/lib/getLabel";
import { formatPrice } from "@/lib/utils";
import { Check, Shield } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

type ProductPageProps = {
  params: {
    productId: string;
  };
};

const breadcrumbs = [
  { id: 1, name: "Home", url: "/" },
  { id: 2, name: "Products", url: "/products " },
];

const ProductPage = async ({ params }: ProductPageProps) => {
  const { productId } = params;

  // fetch the single product details using payload query
  const payload = await getPayloadClient();

  const { docs } = await payload.find({
    collection: "products",
    where: {
      id: {
        equals: productId,
      },
      status: {
        equals: "approved",
      },
    },
  });

  const [product] = docs;

  if (!product) return notFound();

  // Get the label of the category using the category value in product object
  const label = getLabel(product.category);

  // Get the image URLs and alt text
  const validUrls = product.images
    .map(({ image }) =>
      typeof image === "string"
        ? { url: image }
        : { url: image.url!, alt: image.alt }
    )
    .filter(Boolean);

  return (
    <MaxWidthWrapper>
      <>
        <div className="mx-auto max-w-2xl py-16 sm:px-6 sm:py-24 lg:grid lg:grid-cols-2 lg:max-w-7xl lg:gap-x-8 lg:px-8">
          {/* Product Details */}
          <div className="lg:max-w-lg lg:col-start-1 lg:row-start-1 lg:self-start">
            <ol className="flex items-center gap-x-2">
              {breadcrumbs.map((item, index) => (
                <li key={item.id} className="flex items-center">
                  <Link href={item.url}>{item.name}</Link>
                  {index !== breadcrumbs.length - 1 ? (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 flex-shrink-0 text-gray-300"
                    >
                      <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                    </svg>
                  ) : null}
                </li>
              ))}
            </ol>
            {/* Product Details Section */}
            <section className="mt-4 flex flex-col gap-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <div className="flex gap-x-2 mt-2 text-lg">
                <p className="font-medium">{formatPrice(product.price)}</p>
                <div className="border-l ml-4 pl-4 text-muted-foreground border-gray-300">
                  {label}
                </div>
              </div>
              <p className="text-lg text-muted-foreground">
                {product.description}
              </p>
              <div className="mt-2 flex items-center">
                <Check
                  aria-label="check mark"
                  aria-hidden="true"
                  className="text-green-600 flex-shrink-0"
                  size={20}
                />
                <p className="text-muted-foreground text-sm ml-4">
                  Eligible for instant delivery.
                </p>
              </div>
            </section>
          </div>
          {/* Product Images Slider */}
          <div className="mt-10 lg:mt-0 lg:col-start-2 lg:self-center">
            <div className="aspect-square">
              <ImageSlider images={validUrls} />
            </div>
          </div>
          <div className="mt-10 lg:col-start-1 lg:max-w-lg lg:row-start-1 lg:self-end">
            <AddToCart product={product} />
            <div className="mt-6 text-center">
              <div className="flex items-center justify-center text-sm text-muted-foreground">
                <Shield className="text-muted-foreground" />
                <span className="ml-4">30 Day Return Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </>
      <ProductReel
        href="/products"
        title={`Similar ${label}`}
        query={{ category: product.category, limit: 4 }}
        subtitle={`Browse similar high-quality ${label} just like "${product.name}"`}
      />
    </MaxWidthWrapper>
  );
};

export default ProductPage;
