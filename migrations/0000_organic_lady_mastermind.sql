CREATE TABLE "chat_messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"message" text NOT NULL,
	"response" text,
	"ai_model" varchar,
	"response_time" integer,
	"is_helpful" boolean,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "class_enrollments" (
	"id" serial PRIMARY KEY NOT NULL,
	"class_id" integer NOT NULL,
	"student_id" uuid NOT NULL,
	"enrolled_at" timestamp DEFAULT now(),
	"status" varchar DEFAULT 'enrolled',
	"progress_percentage" integer DEFAULT 0,
	"last_accessed_at" timestamp,
	"amount_paid" integer,
	"payment_status" varchar
);
--> statement-breakpoint
CREATE TABLE "classes" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar NOT NULL,
	"description" text,
	"teacher_id" uuid NOT NULL,
	"schedule" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"duration" integer,
	"meeting_link" text,
	"meeting_id" varchar,
	"meeting_password" varchar,
	"category" varchar,
	"level" varchar,
	"tags" jsonb,
	"max_students" integer,
	"price" integer,
	"currency" varchar DEFAULT 'USD',
	"is_active" boolean DEFAULT true,
	"is_public" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "daily_content" (
	"id" serial PRIMARY KEY NOT NULL,
	"type" varchar NOT NULL,
	"content" text NOT NULL,
	"source" text NOT NULL,
	"arabic_text" text,
	"transliteration" text,
	"translation" text,
	"date" timestamp DEFAULT now(),
	"language" varchar DEFAULT 'en',
	"view_count" integer DEFAULT 0,
	"share_count" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar NOT NULL,
	"original_name" varchar NOT NULL,
	"file_path" text NOT NULL,
	"file_size" integer NOT NULL,
	"mime_type" varchar NOT NULL,
	"uploaded_by" uuid NOT NULL,
	"class_id" integer,
	"description" text,
	"tags" jsonb,
	"category" varchar,
	"is_public" boolean DEFAULT false,
	"download_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"title" varchar NOT NULL,
	"message" text NOT NULL,
	"type" varchar NOT NULL,
	"data" jsonb,
	"action_url" varchar,
	"is_read" boolean DEFAULT false,
	"is_archived" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_progress" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"class_id" integer NOT NULL,
	"completed_lessons" integer DEFAULT 0,
	"total_lessons" integer,
	"progress_percentage" integer DEFAULT 0,
	"time_spent" integer DEFAULT 0,
	"last_activity_at" timestamp,
	"achievements" jsonb,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"role" varchar DEFAULT 'student' NOT NULL,
	"google_id" varchar,
	"facebook_id" varchar,
	"bio" text,
	"phone_number" varchar,
	"date_of_birth" timestamp,
	"country" varchar,
	"timezone" varchar,
	"language" varchar DEFAULT 'en',
	"email_notifications" boolean DEFAULT true,
	"is_active" boolean DEFAULT true,
	"is_verified" boolean DEFAULT false,
	"last_login_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "idx_chat_user" ON "chat_messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_enrollments_class" ON "class_enrollments" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_enrollments_student" ON "class_enrollments" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "idx_classes_teacher" ON "classes" USING btree ("teacher_id");--> statement-breakpoint
CREATE INDEX "idx_classes_category" ON "classes" USING btree ("category");--> statement-breakpoint
CREATE INDEX "idx_daily_content_date" ON "daily_content" USING btree ("date");--> statement-breakpoint
CREATE INDEX "idx_daily_content_language" ON "daily_content" USING btree ("language");--> statement-breakpoint
CREATE INDEX "idx_files_uploader" ON "files" USING btree ("uploaded_by");--> statement-breakpoint
CREATE INDEX "idx_files_class" ON "files" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_user" ON "notifications" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_notifications_read" ON "notifications" USING btree ("is_read");--> statement-breakpoint
CREATE INDEX "idx_progress_user" ON "user_progress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_progress_class" ON "user_progress" USING btree ("class_id");--> statement-breakpoint
CREATE INDEX "idx_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "idx_users_google_id" ON "users" USING btree ("google_id");