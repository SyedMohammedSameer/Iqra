import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secure-secret-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Types
interface UserPayload {
  id: string;
  email: string;
  role: 'student' | 'teacher';
}

interface AuthRequest extends Request {
  user?: UserPayload;
}

// Utility functions
export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload;
  } catch (error) {
    return null;
  }
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Middleware
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  const user = verifyToken(token);
  if (!user) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  next();
};

// Auth routes
export const authRoutes = {
  // Register new user
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, role = 'student' } = req.body;

      // Validate input
      if (!email || !password || password.length < 6) {
        return res.status(400).json({ 
          message: 'Email and password (min 6 characters) are required' 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role: role as 'student' | 'teacher',
      });

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as 'student' | 'teacher',
      });

      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Login user
  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as 'student' | 'teacher',
      });

      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({
        message: 'Login successful',
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        token,
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Get current user
  me: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      const user = await storage.getUser(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Logout user
  logout: (req: Request, res: Response) => {
    res.clearCookie('auth_token');
    res.json({ message: 'Logout successful' });
  },

  // Refresh token
  refresh: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // Generate new token
      const token = generateToken({
        id: req.user.id,
        email: req.user.email,
        role: req.user.role,
      });

      // Set new cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.json({ message: 'Token refreshed', token });
    } catch (error) {
      console.error('Token refresh error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Social login (Google OAuth example)
  googleCallback: async (req: Request, res: Response) => {
    try {
      // This would be implemented with passport-google-oauth20
      // For now, it's a placeholder showing the structure
      const { googleId, email, firstName, lastName, picture } = req.body;

      let user = await storage.getUserByEmail(email);
      
      if (!user) {
        // Create new user from Google data
        user = await storage.createUser({
          email,
          firstName,
          lastName,
          profileImageUrl: picture,
          googleId,
          role: 'student', // Default role
        });
      }

      // Generate token
      const token = generateToken({
        id: user.id,
        email: user.email,
        role: user.role as 'student' | 'teacher',
      });

      // Set cookie
      res.cookie('auth_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      res.redirect('/dashboard');
    } catch (error) {
      console.error('Google auth error:', error);
      res.redirect('/login?error=auth_failed');
    }
  },
};

// Cookie-based authentication middleware (for browser requests)
export const authenticateCookie = (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.auth_token;

  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = verifyToken(token);
  if (!user) {
    res.clearCookie('auth_token');
    return res.status(403).json({ message: 'Invalid or expired token' });
  }

  req.user = user;
  next();
};

// Combined authentication middleware (checks both cookie and bearer token)
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  // Try cookie first (for browser)
  const cookieToken = req.cookies?.auth_token;
  if (cookieToken) {
    const user = verifyToken(cookieToken);
    if (user) {
      req.user = user;
      return next();
    }
  }

  // Try Authorization header (for API)
  const authHeader = req.headers['authorization'];
  const bearerToken = authHeader && authHeader.split(' ')[1];
  if (bearerToken) {
    const user = verifyToken(bearerToken);
    if (user) {
      req.user = user;
      return next();
    }
  }

  return res.status(401).json({ message: 'Authentication required' });
};