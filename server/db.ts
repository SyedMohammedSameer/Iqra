import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";
import { config } from 'dotenv';

// Load environment variables
config();

neonConfig.webSocketConstructor = ws;

// Debug: Log the DATABASE_URL (mask password for security)
if (process.env.NODE_ENV === 'development') {
  const maskedUrl = process.env.DATABASE_URL 
    ? process.env.DATABASE_URL.replace(/:([^:@]*?)@/, ':****@')
    : 'NOT SET';
  console.log('🔍 DATABASE_URL:', maskedUrl);
}

if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set!');
  console.error('📝 Make sure you have a .env file in your project root with:');
  console.error('   DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"');
  console.error('📁 Current working directory:', process.cwd());
  console.error('🔍 Available env vars:', Object.keys(process.env).filter(key => key.includes('DATA')));
  
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });