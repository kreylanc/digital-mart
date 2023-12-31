import { z } from "zod";

// defining schema for form validation
export const registerValidator = z
  .object({
    email: z.string().email({ message: "Invalid email." }),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 charactes long." }),
    cpassword: z
      .string()
      .min(8, { message: "Password must be at least 8 charactes long." }),
  })
  .refine((data) => data.password === data.cpassword, {
    message: "Passwords does not match.",
    path: ["cpassword"], // path of error
  });

export const signinValidator = z.object({
  email: z.string().email({ message: "Invalid email." }),
  password: z.string(),
});

// get types from zod schema to pass it on react-hook useForm
export type TRegisterValidator = z.infer<typeof registerValidator>;
export type TSigninValidator = z.infer<typeof signinValidator>;
