import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { askIslamicQuestion, generateDailyContent } from "./openai";
import { insertClassSchema, insertEnrollmentSchema, insertChatMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  storage: multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'video/mp4',
      'audio/mpeg',
      'audio/mp3',
      'image/jpeg',
      'image/png',
    ];
    
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, MP4, MP3, JPG, PNG files are allowed.'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User role setup
  app.post('/api/auth/setup-role', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { role } = req.body;
      
      if (!role || !['student', 'teacher'].includes(role)) {
        return res.status(400).json({ message: "Invalid role" });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.upsertUser({
        ...user,
        role,
      });

      res.json(updatedUser);
    } catch (error) {
      console.error("Error setting up user role:", error);
      res.status(500).json({ message: "Failed to setup user role" });
    }
  });

  // Classes routes
  app.get('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let classes;
      if (user.role === 'teacher') {
        classes = await storage.getClassesByTeacher(userId);
      } else {
        classes = await storage.getClassesByStudent(userId);
      }

      res.json(classes);
    } catch (error) {
      console.error("Error fetching classes:", error);
      res.status(500).json({ message: "Failed to fetch classes" });
    }
  });

  app.get('/api/classes/available', isAuthenticated, async (req: any, res) => {
    try {
      const classes = await storage.getClasses();
      res.json(classes);
    } catch (error) {
      console.error("Error fetching available classes:", error);
      res.status(500).json({ message: "Failed to fetch available classes" });
    }
  });

  app.post('/api/classes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'teacher') {
        return res.status(403).json({ message: "Only teachers can create classes" });
      }

      const classData = insertClassSchema.parse({
        ...req.body,
        teacherId: userId,
      });

      const newClass = await storage.createClass(classData);
      res.json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.put('/api/classes/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const classId = parseInt(req.params.id);
      
      const existingClass = await storage.getClassById(classId);
      if (!existingClass) {
        return res.status(404).json({ message: "Class not found" });
      }

      if (existingClass.teacherId !== userId) {
        return res.status(403).json({ message: "You can only edit your own classes" });
      }

      const updatedClass = await storage.updateClass(classId, req.body);
      res.json(updatedClass);
    } catch (error) {
      console.error("Error updating class:", error);
      res.status(500).json({ message: "Failed to update class" });
    }
  });

  // Enrollment routes
  app.post('/api/classes/:id/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const classId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'student') {
        return res.status(403).json({ message: "Only students can enroll in classes" });
      }

      const enrollmentData = insertEnrollmentSchema.parse({
        classId,
        studentId: userId,
      });

      const enrollment = await storage.enrollStudent(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in class:", error);
      res.status(500).json({ message: "Failed to enroll in class" });
    }
  });

  app.delete('/api/classes/:id/enroll', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const classId = parseInt(req.params.id);
      
      await storage.unenrollStudent(classId, userId);
      res.json({ message: "Successfully unenrolled from class" });
    } catch (error) {
      console.error("Error unenrolling from class:", error);
      res.status(500).json({ message: "Failed to unenroll from class" });
    }
  });

  // File upload routes
  app.post('/api/files/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      const { classId } = req.body;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const fileData = {
        fileName: file.filename,
        originalName: file.originalname,
        filePath: file.path,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadedBy: userId,
        classId: classId ? parseInt(classId) : null,
      };

      const uploadedFile = await storage.uploadFile(fileData);
      res.json(uploadedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get('/api/files/:id/download', isAuthenticated, async (req: any, res) => {
    try {
      const fileId = parseInt(req.params.id);
      const file = await storage.getFileById(fileId);
      
      if (!file) {
        return res.status(404).json({ message: "File not found" });
      }

      if (!fs.existsSync(file.filePath)) {
        return res.status(404).json({ message: "File not found on disk" });
      }

      res.setHeader('Content-Disposition', `attachment; filename="${file.originalName}"`);
      res.setHeader('Content-Type', file.mimeType);
      
      const fileStream = fs.createReadStream(file.filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error("Error downloading file:", error);
      res.status(500).json({ message: "Failed to download file" });
    }
  });

  app.get('/api/files', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { classId } = req.query;
      
      let files;
      if (classId) {
        files = await storage.getFilesByClass(parseInt(classId as string));
      } else {
        files = await storage.getFilesByUploader(userId);
      }

      res.json(files);
    } catch (error) {
      console.error("Error fetching files:", error);
      res.status(500).json({ message: "Failed to fetch files" });
    }
  });

  // AI Chat routes
  app.post('/api/chat', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ message: "Message is required" });
      }

      const aiResponse = await askIslamicQuestion(message);
      
      const chatData = insertChatMessageSchema.parse({
        userId,
        message,
        response: aiResponse.answer,
      });

      const savedMessage = await storage.saveChatMessage(chatData);
      
      res.json({
        ...savedMessage,
        aiResponse,
      });
    } catch (error) {
      console.error("Error processing chat message:", error);
      res.status(500).json({ message: "Failed to process chat message" });
    }
  });

  app.get('/api/chat/history', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      
      const history = await storage.getChatHistory(userId, limit);
      res.json(history);
    } catch (error) {
      console.error("Error fetching chat history:", error);
      res.status(500).json({ message: "Failed to fetch chat history" });
    }
  });

  // Daily content routes
  app.get('/api/daily-content', async (req, res) => {
    try {
      const { language = 'en' } = req.query;
      const today = new Date();
      
      let content = await storage.getDailyContent(today, language as string);
      
      // If no content for today, generate it
      if (content.length === 0) {
        const verseContent = await generateDailyContent('verse', language as string);
        const hadithContent = await generateDailyContent('hadith', language as string);
        
        await Promise.all([
          storage.createDailyContent({
            type: 'verse',
            content: verseContent.content,
            source: verseContent.source,
            language: language as string,
          }),
          storage.createDailyContent({
            type: 'hadith',
            content: hadithContent.content,
            source: hadithContent.source,
            language: language as string,
          }),
        ]);
        
        content = await storage.getDailyContent(today, language as string);
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching daily content:", error);
      res.status(500).json({ message: "Failed to fetch daily content" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
