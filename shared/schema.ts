import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  boolean,
  integer,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with custom auth support
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique().notNull(),
  password: varchar("password"), // For email/password auth
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role", { enum: ["student", "teacher"] }).notNull().default("student"),
  
  // OAuth fields
  googleId: varchar("google_id"),
  facebookId: varchar("facebook_id"),
  
  // Profile fields
  bio: text("bio"),
  phoneNumber: varchar("phone_number"),
  dateOfBirth: timestamp("date_of_birth"),
  country: varchar("country"),
  timezone: varchar("timezone"),
  
  // Preferences
  language: varchar("language").default("en"),
  emailNotifications: boolean("email_notifications").default(true),
  
  // Status
  isActive: boolean("is_active").default(true),
  isVerified: boolean("is_verified").default(false),
  lastLoginAt: timestamp("last_login_at"),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_users_email").on(table.email),
  index("idx_users_google_id").on(table.googleId),
]);

export const classes = pgTable("classes", {
  id: serial("id").primaryKey(),
  title: varchar("title").notNull(),
  description: text("description"),
  teacherId: uuid("teacher_id").notNull(),
  
  // Scheduling
  schedule: text("schedule"), // JSON string for recurring schedule
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  duration: integer("duration"), // in minutes
  
  // Meeting details
  meetingLink: text("meeting_link"),
  meetingId: varchar("meeting_id"),
  meetingPassword: varchar("meeting_password"),
  
  // Course details
  category: varchar("category"),
  level: varchar("level", { enum: ["beginner", "intermediate", "advanced"] }),
  tags: jsonb("tags"), // Array of tags
  maxStudents: integer("max_students"),
  
  // Pricing
  price: integer("price"), // in cents
  currency: varchar("currency").default("USD"),
  
  // Status
  isActive: boolean("is_active").default(true),
  isPublic: boolean("is_public").default(true),
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_classes_teacher").on(table.teacherId),
  index("idx_classes_category").on(table.category),
]);

export const classEnrollments = pgTable("class_enrollments", {
  id: serial("id").primaryKey(),
  classId: integer("class_id").notNull(),
  studentId: uuid("student_id").notNull(),
  
  // Enrollment details
  enrolledAt: timestamp("enrolled_at").defaultNow(),
  status: varchar("status", { 
    enum: ["enrolled", "completed", "dropped", "suspended"] 
  }).default("enrolled"),
  
  // Progress tracking
  progressPercentage: integer("progress_percentage").default(0),
  lastAccessedAt: timestamp("last_accessed_at"),
  
  // Payment details
  amountPaid: integer("amount_paid"), // in cents
  paymentStatus: varchar("payment_status", {
    enum: ["pending", "paid", "failed", "refunded"]
  }),
  
}, (table) => [
  index("idx_enrollments_class").on(table.classId),
  index("idx_enrollments_student").on(table.studentId),
]);

export const files = pgTable("files", {
  id: serial("id").primaryKey(),
  fileName: varchar("file_name").notNull(),
  originalName: varchar("original_name").notNull(),
  filePath: text("file_path").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: varchar("mime_type").notNull(),
  
  // Upload details
  uploadedBy: uuid("uploaded_by").notNull(),
  classId: integer("class_id"),
  
  // File metadata
  description: text("description"),
  tags: jsonb("tags"),
  category: varchar("category"),
  
  // Access control
  isPublic: boolean("is_public").default(false),
  downloadCount: integer("download_count").default(0),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_files_uploader").on(table.uploadedBy),
  index("idx_files_class").on(table.classId),
]);

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  message: text("message").notNull(),
  response: text("response"),
  
  // AI interaction metadata
  aiModel: varchar("ai_model"),
  responseTime: integer("response_time"), // in milliseconds
  isHelpful: boolean("is_helpful"),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_chat_user").on(table.userId),
]);

