export type VehicleStatus = 'ACTIF' | 'MAINTENANCE' | 'HORS_SERVICE';

export interface Vehicle {
  id: string;
  name: string;
  model: string;
  imageUrl: string | null;
  description: string;
  capacity: number;
  status: VehicleStatus;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Agency {
  id: string;
  city: string;
  country: string;
  countryCode: string;
  address: string;
  openingHours: string;
  ticketPhones: string[];
  parcelPhones: string[];
  email: string | null;
  mapUrl: string | null;
  latitude: number | null;
  longitude: number | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsItem {
  id: string;
  title: string;
  images: string[];
  content: string;
  excerpt: string;
  published: boolean;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  slogan: string;
  description: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  phone: string;
  whatsapp: string | null;
  email: string;
  address: string;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  heroImageUrl: string | null;
  heroUsersLabel: string;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  appPreviewImageUrl: string | null;
  updatedAt: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'EDITOR';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
}

export interface AuthResponse extends AdminUser {
  csrfToken?: string;
}

export interface AdminAccount {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLogEntry {
  id: string;
  adminId: string | null;
  adminEmail: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  metadata: unknown;
  createdAt: string;
}

export interface Destination {
  id: string;
  name: string;
  siteLabel: string;
  countryCode: string;
  imageUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Schedule {
  id: string;
  agencyId: string | null;
  agency?: { id: string; city: string; country: string } | null;
  origin: string;
  destination: string;
  times: string[];
  frequency: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type FareType = 'BUS' | 'COLIS';

export interface Fare {
  id: string;
  type: FareType;
  origin: string;
  destination: string;
  price: number;
  label: string;
  description: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type SupportCategory = 'TICKET' | 'PARCEL' | 'MONEY';

export interface SupportNumber {
  id: string;
  category: SupportCategory;
  phone: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Suggestion {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  rating: number;
  message: string;
  approved: boolean;
  createdAt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  photoUrl: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
}
