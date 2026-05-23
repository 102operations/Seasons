import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().min(2).optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  shortDesc: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  comparePrice: z.number().positive().optional().nullable(),
  cost: z.number().positive().optional().nullable(),
  sku: z.string().optional().nullable(),
  stock: z.number().int().min(0).default(0),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  isActive: z.boolean().default(true),
  categoryId: z.string().min(1, 'Category is required'),
  images: z.array(z.string()).default([]),
  thumbnail: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  order: z.number().int().default(0),
});

export const orderSchema = z.object({
  customerName: z.string().min(2, 'Name is required'),
  customerPhone: z.string().min(8, 'Valid phone number is required'),
  customerEmail: z.string().email().optional().or(z.literal('')),
  shippingAddress: z.string().min(10, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  region: z.string().optional(),
  postalCode: z.string().optional(),
  notes: z.string().optional(),
  promoCode: z.string().optional(),
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1, 'Cart cannot be empty'),
});

export const offerSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  title: z.string().min(2),
  description: z.string().optional().nullable(),
  discountType: z.enum(['PERCENTAGE', 'FIXED']),
  discountValue: z.number().positive(),
  minOrderAmount: z.number().positive().optional().nullable(),
  maxDiscount: z.number().positive().optional().nullable(),
  usageLimit: z.number().int().positive().optional().nullable(),
  isActive: z.boolean().default(true),
  startsAt: z.string().optional().nullable(),
  expiresAt: z.string().optional().nullable(),
});

export const bannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional().nullable(),
  image: z.string().min(1, 'Image is required'),
  mobileImage: z.string().optional().nullable(),
  link: z.string().optional().nullable(),
  buttonText: z.string().optional().nullable(),
  position: z.enum(['HERO', 'MIDDLE', 'FOOTER']).default('HERO'),
  order: z.number().int().default(0),
  isActive: z.boolean().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type OrderInput = z.infer<typeof orderSchema>;
export type OfferInput = z.infer<typeof offerSchema>;
export type BannerInput = z.infer<typeof bannerSchema>;
