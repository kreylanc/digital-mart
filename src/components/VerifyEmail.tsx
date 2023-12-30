"use client";

import { trpc } from "@/trpc/client";
import { Loader2, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "./ui/button";

const VerifyEmail = ({ token }: { token: string }) => {
  const { data, isLoading, error } = trpc.auth.verifyEmail.useQuery({
    token: token,
  });

  if (error) {
    return (
      <div className="flex flex-col gap-2 items-center text-center">
        <XCircle className="text-destructive" size={32} />
        <h1 className="text-2xl font-semibold">There was a problem</h1>
        <p className="text-muted-foreground text-sm">
          This token is not valid or might be expired. Please try again.
        </p>
      </div>
    );
  }

  if (data?.success) {
    return (
      <div className="flex flex-col items-center gap-2">
        <div className="relative h-60 w-60 mb-4 text-muted-foreground">
          <Image
            src="/hippo-email-sent.png"
            alt="hippo email sent image"
            fill
          />
        </div>
        <h1 className="font-semibold text-2xl">Email Verified</h1>
        <p className="text-muted-foreground text-sm text-center">
          Thank you for verifying your email.
        </p>
        <Link
          href="sign-in"
          className={buttonVariants({ className: "mt-2", size: "lg" })}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 items-center text-center">
        <Loader2 className="animate-spin text-muted-foreground" size={32} />
        <h1 className="text-2xl font-semibold">Verifying...</h1>
        <p className="text-muted-foreground text-sm">
          This won&apos;t take long.
        </p>
      </div>
    );
  }
};

export default VerifyEmail;
