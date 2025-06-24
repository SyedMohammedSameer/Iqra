import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { authRoutes, authenticate } from "./auth";
import { askIslamicQuestion, generateDailyContent } from "./openai";
import { insertClassSchema, insertEnrollmentSchema, insertChatMessageSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";
import cookieParser from "cookie-parser";
import cors from "cors";

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
  // Middleware
  app.use(cors({
    origin: process.env.FRONTEND_URL || process.env.NODE_ENV === 'development' 
      ? ['http://localhost:3000', 'http://localhost:5173'] 
      : true,
    credentials: true,
  }));
  app.use(cookieParser());

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      app: 'Iqra Islamic Learning Platform',
      version: '1.0.0'
    });
  });

  // Auth routes
  app.post('/api/auth/register', authRoutes.register);
  app.post('/api/auth/login', authRoutes.login);
  app.get('/api/auth/user', authenticate, authRoutes.me);
  app.post('/api/auth/logout', authRoutes.logout);
  app.post('/api/auth/refresh', authenticate, authRoutes.refresh);

  // Google OAuth routes (if implemented)
  app.post('/api/auth/google', authRoutes.googleCallback);

  // User routes
  app.get('/api/users/profile', authenticate, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Remove sensitive data
      const { password, ...userProfile } = user;
      res.json(userProfile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      res.status(500).json({ message: "Failed to fetch user profile" });
    }
  });

  app.put('/api/users/profile', authenticate, async (req: any, res) => {
    try {
      const { firstName, lastName, bio, phoneNumber, country, language } = req.body;
      const updatedUser = await storage.updateUser(req.user.id, {
        firstName,
        lastName,
        bio,
        phoneNumber,
        country,
        language,
      });
      
      // Remove sensitive data
      const { password, ...userProfile } = updatedUser;
      res.json(userProfile);
    } catch (error) {
      console.error("Error updating user profile:", error);
      res.status(500).json({ message: "Failed to update user profile" });
    }
  });

  // Classes routes
  app.get('/api/classes', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
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

  app.get('/api/classes/available', authenticate, async (req: any, res) => {
    try {
      const classes = await storage.getClasses();
      res.json(classes);
    } catch (error) {
      console.error("Error fetching available classes:", error);
      res.status(500).json({ message: "Failed to fetch available classes" });
    }
  });

  app.post('/api/classes', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
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
      if (error.name === 'ZodError') {
        return res.status(400).json({ message: "Invalid class data", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to create class" });
    }
  });

  app.put('/api/classes/:id', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const classId = parseInt(req.params.id);
      
      if (isNaN(classId)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
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
  app.post('/api/classes/:id/enroll', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const classId = parseInt(req.params.id);
      
      if (isNaN(classId)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
      const user = await storage.getUser(userId);
      
      if (!user || user.role !== 'student') {
        return res.status(403).json({ message: "Only students can enroll in classes" });
      }

      // Check if class exists
      const classExists = await storage.getClassById(classId);
      if (!classExists) {
        return res.status(404).json({ message: "Class not found" });
      }

      const enrollmentData = insertEnrollmentSchema.parse({
        classId,
        studentId: userId,
      });

      const enrollment = await storage.enrollStudent(enrollmentData);
      res.json(enrollment);
    } catch (error) {
      console.error("Error enrolling in class:", error);
      if (error.message?.includes('duplicate') || error.code === '23505') {
        return res.status(409).json({ message: "Already enrolled in this class" });
      }
      res.status(500).json({ message: "Failed to enroll in class" });
    }
  });

  app.delete('/api/classes/:id/enroll', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const classId = parseInt(req.params.id);
      
      if (isNaN(classId)) {
        return res.status(400).json({ message: "Invalid class ID" });
      }
      
      await storage.unenrollStudent(classId, userId);
      res.json({ message: "Successfully unenrolled from class" });
    } catch (error) {
      console.error("Error unenrolling from class:", error);
      res.status(500).json({ message: "Failed to unenroll from class" });
    }
  });

  // File upload routes
  app.post('/api/files/upload', authenticate, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.id;
      const file = req.file;
      const { classId, description, category } = req.body;
      
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
        description,
        category,
      };

      const uploadedFile = await storage.uploadFile(fileData);
      res.json(uploadedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  app.get('/api/files/:id/download', authenticate, async (req: any, res) => {
    try {
      const fileId = parseInt(req.params.id);
      
      if (isNaN(fileId)) {
        return res.status(400).json({ message: "Invalid file ID" });
      }
      
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

  app.get('/api/files', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { classId } = req.query;
      
      let files;
      if (classId) {
        const classIdNum = parseInt(classId as string);
        if (isNaN(classIdNum)) {
          return res.status(400).json({ message: "Invalid class ID" });
        }
        files = await storage.getFilesByClass(classIdNum);
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
  app.post('/api/chat', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { message } = req.body;
      
      if (!message || typeof message !== 'string' || message.trim().length === 0) {
        return res.status(400).json({ message: "Message is required" });
      }

      if (message.length > 1000) {
        return res.status(400).json({ message: "Message too long (max 1000 characters)" });
      }

      const aiResponse = await askIslamicQuestion(message.trim());
      
      const chatData = insertChatMessageSchema.parse({
        userId,
        message: message.trim(),
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

  app.get('/api/chat/history', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const limit = req.query.limit ? Math.min(parseInt(req.query.limit as string), 100) : 50;
      
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
      
      // Validate language parameter
      const validLanguages = ['en', 'ar', 'ur', 'bn'];
      const lang = validLanguages.includes(language as string) ? language as string : 'en';
      
      let content = await storage.getDailyContent(today, lang);
      
      // If no content for today, generate it
      if (content.length === 0) {
        try {
          const [verseContent, hadithContent] = await Promise.all([
            generateDailyContent('verse', lang),
            generateDailyContent('hadith', lang)
          ]);
          
          await Promise.all([
            storage.createDailyContent({
              type: 'verse',
              content: verseContent.content,
              source: verseContent.source,
              language: lang,
            }),
            storage.createDailyContent({
              type: 'hadith',
              content: hadithContent.content,
              source: hadithContent.source,
              language: lang,
            }),
          ]);
          
          content = await storage.getDailyContent(today, lang);
        } catch (genError) {
          console.error("Error generating daily content:", genError);
          // Return fallback content
          content = [];
        }
      }
      
      res.json(content);
    } catch (error) {
      console.error("Error fetching daily content:", error);
      res.status(500).json({ message: "Failed to fetch daily content" });
    }
  });

  // Dashboard stats routes
  app.get('/api/dashboard/stats', authenticate, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      let stats = {};
      
      if (user.role === 'teacher') {
        const [classes, files] = await Promise.all([
          storage.getClassesByTeacher(userId),
          storage.getFilesByUploader(userId)
        ]);
        
        // TODO: Calculate total students from enrollments
        const totalStudents = 0;
        
        stats = {
          totalClasses: classes.length,
          totalStudents,
          totalFiles: files.length,
          totalRevenue: 0, // TODO: Calculate from payments
        };
      } else {
        const [classes, enrollments] = await Promise.all([
          storage.getClassesByStudent(userId),
          storage.getEnrollmentsByStudent(userId)
        ]);
        
        stats = {
          enrolledClasses: classes.length,
          completedClasses: 0, // TODO: Calculate from progress
          totalProgress: 0, // TODO: Average progress across all classes
          certificates: 0, // TODO: Count of completed certificates
        };
      }
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Search routes
  app.get('/api/search', authenticate, async (req: any, res) => {
    try {
      const { q, type = 'all' } = req.query;
      
      if (!q || typeof q !== 'string' || q.trim().length === 0) {
        return res.status(400).json({ message: "Search query is required" });
      }

      // TODO: Implement full-text search
      const results = {
        classes: [],
        files: [],
        users: [],
      };
      
      res.json(results);
    } catch (error) {
      console.error("Error performing search:", error);
      res.status(500).json({ message: "Failed to perform search" });
    }
  });

  // Error handling middleware
  app.use((error: any, req: any, res: any, next: any) => {
    console.error('Route error:', error);
    
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ message: 'File too large. Maximum size is 100MB.' });
    }
    
    if (error.message?.includes('Invalid file type')) {
      return res.status(400).json({ message: error.message });
    }
    
    if (error.code === 'ENOENT') {
      return res.status(404).json({ message: 'File not found.' });
    }
    
    res.status(500).json({ 
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error' 
    });
  });

  const httpServer = createServer(app);
  return httpServer;
}