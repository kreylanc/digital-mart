"use client";

import { Icons } from "@/components/Icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  TSigninValidator,
  signinValidator,
} from "@/lib/validators/acc-credential-validation";
import { trpc } from "@/trpc/client";
import { ZodError } from "zod";
import { useRouter, useSearchParams } from "next/navigation";

const SignUp = () => {
  // destructing useForm from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TSigninValidator>({
    resolver: zodResolver(signinValidator),
  });

  // initialize router and searchParams
  const router = useRouter();
  const searchParams = useSearchParams();
  // check if the user signed in as a seller
  const isSeller = searchParams.get("as") === "seller";

  const origin = searchParams.get("origin"); // the original url user got redirected from to this page

  // initialize the createUser procedure
  const { mutate, isLoading, error } = trpc.auth.signIn.useMutation({
    // handling errors from the backend
    onError: (err) => {
      // if the backend throws error of CONFLICT
      if (err.data?.code === "UNAUTHORIZED") {
        toast.error(err.message);
        return;
      }
      // if the error is a validation error from Zod
      if (err instanceof ZodError) {
        toast.error(err.issues[0].message);
        return;
      }

      // for any generic errors that may occur
      toast.error("Something went wrong. Please try again later.");
    },
    // if user sign in process was successful
    onSuccess: () => {
      toast.success("Signed in successfuly");

      router.refresh(); // refresh the page

      // if origin url exists, redirect user to that page
      if (origin) {
        router.push(`/${origin}`);

        return;
      }

      if (isSeller) {
        router.push("/sell");
        return;
      }

      router.push("/");
    },
  });

  // function called when submitting form
  const onSubmit: SubmitHandler<TSigninValidator> = ({ email, password }) => {
    // call the mutation with email and password input
    mutate({ email, password });
  };

  // function called when continuing as seller
  const asSeller = () => {
    router.push("?as=seller");
  };

  // function called when continuing as customer
  const asCustomer = () => {
    router.replace("/sign-in", undefined);
  };

  return (
    <div className="flex flex-col w-full pt-20 px-4 gap-y-6 items-center justify-center sm:max-w-md mx-auto">
      <div className="relative flex flex-col gap-y-2 items-center">
        {<Icons.logo className="h-16 w-16" />}
        <h1 className="text-2xl text-center md:text-4xl font-bold">
          Sign in to your {isSeller ? "seller" : ""} account
        </h1>
        <Button asChild variant="link" className="text-blue-500">
          <Link href="/sign-up">
            Don&apos;t have an account? Register
            <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </Button>
      </div>
      <div className="w-full grid gap-6">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2 py-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="you@example.com"
              className={cn({
                "focus-visible:outline-red-500 outline-1": errors.email,
              })}
            />
            {errors?.email && (
              <p className="text-destructive text-sm">{errors.email.message}</p>
            )}
          </div>
          <div className="grid gap-2 py-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="password"
              className={cn({
                "ring-red-500 ring-1 focus-visible:ring-red-500 ":
                  errors.password,
              })}
            />
            {errors?.password && (
              <p className="text-destructive text-sm">
                {errors.password?.message}
              </p>
            )}
          </div>
          <Button className="w-full mt-4">Sign in</Button>
        </form>

        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute inset-0 flex items-center"
          >
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-background text-muted-foreground text-sm px-2 uppercase">
              Or
            </span>
          </div>
        </div>

        {isSeller ? (
          <Button onClick={asCustomer} disabled={isLoading} variant="secondary">
            Continue as customer
          </Button>
        ) : (
          <Button onClick={asSeller} disabled={isLoading} variant="secondary">
            Continue as seller
          </Button>
        )}
      </div>
    </div>
  );
};

export default SignUp;