export const dailyContent = pgTable("daily_content", {
  id: serial("id").primaryKey(),
  type: varchar("type", { enum: ["verse", "hadith"] }).notNull(),
  content: text("content").notNull(),
  source: text("source").notNull(),
  
  // Content metadata
  arabicText: text("arabic_text"),
  transliteration: text("transliteration"),
  translation: text("translation"),
  
  date: timestamp("date").defaultNow(),
  language: varchar("language").default("en"),
  
  // Engagement metrics
  viewCount: integer("view_count").default(0),
  shareCount: integer("share_count").default(0),
  
}, (table) => [
  index("idx_daily_content_date").on(table.date),
  index("idx_daily_content_language").on(table.language),
]);

// New tables for enhanced functionality

export const notifications = pgTable("notifications", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  title: varchar("title").notNull(),
  message: text("message").notNull(),
  type: varchar("type", {
    enum: ["class_reminder", "assignment", "achievement", "system"]
  }).notNull(),
  
  // Notification metadata
  data: jsonb("data"), // Additional data
  actionUrl: varchar("action_url"),
  
  // Status
  isRead: boolean("is_read").default(false),
  isArchived: boolean("is_archived").default(false),
  
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => [
  index("idx_notifications_user").on(table.userId),
  index("idx_notifications_read").on(table.isRead),
]);

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: uuid("user_id").notNull(),
  classId: integer("class_id").notNull(),
  
  // Progress tracking
  completedLessons: integer("completed_lessons").default(0),
  totalLessons: integer("total_lessons"),
  progressPercentage: integer("progress_percentage").default(0),
  
  // Time tracking
  timeSpent: integer("time_spent").default(0), // in minutes
  lastActivityAt: timestamp("last_activity_at"),
  
  // Achievement tracking
  achievements: jsonb("achievements"), // Array of achievement IDs
  
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
  index("idx_progress_user").on(table.userId),
  index("idx_progress_class").on(table.classId),
]);

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  classes: many(classes),
  enrollments: many(classEnrollments),
  files: many(files),
  chatMessages: many(chatMessages),
  notifications: many(notifications),
  progress: many(userProgress),
}));

export const classesRelations = relations(classes, ({ one, many }) => ({
  teacher: one(users, {
    fields: [classes.teacherId],
    references: [users.id],
  }),
  enrollments: many(classEnrollments),
  files: many(files),
  progress: many(userProgress),
}));

export const classEnrollmentsRelations = relations(classEnrollments, ({ one }) => ({
  class: one(classes, {
    fields: [classEnrollments.classId],
    references: [classes.id],
  }),
  student: one(users, {
    fields: [classEnrollments.studentId],
    references: [users.id],
  }),
}));

export const filesRelations = relations(files, ({ one }) => ({
  uploader: one(users, {
    fields: [files.uploadedBy],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [files.classId],
    references: [classes.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, {
    fields: [chatMessages.userId],
    references: [users.id],
  }),
}));

export const notificationsRelations = relations(notifications, ({ one }) => ({
  user: one(users, {
    fields: [notifications.userId],
    references: [users.id],
  }),
}));

export const userProgressRelations = relations(userProgress, ({ one }) => ({
  user: one(users, {
    fields: [userProgress.userId],
    references: [users.id],
  }),
  class: one(classes, {
    fields: [userProgress.classId],
    references: [classes.id],
  }),
}));

// Import sql for UUID generation
import { sql } from "drizzle-orm";

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export const insertClassSchema = createInsertSchema(classes).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEnrollmentSchema = createInsertSchema(classEnrollments).omit({
  id: true,
  enrolledAt: true,
});

export const insertFileSchema = createInsertSchema(files).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertDailyContentSchema = createInsertSchema(dailyContent).omit({
  id: true,
  date: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;

export type Class = typeof classes.$inferSelect;
export type InsertClass = z.infer<typeof insertClassSchema>;

export type ClassEnrollment = typeof classEnrollments.$inferSelect;
export type InsertEnrollment = z.infer<typeof insertEnrollmentSchema>;

export type File = typeof files.$inferSelect;
export type InsertFile = z.infer<typeof insertFileSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type DailyContent = typeof dailyContent.$inferSelect;
export type InsertDailyContent = z.infer<typeof insertDailyContentSchema>;

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = z.infer<typeof insertNotificationSchema>;

export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;