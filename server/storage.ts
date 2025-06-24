import {
  users,
  classes,
  classEnrollments,
  files,
  chatMessages,
  dailyContent,
  type User,
  type UpsertUser,
  type InsertUser,
  type Class,
  type InsertClass,
  type ClassEnrollment,
  type InsertEnrollment,
  type File,
  type InsertFile,
  type ChatMessage,
  type InsertChatMessage,
  type DailyContent,
  type InsertDailyContent,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User>;
  
  // Class operations
  getClasses(): Promise<Class[]>;
  getClassById(id: number): Promise<Class | undefined>;
  getClassesByTeacher(teacherId: string): Promise<Class[]>;
  getClassesByStudent(studentId: string): Promise<Class[]>;
  createClass(classData: InsertClass): Promise<Class>;
  updateClass(id: number, classData: Partial<InsertClass>): Promise<Class>;
  deleteClass(id: number): Promise<void>;
  
  // Enrollment operations
  enrollStudent(enrollment: InsertEnrollment): Promise<ClassEnrollment>;
  unenrollStudent(classId: number, studentId: string): Promise<void>;
  getEnrollmentsByClass(classId: number): Promise<ClassEnrollment[]>;
  getEnrollmentsByStudent(studentId: string): Promise<ClassEnrollment[]>;
  
  // File operations
  uploadFile(fileData: InsertFile): Promise<File>;
  getFileById(id: number): Promise<File | undefined>;
  getFilesByClass(classId: number): Promise<File[]>;
  getFilesByUploader(uploaderId: string): Promise<File[]>;
  deleteFile(id: number): Promise<void>;
  
  // Chat operations
  saveChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  getChatHistory(userId: string, limit?: number): Promise<ChatMessage[]>;
  
  // Daily content operations
  getDailyContent(date?: Date, language?: string): Promise<DailyContent[]>;
  createDailyContent(content: InsertDailyContent): Promise<DailyContent>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(userData: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(userData).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  // Class operations
  async getClasses(): Promise<Class[]> {
    return await db.select().from(classes).where(eq(classes.isActive, true));
  }

  async getClassById(id: number): Promise<Class | undefined> {
    const [classItem] = await db.select().from(classes).where(eq(classes.id, id));
    return classItem;
  }

  async getClassesByTeacher(teacherId: string): Promise<Class[]> {
    return await db
      .select()
      .from(classes)
      .where(and(eq(classes.teacherId, teacherId), eq(classes.isActive, true)));
  }

  async getClassesByStudent(studentId: string): Promise<Class[]> {
    return await db
      .select({
        id: classes.id,
        title: classes.title,
        description: classes.description,
        teacherId: classes.teacherId,
        schedule: classes.schedule,
        meetingLink: classes.meetingLink,
        isActive: classes.isActive,
        createdAt: classes.createdAt,
        updatedAt: classes.updatedAt,
      })
      .from(classes)
      .innerJoin(classEnrollments, eq(classes.id, classEnrollments.classId))
      .where(and(
        eq(classEnrollments.studentId, studentId),
        eq(classes.isActive, true)
      ));
  }

  async createClass(classData: InsertClass): Promise<Class> {
    const [newClass] = await db.insert(classes).values(classData).returning();
    return newClass;
  }

  async updateClass(id: number, classData: Partial<InsertClass>): Promise<Class> {
    const [updatedClass] = await db
      .update(classes)
      .set({ ...classData, updatedAt: new Date() })
      .where(eq(classes.id, id))
      .returning();
    return updatedClass;
  }

  async deleteClass(id: number): Promise<void> {
    await db.update(classes).set({ isActive: false }).where(eq(classes.id, id));
  }

  // Enrollment operations
  async enrollStudent(enrollment: InsertEnrollment): Promise<ClassEnrollment> {
    const [newEnrollment] = await db
      .insert(classEnrollments)
      .values(enrollment)
      .returning();
    return newEnrollment;
  }

  async unenrollStudent(classId: number, studentId: string): Promise<void> {
    await db
      .delete(classEnrollments)
      .where(and(
        eq(classEnrollments.classId, classId),
        eq(classEnrollments.studentId, studentId)
      ));
  }

  async getEnrollmentsByClass(classId: number): Promise<ClassEnrollment[]> {
    return await db
      .select()
      .from(classEnrollments)
      .where(eq(classEnrollments.classId, classId));
  }

  async getEnrollmentsByStudent(studentId: string): Promise<ClassEnrollment[]> {
    return await db
      .select()
      .from(classEnrollments)
      .where(eq(classEnrollments.studentId, studentId));
  }

  // File operations
  async uploadFile(fileData: InsertFile): Promise<File> {
    const [newFile] = await db.insert(files).values(fileData).returning();
    return newFile;
  }

  async getFileById(id: number): Promise<File | undefined> {
    const [file] = await db.select().from(files).where(eq(files.id, id));
    return file;
  }

  async getFilesByClass(classId: number): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.classId, classId))
      .orderBy(desc(files.createdAt));
  }

  async getFilesByUploader(uploaderId: string): Promise<File[]> {
    return await db
      .select()
      .from(files)
      .where(eq(files.uploadedBy, uploaderId))
      .orderBy(desc(files.createdAt));
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }

  // Chat operations
  async saveChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [newMessage] = await db.insert(chatMessages).values(message).returning();
    return newMessage;
  }

  async getChatHistory(userId: string, limit: number = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.createdAt))
      .limit(limit);
  }

  // Daily content operations
  async getDailyContent(date?: Date, language: string = "en"): Promise<DailyContent[]> {
    const targetDate = date || new Date();
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    return await db
      .select()
      .from(dailyContent)
      .where(and(
        sql`${dailyContent.date} >= ${startOfDay}`,
        sql`${dailyContent.date} <= ${endOfDay}`,
        eq(dailyContent.language, language)
      ));
  }

  async createDailyContent(content: InsertDailyContent): Promise<DailyContent> {
    const [newContent] = await db.insert(dailyContent).values(content).returning();
    return newContent;
  }
}

export const storage = new DatabaseStorage();