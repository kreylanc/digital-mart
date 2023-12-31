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
  TRegisterValidator,
  registerValidator,
} from "@/lib/validators/acc-credential-validation";
import { trpc } from "@/trpc/client";
import { ZodError } from "zod";
import { useRouter } from "next/navigation";

const SignUp = () => {
  // destructing useForm from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TRegisterValidator>({
    resolver: zodResolver(registerValidator),
  });

  // initialize router
  const router = useRouter();

  // initialize the createUser procedure
  const { mutate, isLoading, error } = trpc.auth.createUser.useMutation({
    // handling errors from the backend
    onError: (err) => {
      // if the backend throws error of CONFLICT
      if (err.data?.code === "CONFLICT") {
        toast.error("Email is already in use.");
        return;
      }
      // if the error is a validation error from Zod
      if (err instanceof ZodError) {
        /* Example of the error message 
          [
            {
              "code": "invalid_type",
              "expected": "string",
              "received": "number",
              "path": [ "name" ],
              "message": "Expected string, received number"
            }
          ] 
        */
        toast.error(err.issues[0].message);
        return;
      }

      // for any generic errors that may occur
      toast.error("Something went wrong. Please try again later.");
    },
    // if user sign up process was successful
    onSuccess: ({ sentToEmail }) => {
      toast.success("Verification email sent to " + sentToEmail);
      router.push(`/verify-email?to=${sentToEmail}`);
    },
  });

  // function called when submitting form
  const onSubmit: SubmitHandler<TRegisterValidator> = ({
    email,
    password,
    cpassword,
  }) => {
    // call the mutation with email and password input
    mutate({ email, password, cpassword });
  };

  return (
    <div className="flex flex-col w-full pt-20 px-4 gap-y-6 items-center justify-center sm:max-w-md mx-auto">
      <div className="relative flex flex-col gap-y-2 items-center">
        {<Icons.logo className="h-16 w-16" />}
        <h1 className="text-2xl md:text-4xl font-bold">Create an account</h1>
        <Button asChild variant="link" className="text-blue-500">
          <Link href="/sign-in">
            Already have an account? Sign in
            <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </Button>
      </div>
      <div className="w-full">
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
                  errors.password || errors.cpassword?.type === "custom",
              })}
            />
            {errors?.password && (
              <p className="text-destructive text-sm">
                {errors.password?.message}
              </p>
            )}
          </div>
          <div className="grid gap-2 py-2">
            <Label htmlFor="cpassword">Confirm password</Label>
            <Input
              {...register("cpassword")}
              id="cpassword"
              type="password"
              placeholder="confirm password"
              className={cn({
                "ring-red-500 ring-1 focus-visible:ring-red-500":
                  errors.cpassword || errors.password,
              })}
            />
            {errors?.cpassword && (
              <p className="text-destructive text-sm">
                {errors?.cpassword?.message}
              </p>
            )}
          </div>
          <Button className="w-full mt-4">Sign up</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
