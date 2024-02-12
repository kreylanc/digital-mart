import { PRODUCT_CATEGORIES } from "@/config";

export const getLabel = (category: string | undefined) =>
  PRODUCT_CATEGORIES.find(({ value }) => value === category)?.label;
