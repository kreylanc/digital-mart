import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import ProductReel from "@/components/products/ProductReel";
import { getLabel } from "@/lib/getLabel";

type Param = string | string[] | undefined;

type ProductsPageProps = {
  searchParams: { [key: string]: Param };
};

const parse = (param: Param) => {
  return typeof param === "string" ? param : undefined;
};
const ProductsPage = ({ searchParams }: ProductsPageProps) => {
  const sort = parse(searchParams.sort); // get the sort value passed in URL
  const category = parse(searchParams.category); // get the category value passed in URL

  const label = getLabel(category);

  return (
    <MaxWidthWrapper>
      <ProductReel
        title={label ?? "Browse High Quality Products"}
        query={{
          category,
          limit: 40,
          sort: sort === "desc" || sort === "asc" ? sort : undefined,
        }}
      />
    </MaxWidthWrapper>
  );
};

export default ProductsPage;
