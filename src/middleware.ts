import { NextRequest, NextResponse } from "next/server";
import { getServerSideUser } from "./lib/payload-utils";

export async function middleware(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const { user } = await getServerSideUser(cookies);

  // if user is logged in and tries to acces the sign in/sign up page
  if (user && ["/sign-in", "/sign-up"].includes(nextUrl.pathname)) {
    // redirect user to the home page
    return NextResponse.redirect(`${process.env.NEXT_PUBLIC_SERVER_URL}/`);
  }

  return NextResponse.next();
}
