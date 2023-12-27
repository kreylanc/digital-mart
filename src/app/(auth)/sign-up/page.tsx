"use client";

import { Icons } from "@/components/Icons";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  TCredValidator,
  credValidator,
} from "@/lib/validators/acc-credential-validation";

const SignUp = () => {
  // destructing useForm from react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TCredValidator>({
    resolver: zodResolver(credValidator),
  });

  //   function called when submitting form
  const onSubmit: SubmitHandler<TCredValidator> = ({ email, password }) => {
    toast(`${email} ${password}`);
  };

  return (
    <div className="flex flex-col pt-20 px-4 gap-y-6 items-center justify-center sm:max-w-md mx-auto">
      <div className="relative flex flex-col gap-y-2 items-center  ">
        {<Icons.logo className="h-16 w-16" />}
        <h1 className="text-2xl md:text-4xl font-bold">Create an account</h1>
        <Link
          href="/sign-in"
          className={buttonVariants({
            className: "text-blue-500",
            variant: "link",
            size: "sm",
          })}
        >
          Already have an account? Sign in
          <ArrowRight size={16} className="ml-1.5" />
        </Link>
      </div>
      <div className="w-full">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-1 py-2">
            <Label htmlFor="email">Email</Label>
            <Input
              {...register("email")}
              id="email"
              placeholder="you@example.com"
              className={cn({
                "focus-visible:outline-red-500 outline-1": errors.email,
              })}
            />
          </div>
          <div className="grid gap-1 py-2">
            <Label htmlFor="password">Password</Label>
            <Input
              {...register("password")}
              id="password"
              type="password"
              placeholder="password"
              className={cn({ "focus-visible:ring-red-500": errors.password })}
            />
          </div>
          <Button className="w-full mt-4 bg-blue-500">Sign up</Button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
