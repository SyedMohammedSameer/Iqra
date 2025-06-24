-- Initial migration for Iqra Islamic Learning Platform

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE "users" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "email" VARCHAR UNIQUE NOT NULL,
  "password" VARCHAR,
  "first_name" VARCHAR,
  "last_name" VARCHAR,
  "profile_image_url" VARCHAR,
  "role" VARCHAR DEFAULT 'student' CHECK (role IN ('student', 'teacher')),
  "google_id" VARCHAR,
  "facebook_id" VARCHAR,
  "bio" TEXT,
  "phone_number" VARCHAR,
  "date_of_birth" TIMESTAMP,
  "country" VARCHAR,
  "timezone" VARCHAR,
  "language" VARCHAR DEFAULT 'en',
  "email_notifications" BOOLEAN DEFAULT true,
  "is_active" BOOLEAN DEFAULT true,
  "is_verified" BOOLEAN DEFAULT false,
  "last_login_at" TIMESTAMP,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE "classes" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR NOT NULL,
  "description" TEXT,
  "teacher_id" UUID NOT NULL REFERENCES "users"("id"),
  "schedule" TEXT,
  "start_date" TIMESTAMP,
  "end_date" TIMESTAMP,
  "duration" INTEGER,
  "meeting_link" TEXT,
  "meeting_id" VARCHAR,
  "meeting_password" VARCHAR,
  "category" VARCHAR,
  "level" VARCHAR CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  "tags" JSONB,
  "max_students" INTEGER,
  "price" INTEGER,
  "currency" VARCHAR DEFAULT 'USD',
  "is_active" BOOLEAN DEFAULT true,
  "is_public" BOOLEAN DEFAULT true,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Class enrollments table
CREATE TABLE "class_enrollments" (
  "id" SERIAL PRIMARY KEY,
  "class_id" INTEGER NOT NULL REFERENCES "classes"("id"),
  "student_id" UUID NOT NULL REFERENCES "users"("id"),
  "enrolled_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "status" VARCHAR DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'suspended')),
  "progress_percentage" INTEGER DEFAULT 0,
  "last_accessed_at" TIMESTAMP,
  "amount_paid" INTEGER,
  "payment_status" VARCHAR CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  UNIQUE("class_id", "student_id")
);

-- Files table
CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "file_name" VARCHAR NOT NULL,
  "original_name" VARCHAR NOT NULL,
  "file_path" TEXT NOT NULL,
  "file_size" INTEGER NOT NULL,
  "mime_type" VARCHAR NOT NULL,
  "uploaded_by" UUID NOT NULL REFERENCES "users"("id"),
  "class_id" INTEGER REFERENCES "classes"("id"),
  "description" TEXT,
  "tags" JSONB,
  "category" VARCHAR,
  "is_public" BOOLEAN DEFAULT false,
  "download_count" INTEGER DEFAULT 0,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat messages table
CREATE TABLE "chat_messages" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "message" TEXT NOT NULL,
  "response" TEXT,
  "ai_model" VARCHAR,
  "response_time" INTEGER,
  "is_helpful" BOOLEAN,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily content table
CREATE TABLE "daily_content" (
  "id" SERIAL PRIMARY KEY,
  "type" VARCHAR NOT NULL CHECK (type IN ('verse', 'hadith')),
  "content" TEXT NOT NULL,
  "source" TEXT NOT NULL,
  "arabic_text" TEXT,
  "transliteration" TEXT,
  "translation" TEXT,
  "date" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "language" VARCHAR DEFAULT 'en',
  "view_count" INTEGER DEFAULT 0,
  "share_count" INTEGER DEFAULT 0
);

-- Notifications table
CREATE TABLE "notifications" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "title" VARCHAR NOT NULL,
  "message" TEXT NOT NULL,
  "type" VARCHAR NOT NULL CHECK (type IN ('class_reminder', 'assignment', 'achievement', 'system')),
  "data" JSONB,
  "action_url" VARCHAR,
  "is_read" BOOLEAN DEFAULT false,
  "is_archived" BOOLEAN DEFAULT false,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User progress table
CREATE TABLE "user_progress" (
  "id" SERIAL PRIMARY KEY,
  "user_id" UUID NOT NULL REFERENCES "users"("id"),
  "class_id" INTEGER NOT NULL REFERENCES "classes"("id"),
  "completed_lessons" INTEGER DEFAULT 0,
  "total_lessons" INTEGER,
  "progress_percentage" INTEGER DEFAULT 0,
  "time_spent" INTEGER DEFAULT 0,
  "last_activity_at" TIMESTAMP,
  "achievements" JSONB,
  "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE("user_id", "class_id")
);

-- Create indexes for better performance
CREATE INDEX "idx_users_email" ON "users"("email");
CREATE INDEX "idx_users_google_id" ON "users"("google_id");
CREATE INDEX "idx_classes_teacher" ON "classes"("teacher_id");
CREATE INDEX "idx_classes_category" ON "classes"("category");
CREATE INDEX "idx_enrollments_class" ON "class_enrollments"("class_id");
CREATE INDEX "idx_enrollments_student" ON "class_enrollments"("student_id");
CREATE INDEX "idx_files_uploader" ON "files"("uploaded_by");
CREATE INDEX "idx_files_class" ON "files"("class_id");
CREATE INDEX "idx_chat_user" ON "chat_messages"("user_id");
CREATE INDEX "idx_daily_content_date" ON "daily_content"("date");
CREATE INDEX "idx_daily_content_language" ON "daily_content"("language");
CREATE INDEX "idx_notifications_user" ON "notifications"("user_id");
CREATE INDEX "idx_notifications_read" ON "notifications"("is_read");
CREATE INDEX "idx_progress_user" ON "user_progress"("user_id");
CREATE INDEX "idx_progress_class" ON "user_progress"("class_id");

-- Create triggers for updating updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON "users" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_classes_updated_at BEFORE UPDATE ON "classes" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON "user_progress" FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();