# Islamic Learning Hub - Replit.md

## Overview

Islamic Learning Hub is a comprehensive educational platform designed for Islamic learning with role-based authentication, live classes, AI assistance, and multi-language support. The application features separate dashboards for students and teachers, enabling online Islamic education through video conferencing, file sharing, and AI-powered question answering.

## System Architecture

The application follows a modern full-stack architecture with:

- **Frontend**: React with TypeScript, Vite for bundling, Tailwind CSS + shadcn/ui components
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **AI Integration**: OpenAI GPT-4o for Islamic knowledge assistance
- **Deployment**: Replit with autoscale deployment target

## Key Components

### Frontend Architecture
- **React Router**: Using wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom Islamic-themed color palette
- **Internationalization**: react-i18next with support for English, Arabic, Urdu, and Bengali
- **Context Providers**: Language context for multi-language support

### Backend Architecture
- **Express Server**: RESTful API with middleware for logging and error handling
- **Database Layer**: Drizzle ORM with schema-first approach
- **Authentication**: Passport.js with OpenID Connect strategy for Replit Auth
- **Session Management**: PostgreSQL-backed sessions with connect-pg-simple
- **AI Integration**: OpenAI API integration for Islamic knowledge queries

### Database Schema
Key tables include:
- `users`: User profiles with role-based access (student/teacher)
- `sessions`: Required for Replit Auth session storage
- `classes`: Course/class information with scheduling
- `classEnrollments`: Student-teacher class relationships
- `files`: File uploads with metadata
- `chatMessages`: AI assistant conversation history
- `dailyContent`: Daily Islamic content (verses, hadith)

## Data Flow

1. **Authentication Flow**: Users authenticate via Replit Auth, creating sessions stored in PostgreSQL
2. **Role-Based Routing**: After authentication, users are directed to appropriate dashboards based on their role
3. **API Communication**: Frontend communicates with backend via REST API with credential-based authentication
4. **AI Assistance**: User questions are processed through OpenAI API with Islamic knowledge constraints
5. **File Management**: Multer handles file uploads with type validation and storage
6. **Real-time Updates**: TanStack Query manages cache invalidation and real-time data updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection with WebSocket support
- **drizzle-orm**: Type-safe database ORM
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **react-i18next**: Internationalization framework

### UI Dependencies
- **@radix-ui/react-***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for component variants
- **lucide-react**: Icon library

### Backend Dependencies
- **express**: Web framework
- **passport**: Authentication middleware
- **openid-client**: OpenID Connect implementation
- **multer**: File upload handling
- **connect-pg-simple**: PostgreSQL session store

### AI Integration
- **openai**: Official OpenAI API client
- **gpt-4o**: Latest OpenAI model for Islamic knowledge assistance

## Deployment Strategy

- **Platform**: Replit with autoscale deployment
- **Build Process**: Vite builds client, esbuild bundles server
- **Environment**: Node.js 20 with PostgreSQL 16
- **Port Configuration**: Internal port 5000, external port 80
- **Development**: Hot reload with Vite middleware
- **Production**: Static file serving with Express

The application is configured for both development and production environments, with conditional Vite middleware setup and appropriate build processes for each environment.

## Changelog

```
Changelog:
- June 23, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```