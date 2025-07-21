# SafeGuard - Student Safety Early Detection System

## Overview

SafeGuard is a comprehensive student safety management system built with a modern full-stack architecture. The application provides early detection capabilities for student safety, featuring real-time attendance tracking, alert management, and comprehensive dashboard analytics. The system is designed for educational institutions to monitor and ensure student safety through advanced tracking and notification systems.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components with Radix UI primitives
- **Styling**: Tailwind CSS with custom SafeGuard theme
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: express-session with PostgreSQL store

### Build System
- **Bundler**: Vite for frontend development and building
- **Backend Build**: esbuild for server-side bundling
- **Development**: tsx for TypeScript execution in development

## Key Components

### Authentication System
- **Provider**: Replit Auth integration with OpenID Connect
- **Session Storage**: PostgreSQL-based session store with 7-day TTL
- **Security Features**: HTTP-only cookies, secure connections, CSRF protection
- **User Management**: Automatic user creation/update on login

### Database Schema
- **Users Table**: Stores user profiles with role-based permissions
- **Students Table**: Student information with attendance tracking
- **Attendance Table**: Daily attendance records with timestamps
- **Activities Table**: System activity logging for audit trails
- **Alerts Table**: Safety alerts with resolution tracking
- **Sessions Table**: Secure session management

### Real-time Features
- **Dashboard Analytics**: Live statistics and metrics
- **Alert System**: Instant notifications for safety concerns
- **Activity Logging**: Real-time system activity tracking
- **Attendance Monitoring**: Live attendance status updates

### UI/UX Design
- **Design System**: Custom SafeGuard theme with gradient backgrounds
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Accessibility**: ARIA-compliant components from Radix UI
- **Internationalization**: Hebrew (RTL) language support
- **Security Indicators**: Visual security status indicators

## Data Flow

1. **Authentication Flow**: User authenticates via Replit Auth → Session created → User profile updated/created
2. **Dashboard Flow**: User accesses dashboard → Real-time stats fetched → Components render with live data
3. **Student Management**: CRUD operations on students → Database updates → UI reflects changes immediately
4. **Attendance Flow**: Attendance recorded → Database updated → Dashboard stats updated → Activity logged
5. **Alert System**: Safety concern detected → Alert created → Real-time notification → Resolution tracking

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe database ORM with schema management
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/***: Accessible UI primitives for components
- **tailwindcss**: Utility-first CSS framework

### Authentication
- **openid-client**: OpenID Connect client for Replit Auth
- **passport**: Authentication middleware
- **express-session**: Session management
- **connect-pg-simple**: PostgreSQL session store

### Development Tools
- **vite**: Frontend build tool and dev server
- **tsx**: TypeScript execution for development
- **esbuild**: Fast JavaScript/TypeScript bundler

## Deployment Strategy

### Development Environment
- **Frontend**: Vite dev server with HMR and error overlay
- **Backend**: tsx with file watching for auto-restart
- **Database**: Neon serverless PostgreSQL with development schema
- **Environment**: Replit-optimized with integrated debugging

### Production Build
- **Frontend**: Vite production build to `dist/public`
- **Backend**: esbuild bundle to `dist/index.js`
- **Database Migrations**: Drizzle migrations in `migrations/` folder
- **Environment Variables**: DATABASE_URL, SESSION_SECRET, REPL_ID required

### Deployment Process
1. Build frontend assets with Vite
2. Bundle backend with esbuild
3. Push database schema changes with Drizzle
4. Start production server with `node dist/index.js`
5. Serve static assets from Express

The application is designed to run efficiently in serverless environments with automatic scaling and minimal cold start times.