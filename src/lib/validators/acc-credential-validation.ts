import { z } from "zod";

// defining schema for form validation
export const credValidator = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 charactes long." }),
});

// get types from formSchema to pass it on useForm
export type TCredValidator = z.infer<typeof credValidator>;
