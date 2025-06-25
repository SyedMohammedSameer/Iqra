// server/auth.ts - Fixed authentication
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

      if (!firstName || !lastName) {
        return res.status(400).json({ 
          message: 'First name and last name are required' 
        });
      }

      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: 'User already exists with this email' });
      }

      // Hash password
      const hashedPassword = await hashPassword(password);

      // Create user
      const user = await storage.createUser({
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        role: role as 'student' | 'teacher',
        isVerified: true, // For now, auto-verify users
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
      const user = await storage.getUserByEmail(email.toLowerCase().trim());
      if (!user || !user.password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if user is active
      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      // Check password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Update last login
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

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

      if (!user.isActive) {
        return res.status(401).json({ message: 'Account is deactivated' });
      }

      res.json({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
      });
    } catch (error) {
      console.error('Get user error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },

  // Logout user
  logout: (req: Request, res: Response) => {
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.json({ message: 'Logout successful' });
  },

  // Refresh token
  refresh: async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Not authenticated' });
      }

      // Verify user still exists and is active
      const user = await storage.getUser(req.user.id);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: 'User not found or deactivated' });
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

  // Social login placeholder
  googleCallback: async (req: Request, res: Response) => {
    try {
      // This would be implemented with passport-google-oauth20
      res.status(501).json({ message: 'Google OAuth not implemented yet' });
    } catch (error) {
      console.error('Google auth error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};