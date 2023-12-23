"use client";

import { PRODUCT_CATEGORIES } from "@/config";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

type Category = (typeof PRODUCT_CATEGORIES)[number];

type NavItemProps = {
  category: Category;
  handleOpen: () => void;
  isOpen: boolean;
  isAnyOpen: boolean;
};

const NavItem = ({ category, handleOpen, isOpen, isAnyOpen }: NavItemProps) => {
  return (
    <div className="flex">
      <div className="relative flex items-center">
        <Button
          className="gap-1.5"
          variant={isOpen ? "secondary" : "ghost"}
          onClick={handleOpen}
        >
          {category.label}
          <ChevronDown
            size={16}
            className={cn("text-muted-foreground transition-all", {
              "-rotate-180": isOpen,
            })}
          />
        </Button>
      </div>
      {isOpen ? (
        <div
          className={cn(
            "absolute inset-x-0 top-full mt-1 text-muted-foreground text-sm",
            { "animate-in fade-in-10 slide-in-from-top-5": !isAnyOpen }
          )}
        >
          <div
            className="absolute inset-0 top-1/2 bg-white shadow"
            aria-hidden="true"
          />
          <div className="relative bg-white">
            <div className="max-w-7xl mx-auto px-8">
              <div className="grid grid-cols-4 gap-x-8 gap-y-10 py-16">
                <div className="grid col-span-4 grid-cols-3 col-start-1 gap-x-8">
                  {category.featured.map((item, index) => (
                    <div className="group relative text-base " key={index}>
                      <div className="relative aspect-video bg-muted overflow-hidden rounded-lg  group-hover:opacity-75 transition-opacity">
                        <Image
                          src={item.imageSrc}
                          alt="product image"
                          fill
                          className="object-cover object-center"
                        />
                      </div>
                      <div className="mt-6">
                        <Link
                          href={item.href}
                          className="font-medium text-primary"
                        >
                          {item.name}
                        </Link>
                        <p>Shop now </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default NavItem;
