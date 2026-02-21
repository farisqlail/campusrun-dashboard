begin;

create extension if not exists "pgcrypto";

create type user_role as enum ('requester', 'runner', 'both');
create type service_type as enum ('print', 'food', 'document', 'koperasi', 'other');
create type order_status as enum ('open', 'taken', 'on_process', 'delivered', 'completed', 'cancelled', 'disputed');
create type cancelled_by as enum ('requester', 'runner', 'admin');
create type payment_method as enum ('qris', 'gopay', 'ovo', 'dana', 'bank_transfer');
create type transaction_status as enum ('pending', 'paid', 'failed', 'refunded');
create type disbursement_status as enum ('pending', 'processing', 'success', 'failed');
create type chat_type as enum ('text', 'image', 'system');
create type order_proof_stage as enum ('pickup', 'delivery');
create type notification_type as enum ('order_taken', 'order_completed', 'payment_success', 'new_review', 'disbursement', 'system');
create type device_platform as enum ('android', 'ios');
create type promotion_type as enum ('discount', 'cashback', 'free_service_fee');
create type report_reason as enum ('fraud', 'item_missing', 'harassment', 'fake_completion', 'other');
create type report_status as enum ('open', 'investigating', 'resolved', 'dismissed');
create type admin_role as enum ('superadmin', 'admin', 'support');

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  name varchar(200) not null,
  city varchar(100) not null,
  province varchar(100) not null,
  logo_url text,
  is_active boolean default false,
  total_users integer default 0,
  created_at timestamptz default now()
);

create table public.admin_users (
  id uuid primary key default gen_random_uuid(),
  name varchar(100) not null,
  email varchar(100) unique not null,
  password_hash varchar(255) not null,
  role admin_role default 'support',
  is_active boolean default true,
  last_login_at timestamptz,
  created_at timestamptz default now()
);

create table public.users (
  id uuid primary key default gen_random_uuid(),
  full_name varchar(100) not null,
  email varchar(100) unique not null,
  phone varchar(20) not null,
  password_hash varchar(255) not null,
  role user_role not null default 'requester',
  university_id uuid references public.universities(id),
  faculty varchar(100),
  student_id_number varchar(50) not null,
  ktm_photo_url text,
  profile_photo_url text,
  is_verified boolean default false,
  is_active boolean default true,
  runner_is_online boolean default false,
  rating_avg numeric(3, 2) default 0.00,
  total_orders integer default 0,
  balance numeric(12, 2) default 0.00,
  pin_hash varchar(255),
  referral_code varchar(20),
  referred_by uuid references public.users(id),
  last_active_at timestamptz,
  app_version varchar(20),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_code varchar(20) not null,
  requester_id uuid references public.users(id),
  runner_id uuid references public.users(id),
  university_id uuid references public.universities(id),
  service_type service_type,
  title varchar(200) not null,
  description text not null,
  photo_url text,
  pickup_location varchar(200) not null,
  delivery_location varchar(200) not null,
  requester_lat numeric(10, 8),
  requester_lng numeric(11, 8),
  item_price numeric(12, 2) default 0.00,
  service_fee numeric(12, 2) default 0.00,
  platform_commission numeric(12, 2) default 0.00,
  total_amount numeric(12, 2) default 0.00,
  runner_earning numeric(12, 2) default 0.00,
  promo_code varchar(50),
  discount_amount numeric(12, 2) default 0.00,
  status order_status default 'open',
  cancelled_by cancelled_by,
  cancel_reason text,
  runner_response_at timestamptz,
  completed_at timestamptz,
  expired_at timestamptz not null,
  is_rated boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  user_id uuid references public.users(id),
  transaction_code varchar(100),
  payment_method payment_method,
  payment_gateway varchar(50) not null,
  amount numeric(12, 2) not null,
  status transaction_status default 'pending',
  paid_at timestamptz,
  created_at timestamptz default now()
);

create table public.disbursements (
  id uuid primary key default gen_random_uuid(),
  runner_id uuid references public.users(id),
  amount numeric(12, 2) not null,
  bank_name varchar(100) not null,
  account_number varchar(50) not null,
  account_name varchar(100) not null,
  status disbursement_status default 'pending',
  processed_by uuid references public.admin_users(id),
  processed_at timestamptz,
  transfer_proof_url text,
  note text,
  created_at timestamptz default now()
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  reviewer_id uuid references public.users(id),
  reviewee_id uuid references public.users(id),
  rating smallint not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now()
);

create table public.chats (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  sender_id uuid references public.users(id),
  message text,
  type chat_type default 'text',
  media_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table public.order_proofs (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references public.orders(id),
  runner_id uuid references public.users(id),
  photo_url text not null,
  stage order_proof_stage not null,
  created_at timestamptz default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  type notification_type,
  title varchar(200) not null,
  body text not null,
  is_read boolean default false,
  related_id uuid,
  related_type varchar(50),
  created_at timestamptz default now()
);

create table public.device_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  token text not null,
  platform device_platform not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

create table public.user_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references public.users(id),
  latitude numeric(10, 8) not null,
  longitude numeric(11, 8) not null,
  updated_at timestamptz default now()
);

create table public.saved_locations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id),
  label varchar(100) not null,
  address varchar(200) not null,
  latitude numeric(10, 8),
  longitude numeric(11, 8),
  created_at timestamptz default now()
);

create table public.promotions (
  id uuid primary key default gen_random_uuid(),
  code varchar(50) unique not null,
  title varchar(200) not null,
  type promotion_type not null,
  value numeric(12, 2) not null,
  is_percentage boolean default false,
  min_transaction numeric(12, 2) default 0.00,
  max_usage integer,
  used_count integer default 0,
  expired_at timestamptz,
  is_active boolean default true
);

create table public.runner_stats (
  id uuid primary key default gen_random_uuid(),
  runner_id uuid unique references public.users(id),
  total_completed integer default 0,
  total_cancelled integer default 0,
  completion_rate numeric(5, 2) default 0.00,
  avg_response_time integer,
  total_earning_alltime numeric(12, 2) default 0.00,
  updated_at timestamptz default now()
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.users(id),
  reported_user_id uuid references public.users(id),
  order_id uuid references public.orders(id),
  reason report_reason,
  description text not null,
  evidence_url text,
  status report_status default 'open',
  resolution_note text,
  resolved_by uuid references public.admin_users(id),
  created_at timestamptz default now()
);

create index universities_is_active_idx on public.universities (is_active);
create index users_university_idx on public.users (university_id);
create index users_referred_by_idx on public.users (referred_by);
create index orders_requester_idx on public.orders (requester_id);
create index orders_runner_idx on public.orders (runner_id);
create index orders_university_idx on public.orders (university_id);
create index orders_status_idx on public.orders (status);
create index transactions_order_idx on public.transactions (order_id);
create index transactions_user_idx on public.transactions (user_id);
create index disbursements_runner_idx on public.disbursements (runner_id);
create index reviews_order_idx on public.reviews (order_id);
create index reviews_reviewee_idx on public.reviews (reviewee_id);
create index chats_order_idx on public.chats (order_id);
create index notifications_user_idx on public.notifications (user_id);
create index device_tokens_user_idx on public.device_tokens (user_id);
create index promotions_is_active_idx on public.promotions (is_active);
create index promotions_code_idx on public.promotions (code);
create index runner_stats_runner_idx on public.runner_stats (runner_id);
create index reports_order_idx on public.reports (order_id);
create index reports_reported_user_idx on public.reports (reported_user_id);
create index reports_status_idx on public.reports (status);

commit;

