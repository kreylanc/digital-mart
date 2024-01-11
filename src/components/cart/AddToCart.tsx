"use client";

import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useCart } from "@/hooks/useCart";
import { Product } from "@/payload-types";

const AddToCart = ({ product }: { product: Product }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  // cart state
  const { addItem } = useCart();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsSuccess(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [isSuccess]);

  return (
    <Button
      onClick={() => {
        addItem(product);
        setIsSuccess(true);
      }}
      className="w-full"
      size="lg"
    >
      {isSuccess ? "Added!" : "Add to Cart"}
    </Button>
  );
};

export default AddToCart;
