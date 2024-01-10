import { PRODUCT_CATEGORIES } from "@/config";

export const getLabel = (category: "ui_kits" | "icons") =>
  PRODUCT_CATEGORIES.find(({ value }) => value === category)?.label;
