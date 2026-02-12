import { z } from 'zod';

// Auth validation schemas
export const emailSchema = z.string().email('Invalid email address');

export const passwordSchema = z.string()
  .min(6, 'Password must be at least 6 characters')
  .max(100, 'Password is too long');

export const nameSchema = z.string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name is too long')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes');

export const authFormSchema = z.object({
  name: nameSchema.optional(),
  email: emailSchema,
  password: passwordSchema,
});

export type AuthFormInput = z.infer<typeof authFormSchema>;

// Entry validation schemas
export const entryContentSchema = z.string()
  .min(1, 'Entry cannot be empty')
  .max(50000, 'Entry is too long');

export const entryTitleSchema = z.string()
  .max(200, 'Title is too long')
  .optional();

export const entryFormSchema = z.object({
  title: entryTitleSchema,
  content: entryContentSchema,
});

export type EntryFormInput = z.infer<typeof entryFormSchema>;

// Utility function to get quality tier based on word count
export const getEntryQuality = (text: string): 'short' | 'medium' | 'long' => {
  const wordCount = text.trim().split(/\s+/).length;
  if (wordCount < 50) return 'short';
  if (wordCount < 200) return 'medium';
  return 'long';
};

// Validation error handling
export const getValidationErrors = (error: unknown): Record<string, string> => {
  if (error instanceof z.ZodError) {
    return error.errors.reduce((acc, err) => {
      const key = err.path.join('.');
      acc[key] = err.message;
      return acc;
    }, {} as Record<string, string>);
  }
  return { general: 'Validation failed' };
};
