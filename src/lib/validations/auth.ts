import { z } from "zod";

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email wajib diisi")
  .email("Format email tidak valid")
  .max(254, "Email terlalu panjang");

const loginPasswordSchema = z.string().min(1, "Password wajib diisi");

const registerPasswordSchema = z
  .string()
  .min(1, "Password wajib diisi")
  .min(6, "Password minimal 6 karakter")
  .max(72, "Password maksimal 72 karakter");

const nameSchema = z
  .string()
  .trim()
  .min(1, "Nama lengkap wajib diisi")
  .min(2, "Nama lengkap minimal 2 karakter")
  .max(80, "Nama lengkap maksimal 80 karakter");

export const loginSchema = z.object({
  email: emailSchema,
  password: loginPasswordSchema,
});

export const registerRequestSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  password: registerPasswordSchema,
});

export const registerFormSchema = registerRequestSchema
  .extend({
    confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;

export function getFirstValidationError(error: z.ZodError) {
  const fieldErrors = error.flatten().fieldErrors;
  return (
    Object.values(fieldErrors)
      .flat()
      .find((message): message is string => Boolean(message)) ||
    "Data yang dimasukkan tidak valid"
  );
}
