"use client";

import { TQueryValidator } from "@/lib/validators/query-validator";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import Link from "next/link";
import ProductListing from "./ProductListing";

type ProductReelProps = {
  title: string;
  subtitle?: string;
  href: string;
  query: TQueryValidator;
};

const ProductReel = (props: ProductReelProps) => {
  const { title, subtitle, href, query } = props;

  const FALLBACK_LIMIT = 4;

  // call inifinite query API to fetch products
  const { data, isLoading } = trpc.getInfiniteProducts.useInfiniteQuery(
    {
      limit: query.limit ?? FALLBACK_LIMIT,
      query,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextPage,
    }
  );

  /* 
    Processing the data to only get the products object data in an array
    Before Processing data.pages: [{nextPage: "", products: [{...}, {...}]}]
    After map and flat, get products property only: [{...}, {...}] 
  */

  const products = data?.pages.flatMap((page) => page.products);

  // determine which products to map over
  let map: (Product | null)[] = [];

  // if there are products set map to the products
  if (products && products.length) {
    map = products;
  } else if (isLoading) {
    // if the query is loading
    // fill the map with empty array of length as query limit
    map = new Array<null>(query.limit ?? FALLBACK_LIMIT).fill(null);
  }

  return (
    <section className="py-12">
      <div className="md:flex items-center justify-between">
        <div className="max-w-2xl px-4 lg:max-w-4xl lg:px-0">
          <h2 className="font-bold text-xl lg:text-2xl">{title}</h2>
          {subtitle ? (
            <p className="text-muted-foreground mt-2 text-sm">{subtitle}</p>
          ) : null}
        </div>
        {href ? (
          <Link href={href} className="hidden md:block text-sm text-blue-500">
            Shop the collection <span aria-hidden="true">&rarr;</span>
          </Link>
        ) : null}
      </div>

      <div className="relative">
        <div className="mt-6 w-full flex items-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-4 ">
            {map.map((product, i) => (
              <ProductListing product={product} index={i} key={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductReel;
