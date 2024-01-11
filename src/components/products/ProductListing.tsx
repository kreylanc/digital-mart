"use client";

import { Product } from "@/payload-types";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { cn, formatPrice } from "@/lib/utils";
import Link from "next/link";
import ImageSlider from "../ImageSlider";
import { getLabel } from "@/lib/getLabel";

type ProductListingProps = {
  product: Product | null;
  index: number;
};

const ProductListing = ({ product, index }: ProductListingProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, index * 75);

    return () => {
      clearTimeout(timeout);
    };
  }, [index]);

  // Get the category Label using the value in product

  if (!product || !isVisible) return <ProductPlaceholder />;

  if (product && isVisible) {
    const validUrls = product.images
      .map(({ image }) =>
        typeof image === "string"
          ? { url: image }
          : { url: image.url!, alt: image.alt }
      )
      .filter(Boolean);

    const label = getLabel(product?.category);
    return (
      <Link
        href={`/product/${product.id}`}
        className={cn("invisible h-full w-full cursor-pointer group/main", {
          "visible animate-in fade-in-5": isVisible,
        })}
      >
        <ImageSlider images={validUrls} />
        <div className="flex flex-col w-full">
          <h3 className="mt-2 font-medium text-sm text-slate-700">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-slate-500">{label}</p>
          <p className="mt-1 text-sm text-slate-900">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>
    );
  }
};
const ProductPlaceholder = () => {
  return (
    <div className="flex flex-col w-full">
      <div className="relative bg-primary-foreground aspect-square w-full overflow-hidden rounded-lg">
        <Skeleton className="w-full h-full" />
      </div>
      <Skeleton className="mt-2 w-2/3 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-16 h-4 rounded-lg" />
      <Skeleton className="mt-2 w-12 h-4 rounded-lg" />
    </div>
  );
};

export default ProductListing;
