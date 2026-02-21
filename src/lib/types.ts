export type UserRole = "requester" | "runner" | "both";

export type ServiceType = "print" | "food" | "document" | "koperasi" | "other";

export type OrderStatus =
  | "open"
  | "taken"
  | "on_process"
  | "delivered"
  | "completed"
  | "cancelled"
  | "disputed";

export type CancelledBy = "requester" | "runner" | "admin";

export type PaymentMethod =
  | "qris"
  | "gopay"
  | "ovo"
  | "dana"
  | "bank_transfer";

export type TransactionStatus = "pending" | "paid" | "failed" | "refunded";

export type DisbursementStatus = "pending" | "processing" | "success" | "failed";

export type ChatType = "text" | "image" | "system";

export type OrderProofStage = "pickup" | "delivery";

export type NotificationType =
  | "order_taken"
  | "order_completed"
  | "payment_success"
  | "new_review"
  | "disbursement"
  | "system";

export type DevicePlatform = "android" | "ios";

export type PromotionType = "discount" | "cashback" | "free_service_fee";

export type ReportReason =
  | "fraud"
  | "item_missing"
  | "harassment"
  | "fake_completion"
  | "other";

export type ReportStatus = "open" | "investigating" | "resolved" | "dismissed";

export type AdminRole = "superadmin" | "admin" | "support";

export interface University {
  id: string;
  name: string;
  city: string;
  province: string;
  logo_url: string | null;
  is_active: boolean;
  total_users: number;
  created_at: string;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: AdminRole;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  password_hash: string;
  role: UserRole;
  university_id: string | null;
  faculty: string | null;
  student_id_number: string;
  ktm_photo_url: string | null;
  profile_photo_url: string | null;
  is_verified: boolean;
  is_active: boolean;
  runner_is_online: boolean;
  rating_avg: number;
  total_orders: number;
  balance: number;
  pin_hash: string | null;
  referral_code: string | null;
  referred_by: string | null;
  last_active_at: string | null;
  app_version: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_code: string;
  requester_id: string;
  runner_id: string | null;
  university_id: string | null;
  service_type: ServiceType | null;
  title: string;
  description: string;
  photo_url: string | null;
  pickup_location: string;
  delivery_location: string;
  requester_lat: number | null;
  requester_lng: number | null;
  item_price: number;
  service_fee: number;
  platform_commission: number;
  total_amount: number;
  runner_earning: number;
  promo_code: string | null;
  discount_amount: number;
  status: OrderStatus;
  cancelled_by: CancelledBy | null;
  cancel_reason: string | null;
  runner_response_at: string | null;
  completed_at: string | null;
  expired_at: string;
  is_rated: boolean;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  order_id: string | null;
  user_id: string | null;
  transaction_code: string | null;
  payment_method: PaymentMethod | null;
  payment_gateway: string;
  amount: number;
  status: TransactionStatus;
  paid_at: string | null;
  created_at: string;
}

export interface Disbursement {
  id: string;
  runner_id: string | null;
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: DisbursementStatus;
  processed_by: string | null;
  processed_at: string | null;
  transfer_proof_url: string | null;
  note: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  order_id: string | null;
  reviewer_id: string | null;
  reviewee_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
}

export interface Chat {
  id: string;
  order_id: string | null;
  sender_id: string | null;
  message: string;
  type: ChatType;
  media_url: string | null;
  is_read: boolean;
  created_at: string;
}

export interface OrderProof {
  id: string;
  order_id: string | null;
  runner_id: string | null;
  photo_url: string;
  stage: OrderProofStage;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string | null;
  type: NotificationType | null;
  title: string;
  body: string;
  is_read: boolean;
  related_id: string | null;
  related_type: string | null;
  created_at: string;
}

export interface DeviceToken {
  id: string;
  user_id: string | null;
  token: string;
  platform: DevicePlatform;
  is_active: boolean;
  created_at: string;
}

export interface UserLocation {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  updated_at: string;
}

export interface SavedLocation {
  id: string;
  user_id: string;
  label: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

export interface Promotion {
  id: string;
  code: string;
  title: string;
  type: PromotionType;
  value: number;
  is_percentage: boolean;
  min_transaction: number;
  max_usage: number | null;
  used_count: number;
  expired_at: string | null;
  is_active: boolean;
}

export interface RunnerStats {
  id: string;
  runner_id: string;
  total_completed: number;
  total_cancelled: number;
  completion_rate: number;
  avg_response_time: number | null;
  total_earning_alltime: number;
  updated_at: string;
}

export interface SystemSettings {
  id: string;
  platform_name: string;
  support_email: string;
  daily_summary_enabled: boolean;
  report_notification_enabled: boolean;
  enforce_admin_2fa: boolean;
  auto_logout_enabled: boolean;
}

export interface Report {
  id: string;
  reporter_id: string | null;
  reported_user_id: string | null;
  order_id: string | null;
  reason: ReportReason | null;
  description: string;
  evidence_url: string | null;
  status: ReportStatus;
  resolution_note: string | null;
  resolved_by: string | null;
  created_at: string;
}
