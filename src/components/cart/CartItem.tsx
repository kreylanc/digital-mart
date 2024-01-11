import { useCart } from "@/hooks/useCart";
import { getLabel } from "@/lib/getLabel";
import { formatPrice } from "@/lib/utils";
import { Product } from "@/payload-types";
import { ImageIcon, X } from "lucide-react";
import Image from "next/image";

const CartItem = ({ product }: { product: Product }) => {
  const { image } = product.images[0];

  const { removeItem } = useCart();

  // Get the label of the category using the value in product object
  const label = getLabel(product.category);

  return (
    <div className="flex justify-between py-2 mt-4">
      <div className="flex gap-4">
        <div className="relative aspect-square rounded-lg h-20 w-20">
          {typeof image !== "string" && image.url ? (
            <Image
              src={image.url}
              className="object-cover object-center rounded-lg"
              alt={image.alt}
              fill
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-secondary">
              <ImageIcon className="text-muted-foreground" />
            </div>
          )}
        </div>
        {/* Product name and category */}

        <div className="flex flex-col items-start">
          <span className="font-medium text-sm">{product.name}</span>

          <span className="line-clamp-1 text-xs text-muted-foreground">
            {label}
          </span>
          <div className="mt-auto">
            <button
              onClick={() => removeItem(product.id)}
              className="flex gap-1 items-center text-sm text-destructive"
            >
              <X size={14} />
              <span>Remove</span>
            </button>
          </div>
        </div>
      </div>
      <div className="flex flex-col text-sm">
        <span className="font-medium">{formatPrice(product.price)}</span>
      </div>
    </div>
  );
};

export default CartItem;
