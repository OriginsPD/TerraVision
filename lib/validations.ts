import * as z from "zod"

export const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(100, "Title cannot exceed 100 characters."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(1000, "Description cannot exceed 1000 characters."),
  location: z.string().min(3, "Location must be at least 3 characters."),
  price: z.coerce.number().positive("Price must be a positive number.").min(100, "Price is too low."),
  land_size: z.coerce.number().positive("Land size must be positive."),
  type: z.enum(["HOUSE", "VILLA", "APARTMENT", "LAND", "CHALET", "TOWNHOME", "PENTHOUSE", "STUDIO"]).default("HOUSE"),
  amenities: z.array(z.string()).default([]),
})

export type PropertyFormValues = z.infer<typeof propertyFormSchema>

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  remember: z.boolean().default(false).optional(),
})

export type LoginFormValues = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  name: z.string().min(2, "Full name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
  role: z.string().min(2),
  terms: z.literal(true, {
    error: "You must agree to the Terms and Privacy Policy."
  }),
})

export type RegisterFormValues = z.infer<typeof registerSchema>

export const inquirySchema = z.object({
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message cannot exceed 500 characters."),
})

export type InquiryFormValues = z.infer<typeof inquirySchema>

export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters."),
  lastName: z.string().min(2, "Last name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  phone: z.string().min(10, "Phone number must be at least 10 characters.").optional(),
})

export type ProfileFormValues = z.infer<typeof profileSchema>

export const messageSchema = z.object({
  content: z.string().min(1, "Message cannot be empty.").max(1000, "Message is too long."),
})

export type MessageFormValues = z.infer<typeof messageSchema>
