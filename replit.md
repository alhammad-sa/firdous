# Overview

This is a bilingual (Arabic/English) law firm website for Firdous Saud Al-Sharhan Law and Consulting Company. The application is a full-stack web application built with React frontend and Express backend, featuring a content management system for news articles and contact messages. The site provides information about legal services, company background, news updates, and contact functionality with an admin panel for content management.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React with TypeScript**: Modern React application using functional components and hooks
- **UI Framework**: shadcn/ui components built on Radix UI primitives for accessible, customizable components
- **Styling**: Tailwind CSS with custom color scheme and CSS variables for theming
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Internationalization**: Custom i18n implementation supporting Arabic (RTL) and English (LTR) with context-based language switching
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture
- **Express.js**: RESTful API server with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Authentication**: JWT-based authentication for admin panel access
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple

## Database Design
- **Users Table**: Admin user management with bcrypt password hashing
- **News Articles Table**: Bilingual content support with publishing status and view tracking
- **Contact Messages Table**: Message management with read status tracking
- **Schema Management**: Drizzle Kit for migrations and schema synchronization

## API Structure
- **Authentication Endpoints**: Login/logout functionality with JWT tokens
- **News Management**: CRUD operations for news articles with publishing controls
- **Contact System**: Message submission and admin management endpoints
- **Protected Routes**: Admin-only endpoints secured with JWT middleware

## Development Setup
- **Development Server**: Vite middleware integration with Express for seamless development
- **Type Safety**: Shared TypeScript schemas between frontend and backend
- **Code Organization**: Monorepo structure with client, server, and shared directories
- **Asset Handling**: Static file serving with proper caching headers

# External Dependencies

## Database and Storage
- **Neon Database**: PostgreSQL hosting service (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe database toolkit with PostgreSQL dialect

## UI and Styling
- **Radix UI**: Accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing
- **Google Fonts**: Inter, Cairo, and Fira Code font families for multilingual support

## Development Tools
- **Replit Integration**: Development environment optimizations and error handling
- **ESBuild**: Fast JavaScript bundler for production builds
- **TypeScript**: Full type safety across the entire application stack

## Authentication and Security
- **bcrypt**: Password hashing for secure user authentication
- **jsonwebtoken**: JWT token generation and verification
- **Express Session**: Session management with PostgreSQL storage

## Utilities and Libraries
- **React Hook Form**: Form state management with validation
- **date-fns**: Date manipulation and formatting utilities
- **Zod**: Runtime type validation and schema parsing
- **class-variance-authority**: Type-safe component variant management