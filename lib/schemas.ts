import { z } from "zod"

/**
 * Translation request schema for API validation
 * Ensures type safety and input validation
 */
export const TranslationRequestSchema = z.object({
  input: z
    .string()
    .min(1, "Input cannot be empty")
    .max(5000, "Input exceeds maximum length of 5000 characters")
    .trim()
    .refine((val) => val.length > 0, "Input cannot be only whitespace"),
  mode: z.enum(["pm-to-dev", "dev-to-pm"], {
    errorMap: () => ({ message: "Invalid translation mode. Must be 'pm-to-dev' or 'dev-to-pm'" }),
  }),
})

export type TranslationRequest = z.infer<typeof TranslationRequestSchema>
