import { z } from 'zod';

export const chatSchema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().min(1).max(2000),
      }),
    )
    .min(1)
    .max(30),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const vehicleSchema = z.object({
  name: z.string().min(1).max(120),
  model: z.string().min(1).max(120),
  imageUrl: z.string().url().nullable().optional(),
  description: z.string().max(2000).optional().default(''),
  capacity: z.coerce.number().int().min(0).max(200).optional().default(0),
  status: z.enum(['ACTIF', 'MAINTENANCE', 'HORS_SERVICE']).optional().default('ACTIF'),
  order: z.coerce.number().int().optional().default(0),
});

export const agencySchema = z.object({
  city: z.string().min(1).max(120),
  country: z.string().min(1).max(60).optional().default('Togo'),
  countryCode: z.string().min(2).max(6).optional().default('+228'),
  address: z.string().max(300).optional().default(''),
  openingHours: z.string().max(200).optional().default(''),
  ticketPhones: z.array(z.string().min(4).max(30)).max(10).optional().default([]),
  parcelPhones: z.array(z.string().min(4).max(30)).max(10).optional().default([]),
  email: z.string().email().nullable().optional(),
  mapUrl: z.string().url().nullable().optional(),
  latitude: z.coerce.number().min(-90).max(90).nullable().optional(),
  longitude: z.coerce.number().min(-180).max(180).nullable().optional(),
  order: z.coerce.number().int().optional().default(0),
});

export const newsSchema = z.object({
  title: z.string().min(1).max(200),
  images: z.array(z.string().url()).max(10).optional().default([]),
  content: z.string().max(10000).optional().default(''),
  excerpt: z.string().max(400).optional().default(''),
  published: z.boolean().optional().default(true),
  publishedAt: z.coerce.date().optional(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1).max(120).optional(),
  slogan: z.string().max(300).optional(),
  description: z.string().max(2000).optional(),
  logoUrl: z.string().url().nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  secondaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  phone: z.string().max(30).optional(),
  whatsapp: z.string().max(30).nullable().optional(),
  email: z.string().email().optional(),
  address: z.string().max(300).optional(),
  facebookUrl: z.string().url().nullable().optional(),
  instagramUrl: z.string().url().nullable().optional(),
  twitterUrl: z.string().url().nullable().optional(),
  heroImageUrl: z.string().url().nullable().optional(),
  heroUsersLabel: z.string().max(30).optional(),
  appStoreUrl: z.string().url().nullable().optional(),
  playStoreUrl: z.string().url().nullable().optional(),
  appPreviewImageUrl: z.string().url().nullable().optional(),
});

export const destinationSchema = z.object({
  name: z.string().min(1).max(120),
  siteLabel: z.string().max(200).optional().default(''),
  countryCode: z
    .string()
    .min(2)
    .max(2)
    .regex(/^[a-z]{2}$/, 'Code pays ISO à deux lettres minuscules (ex: tg)'),
  imageUrl: z.string().url().nullable().optional(),
  order: z.coerce.number().int().optional().default(0),
});

export const serviceSchema = z.object({
  title: z.string().min(1).max(120),
  description: z.string().max(500).optional().default(''),
  icon: z.string().max(60).optional().default('Bus'),
  order: z.coerce.number().int().optional().default(0),
});

export const scheduleSchema = z.object({
  agencyId: z.string().uuid().nullable().optional(),
  origin: z.string().min(1).max(120),
  destination: z.string().min(1).max(120),
  times: z.array(z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Format attendu HH:MM')).max(20).optional().default([]),
  frequency: z.string().max(120).optional().default('Quotidien'),
  order: z.coerce.number().int().optional().default(0),
});

export const fareSchema = z.object({
  type: z.enum(['BUS', 'COLIS']).optional().default('BUS'),
  origin: z.string().min(1).max(120),
  destination: z.string().max(120).optional().default(''),
  price: z.coerce.number().int().min(0),
  label: z.string().max(120).optional().default(''),
  description: z.string().max(500).optional().default(''),
  order: z.coerce.number().int().optional().default(0),
});

export const supportNumberSchema = z.object({
  category: z.enum(['TICKET', 'PARCEL', 'MONEY']),
  phone: z.string().min(6).max(30),
  order: z.coerce.number().int().optional().default(0),
});

export const suggestionCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(''),
  message: z.string().min(1).max(3000),
});

export const contactMessageCreateSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  phone: z.string().max(30).optional().default(''),
  subject: z.string().max(120).optional().default('Général'),
  message: z.string().min(1).max(3000),
});

export const markReadSchema = z.object({
  isRead: z.boolean(),
});

export const reorderSchema = z.object({
  items: z
    .array(z.object({ id: z.string().min(1), order: z.number().int() }))
    .min(1)
    .max(500),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(100),
});

export const createAdminSchema = z.object({
  name: z.string().min(1).max(120),
  email: z.string().email(),
  password: z.string().min(8).max(100),
  role: z.enum(['SUPER_ADMIN', 'EDITOR']).optional().default('EDITOR'),
});

export const updateAdminSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  role: z.enum(['SUPER_ADMIN', 'EDITOR']).optional(),
  isActive: z.boolean().optional(),
});

export const resetPasswordSchema = z.object({
  newPassword: z.string().min(8).max(100),
});

export const faqItemSchema = z.object({
  question: z.string().min(1).max(300),
  answer: z.string().min(1).max(3000),
  category: z.string().max(80).optional().default('Général'),
  order: z.coerce.number().int().optional().default(0),
});

export const testimonialCreateSchema = z.object({
  name: z.string().min(1).max(120),
  rating: z.coerce.number().int().min(1).max(5).optional().default(5),
  message: z.string().min(1).max(1000),
});

export const testimonialModerateSchema = z.object({
  approved: z.boolean(),
});

export const teamMemberSchema = z.object({
  name: z.string().min(1).max(120),
  role: z.string().min(1).max(120),
  photoUrl: z.string().url().nullable().optional(),
  order: z.coerce.number().int().optional().default(0),
});
