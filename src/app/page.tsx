import MaxWidthWrapper from "@/components/MaxWidthWrapper";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowDownToLine, CheckCircle, Leaf } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const perks = [
    {
      name: "Instant Delivery",
      description:
        "Get your assets delivered to your email in seconds and download them right away.",
      icon: ArrowDownToLine,
    },
    {
      name: "Guaranteed Quality",
      description:
        "Every asset on our platform is verified bby our team to ensure our highest quality standards. Not happy? We offer a 30-day refund guarantee.",
      icon: CheckCircle,
    },
    {
      name: "For the Planet",
      description:
        "We've pledged 1% of sales to the preservation and restoration of the natural environment.",
      icon: Leaf,
    },
  ];
  return (
    <>
      <MaxWidthWrapper>
        <div className="py-20 mx-auto text-center flex flex-col items-center max-w-3xl">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl text-slate-600">
            Your marketplace for high-quality{" "}
            <span className="text-slate-900">digital assets</span>.
          </h1>
          <p className="mt-6 text-lg max-w-prose text-muted-foreground">
            Welcome to DigitalHippo. Every asset on our platform is verified by
            our team to ensure highest quality standards.
          </p>
          <div className="flex flex-col mt-6 gap-4 md:flex-row">
            <Link href="/products" className={buttonVariants()}>
              Browse Trending
            </Link>
            <Button variant="ghost">Our Quality Promise &rarr;</Button>
          </div>
        </div>

        {/* TODO: Add product lists */}
      </MaxWidthWrapper>
      <section className="border-t bg-gray-50 border-gray-200">
        <MaxWidthWrapper classname="py-20">
          <div className="grid grid-cols-1 gap-y-12 sm:gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {perks.map((perk, i) => (
              <div
                className="flex flex-col items-center justify-center text-center sm:last:col-span-full lg:last:col-span-1"
                key={i}
              >
                <div className="flex justify-center">
                  <div className="flex items-center justify-center bg-slate-200 w-16 h-16 rounded-full text-slate-800">
                    {<perk.icon className="h-1/3 w-1/3" />}
                  </div>
                </div>
                <div className="flex flex-1 flex-col mt-6">
                  <h3 className="font-bold text-base">{perk.name}</h3>
                  <p className="text-muted-foreground text-sm mt-3">
                    {perk.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </MaxWidthWrapper>
      </section>
    </>
  );
}
