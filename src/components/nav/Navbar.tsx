import Link from "next/link";
import MaxWidthWrapper from "../MaxWidthWrapper";
import { Icons } from "../Icons";
import NavItems from "./NavItems";
import { buttonVariants } from "../ui/button";
import Cart from "../cart/Cart";
import { getServerSideUser } from "@/lib/payload-utils";
import { cookies } from "next/headers";
import UserInfoNav from "./UserInfoNav";

const Navbar = async () => {
  const nextCookie = cookies();
  const { user } = await getServerSideUser(nextCookie);
  return (
    <header className="sticky top-0 z-50 bg-white inset-x-0  h-16">
      <MaxWidthWrapper>
        <div className="border-b border-slate-300">
          <div className="flex h-16 items-center">
            {/* TODO: Mobile Nav here */}

            <div className="flex gap-x-3">
              <Link href="/">
                <Icons.logo className="h-10 w-10" />
              </Link>
              <div className="hidden z-50 lg:ml-8 lg:block">
                <NavItems />
              </div>
            </div>
            <div className="hidden ml-auto md:flex gap-x-6 md:flex-1 md:items-center justify-end">
              {user ? null : (
                <Link
                  href="/sign-in"
                  className={buttonVariants({ variant: "default" })}
                >
                  Sign in
                </Link>
              )}
              {user ? null : (
                <span
                  className="h-6 w-px bg-gray-200"
                  aria-hidden="true"
                ></span>
              )}
              {user ? (
                <UserInfoNav user={user} />
              ) : (
                <Link
                  href="/sign-up"
                  className={buttonVariants({ variant: "ghost" })}
                >
                  Register
                </Link>
              )}

              <span className="h-6 w-px bg-gray-200" aria-hidden="true"></span>

              <div className="flow-root">
                <Cart />
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </header>
  );
};

export default Navbar;
