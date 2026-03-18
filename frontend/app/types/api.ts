/**
 * API Types for Esperion Agency Web
 *
 * TypeScript types for all API responses
 */

// ============== Common Types ==============

export interface ApiResponse<T> {
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  limit: number
  offset: number
}

// ============== Auth Types ==============

export interface User {
  id: string
  email: string
  full_name: string
  role: UserRole
  phone?: string
  username: string
  created_at?: string
  updated_at?: string
}

export type UserRole = 'admin' | 'editor' | 'viewer'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name: string
  username: string
  phone?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface RefreshTokenRequest {
  refresh_token: string
}

// ============== Article Types ==============

export interface Article {
  id: string
  title: string
  slug_id: string
  slug_en: string
  content_id: string
  content_en: string
  excerpt_id?: string
  excerpt_en?: string
  category: string
  image?: string
  author: User
  published: boolean
  published_at?: string
  translation_status: string
  created_at?: string
  updated_at?: string
}

export interface ArticleFilter {
  category?: string
  language?: 'id' | 'en'
  published?: boolean
  limit?: number
  offset?: number
}

export interface CreateArticleRequest {
  title: string
  slug_id: string
  slug_en: string
  content_id: string
  content_en: string
  excerpt_id?: string
  excerpt_en?: string
  category: string
  image?: string
  published?: boolean
}

export interface UpdateArticleRequest {
  title?: string
  slug_id?: string
  slug_en?: string
  content_id?: string
  content_en?: string
  excerpt_id?: string
  excerpt_en?: string
  category?: string
  image?: string
  published?: boolean
}

// ============== Media Types ==============

export interface Media {
  id: string
  filename: string
  path: string
  alt_text?: string
  year: number
  month: number
  type: string
  size: number
  webp_path?: string
  original_path: string
  uploaded_by?: string
  created_at?: string
}

export interface MediaUploadResponse {
  id: string
  filename: string
  path: string
  url: string
  webp_url?: string
  media_type: string
  size: number
  alt_text?: string
}

export interface MediaFilter {
  year?: number
  month?: number
  media_type?: string
  search?: string
  limit?: number
  offset?: number
}

export interface UpdateMediaRequest {
  alt_text?: string
}

// ============== Work Types ==============

export interface WorkMetric {
  label: string
  value: string
  suffix?: string
}

export interface Work {
  id: string
  title: string
  slug: string
  description: string
  service: string
  platform: string
  image: string
  metrics: WorkMetric[]
  client_name: string
  featured: boolean
  created_at?: string
}

export interface WorkFilter {
  service?: string
  platform?: string
  featured?: boolean
  limit?: number
  offset?: number
}

export interface CreateWorkRequest {
  title: string
  slug: string
  description: string
  service: string
  platform: string
  image: string
  client_name: string
  metrics?: WorkMetric[]
  featured?: boolean
}

export interface UpdateWorkRequest {
  title?: string
  description?: string
  service?: string
  platform?: string
  image?: string
  client_name?: string
  metrics?: WorkMetric[]
  featured?: boolean
}

// ============== Service Types ==============

export interface FaqItem {
  question: string
  answer: string
  order: number
}

export interface PricingRow {
  feature: string
  basic: string
  standard: string
  premium: string
}

export interface PricingTable {
  currency: string
  rows: PricingRow[]
}

export interface Service {
  id: string
  title: string
  slug: string
  description: string
  icon?: string
  featured: boolean
  display_order: number
  pricing_table?: PricingTable
  faq?: FaqItem[]
  created_at?: string
}

export interface ServiceFilter {
  featured?: boolean
  limit?: number
  offset?: number
}

export interface CreateServiceRequest {
  title: string
  slug: string
  description: string
  icon?: string
  featured?: boolean
  display_order?: number
  pricing_table?: PricingTable
  faq?: FaqItem[]
}

export interface UpdateServiceRequest {
  title?: string
  description?: string
  icon?: string
  featured?: boolean
  display_order?: number
  pricing_table?: PricingTable
  faq?: FaqItem[]
}

// ============== Client Types ==============

export type ClientStatus = 'active' | 'inactive' | 'prospect'

export interface Client {
  id: string
  name: string
  logo: string
  testimonial?: string
  featured: boolean
  category?: string
  status: ClientStatus
  internal_notes?: string
  created_at?: string
}

export interface ClientLogo {
  id: string
  name: string
  logo: string
  category?: string
}

export interface ClientFilter {
  featured?: boolean
  category?: string
  status?: string
  limit?: number
  offset?: number
}

export interface CreateClientRequest {
  name: string
  logo: string
  testimonial?: string
  featured?: boolean
  category?: string
  status?: string
  internal_notes?: string
}

export interface UpdateClientRequest {
  name?: string
  logo?: string
  testimonial?: string
  featured?: boolean
  category?: string
  status?: string
  internal_notes?: string
}

export interface ClientStats {
  total: number
  featured: number
  by_status: {
    active: number
    inactive: number
    prospect: number
  }
  by_category: { category: string, count: number }[]
}

// ============== Contact Types ==============

export type ContactStatus = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'

export interface ContactSubmission {
  id: string
  full_name: string
  company_name?: string
  service: string
  description: string
  email?: string
  phone?: string
  recaptcha_score?: number
  status: ContactStatus
  notes?: string
  created_at?: string
}

export interface ContactFilter {
  service?: string
  status?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export interface CreateContactRequest {
  full_name: string
  company_name?: string
  service: string
  description: string
  email?: string
  phone?: string
  recaptcha_token?: string
}

export interface UpdateContactRequest {
  company_name?: string
  service?: string
  description?: string
  email?: string
  phone?: string
  status?: string
  notes?: string
}

export interface ContactStats {
  total: number
  by_status: {
    new: number
    contacted: number
    qualified: number
    converted: number
    lost: number
  }
  by_service: { service: string, count: number }[]
}

// ============== Analytics & Consent Types ==============

export interface ConsentTierState {
  essential: boolean
  analytics: boolean
  functional: boolean
  marketing: boolean
}

export interface PublicAnalyticsConfig {
  ga4_measurement_id?: string
  gtm_container_id?: string
  clarity_project_id?: string
  meta_pixel_id?: string
  tiktok_pixel_id?: string
  linkedin_partner_id?: string
  enabled: boolean
  consent_required: boolean
  consent_tiers?: ConsentTierState
  trackers_blocked: string[]
}

export interface TrackEventRequest {
  event_name: string
  session_id?: string
  page_url: string
  referrer?: string
  country?: string
  language?: string
  device_type?: string
  metadata?: Record<string, unknown>
}

export interface TrackEventResponse {
  success: boolean
  message: string
}

export interface ConsentPreferences {
  version: string
  timestamp: string
  tiers: ConsentTierState
}

export interface ConsentSavedResponse {
  success: boolean
  message: string
  effective_config: PublicAnalyticsConfig
}
