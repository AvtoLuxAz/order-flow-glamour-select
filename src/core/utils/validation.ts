import { z } from "zod";
import { logger } from "./logger";

// Common validation schemas
export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(5, "Email is too short")
  .max(255, "Email is too long");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(100, "Password is too long")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
  );

export const phoneSchema = z
  .string()
  .regex(
    /^\+?[1-9]\d{1,14}$/,
    "Phone number must be in international format (e.g., +1234567890)"
  );

// Generic validation function
export const validateInput = <T>(
  schema: z.ZodType<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessage = error.errors.map((e) => e.message).join(", ");
      logger.warn("Validation error:", { error: errorMessage, data });
      return { success: false, error: errorMessage };
    }
    logger.error("Unexpected validation error:", error);
    return { success: false, error: "An unexpected error occurred" };
  }
};

// Example form schemas
export const loginFormSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional(),
});

export const registrationFormSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
    firstName: z
      .string()
      .min(2, "First name is too short")
      .max(50, "First name is too long"),
    lastName: z
      .string()
      .min(2, "Last name is too short")
      .max(50, "Last name is too long"),
    phone: phoneSchema.optional(),
    acceptTerms: z
      .boolean()
      .refine(
        (val) => val === true,
        "You must accept the terms and conditions"
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

// Type inference helpers
export type LoginForm = z.infer<typeof loginFormSchema>;
export type RegistrationForm = z.infer<typeof registrationFormSchema>;
