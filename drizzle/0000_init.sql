CREATE TYPE "public"."booking_source" AS ENUM('direct', 'manual', 'airbnb', 'booking_com');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('pending', 'confirmed', 'cancelled', 'expired');--> statement-breakpoint
CREATE TYPE "public"."ical_direction" AS ENUM('import', 'export');--> statement-breakpoint
CREATE TYPE "public"."locale" AS ENUM('nl', 'en', 'pap');--> statement-breakpoint
CREATE TYPE "public"."payment_kind" AS ENUM('deposit', 'balance', 'full', 'refund');--> statement-breakpoint
CREATE TYPE "public"."payment_plan" AS ENUM('deposit', 'full');--> statement-breakpoint
CREATE TYPE "public"."payment_provider" AS ENUM('mollie', 'stripe', 'manual');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('open', 'pending', 'paid', 'failed', 'expired', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor" text NOT NULL,
	"action" text NOT NULL,
	"entity" text NOT NULL,
	"entity_id" uuid,
	"before" jsonb,
	"after" jsonb,
	"ip" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "blocked_dates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"during" daterange GENERATED ALWAYS AS (daterange(start_date, end_date, '[)')) STORED,
	"source" text DEFAULT 'owner' NOT NULL,
	"external_uid" text,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blocked_dates_range_ordered" CHECK ("blocked_dates"."end_date" > "blocked_dates"."start_date")
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" varchar(24) NOT NULL,
	"property_id" uuid NOT NULL,
	"guest_id" uuid NOT NULL,
	"status" "booking_status" DEFAULT 'pending' NOT NULL,
	"source" "booking_source" DEFAULT 'direct' NOT NULL,
	"arrival_date" date NOT NULL,
	"departure_date" date NOT NULL,
	"stay" daterange GENERATED ALWAYS AS (daterange(arrival_date, departure_date, '[)')) STORED,
	"nights" integer NOT NULL,
	"guests" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"accommodation_cents" integer NOT NULL,
	"cleaning_fee_cents" integer NOT NULL,
	"tax_cents" integer NOT NULL,
	"tax_rate_bps" integer NOT NULL,
	"total_cents" integer NOT NULL,
	"deposit_cents" integer NOT NULL,
	"balance_cents" integer NOT NULL,
	"balance_due_date" date,
	"payment_plan" "payment_plan" NOT NULL,
	"breakdown" jsonb NOT NULL,
	"locale" "locale" DEFAULT 'nl' NOT NULL,
	"guest_message" text,
	"internal_notes" text,
	"hold_expires_at" timestamp with time zone,
	"confirmed_at" timestamp with time zone,
	"cancelled_at" timestamp with time zone,
	"cancellation_reason" text,
	"confirmation_email_sent_at" timestamp with time zone,
	"balance_reminder_sent_at" timestamp with time zone,
	"arrival_email_sent_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_range_ordered" CHECK ("bookings"."departure_date" > "bookings"."arrival_date"),
	CONSTRAINT "bookings_nights_match_range" CHECK ("bookings"."nights" = "bookings"."departure_date" - "bookings"."arrival_date"),
	CONSTRAINT "bookings_guests_positive" CHECK ("bookings"."guests" > 0),
	CONSTRAINT "bookings_amounts_non_negative" CHECK (
      "bookings"."accommodation_cents" >= 0 and "bookings"."cleaning_fee_cents" >= 0
      and "bookings"."tax_cents" >= 0 and "bookings"."total_cents" >= 0
      and "bookings"."deposit_cents" >= 0 and "bookings"."balance_cents" >= 0
    ),
	CONSTRAINT "bookings_total_adds_up" CHECK ("bookings"."total_cents" = "bookings"."accommodation_cents" + "bookings"."cleaning_fee_cents" + "bookings"."tax_cents"),
	CONSTRAINT "bookings_deposit_adds_up" CHECK ("bookings"."total_cents" = "bookings"."deposit_cents" + "bookings"."balance_cents")
);
--> statement-breakpoint
CREATE TABLE "guests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"phone" text,
	"country" varchar(2),
	"address_line" text,
	"postal_code" text,
	"city" text,
	"locale" "locale" DEFAULT 'nl' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "guests_email_shape" CHECK (position('@' in "guests"."email") > 1)
);
--> statement-breakpoint
CREATE TABLE "ical_feeds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"label" text NOT NULL,
	"direction" "ical_direction" DEFAULT 'import' NOT NULL,
	"url" text,
	"active" boolean DEFAULT true NOT NULL,
	"last_sync_at" timestamp with time zone,
	"last_sync_status" text,
	"last_sync_error" text,
	"imported_count" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "ical_feeds_import_needs_url" CHECK ("ical_feeds"."direction" <> 'import' or "ical_feeds"."url" is not null)
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"provider" "payment_provider" NOT NULL,
	"provider_payment_id" text,
	"kind" "payment_kind" NOT NULL,
	"status" "payment_status" DEFAULT 'open' NOT NULL,
	"amount_cents" integer NOT NULL,
	"currency" varchar(3) NOT NULL,
	"method" text,
	"description" text,
	"checkout_url" text,
	"paid_at" timestamp with time zone,
	"failed_at" timestamp with time zone,
	"refunded_cents" integer DEFAULT 0 NOT NULL,
	"provider_payload" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_amount_positive" CHECK ("payments"."amount_cents" > 0),
	CONSTRAINT "payments_refund_within_amount" CHECK ("payments"."refunded_cents" between 0 and "payments"."amount_cents")
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" varchar(64) NOT NULL,
	"name" text NOT NULL,
	"timezone" text DEFAULT 'America/Curacao' NOT NULL,
	"currency" varchar(3) DEFAULT 'USD' NOT NULL,
	"max_guests" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"cleaning_fee_cents" integer DEFAULT 0 NOT NULL,
	"tax_rate_bps" integer DEFAULT 700 NOT NULL,
	"tax_on_cleaning_fee" boolean DEFAULT true NOT NULL,
	"deposit_bps" integer DEFAULT 3000 NOT NULL,
	"balance_due_days" integer DEFAULT 35 NOT NULL,
	"pay_in_full_within_days" integer DEFAULT 35 NOT NULL,
	"hold_minutes" integer DEFAULT 30 NOT NULL,
	"min_nights_floor" integer DEFAULT 1 NOT NULL,
	"max_nights" integer DEFAULT 90 NOT NULL,
	"min_advance_days" integer DEFAULT 0 NOT NULL,
	"max_advance_days" integer DEFAULT 540 NOT NULL,
	"check_in_time" varchar(5) DEFAULT '15:00' NOT NULL,
	"check_out_time" varchar(5) DEFAULT '11:00' NOT NULL,
	"address_line" text NOT NULL,
	"city" text NOT NULL,
	"country" varchar(2) DEFAULT 'CW' NOT NULL,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "properties_max_guests_positive" CHECK ("properties"."max_guests" > 0),
	CONSTRAINT "properties_cleaning_fee_non_negative" CHECK ("properties"."cleaning_fee_cents" >= 0),
	CONSTRAINT "properties_tax_rate_sane" CHECK ("properties"."tax_rate_bps" between 0 and 10000),
	CONSTRAINT "properties_deposit_sane" CHECK ("properties"."deposit_bps" between 0 and 10000),
	CONSTRAINT "properties_nights_sane" CHECK ("properties"."max_nights" >= "properties"."min_nights_floor")
);
--> statement-breakpoint
CREATE TABLE "seasons" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_id" uuid NOT NULL,
	"label" text NOT NULL,
	"start_date" date NOT NULL,
	"end_date" date NOT NULL,
	"nightly_price_cents" integer NOT NULL,
	"min_nights" integer DEFAULT 1 NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "seasons_range_ordered" CHECK ("seasons"."end_date" >= "seasons"."start_date"),
	CONSTRAINT "seasons_price_positive" CHECK ("seasons"."nightly_price_cents" > 0),
	CONSTRAINT "seasons_min_nights_positive" CHECK ("seasons"."min_nights" >= 1)
);
--> statement-breakpoint
ALTER TABLE "blocked_dates" ADD CONSTRAINT "blocked_dates_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_guest_id_guests_id_fk" FOREIGN KEY ("guest_id") REFERENCES "public"."guests"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ical_feeds" ADD CONSTRAINT "ical_feeds_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "seasons" ADD CONSTRAINT "seasons_property_id_properties_id_fk" FOREIGN KEY ("property_id") REFERENCES "public"."properties"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "audit_log_entity_idx" ON "audit_log" USING btree ("entity","entity_id");--> statement-breakpoint
CREATE INDEX "audit_log_created_at_idx" ON "audit_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "blocked_dates_property_idx" ON "blocked_dates" USING btree ("property_id","start_date");--> statement-breakpoint
CREATE UNIQUE INDEX "blocked_dates_source_uid_key" ON "blocked_dates" USING btree ("property_id","source","external_uid") WHERE external_uid is not null;--> statement-breakpoint
CREATE UNIQUE INDEX "bookings_reference_key" ON "bookings" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "bookings_property_arrival_idx" ON "bookings" USING btree ("property_id","arrival_date");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "guests_email_key" ON "guests" USING btree (lower("email"));--> statement-breakpoint
CREATE UNIQUE INDEX "ical_feeds_property_label_key" ON "ical_feeds" USING btree ("property_id","label");--> statement-breakpoint
CREATE UNIQUE INDEX "payments_provider_payment_id_key" ON "payments" USING btree ("provider","provider_payment_id") WHERE provider_payment_id is not null;--> statement-breakpoint
CREATE INDEX "payments_booking_idx" ON "payments" USING btree ("booking_id");--> statement-breakpoint
CREATE UNIQUE INDEX "properties_slug_key" ON "properties" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "seasons_property_dates_idx" ON "seasons" USING btree ("property_id","start_date","end_date");