import { z } from "zod";

// User types and schemas
export interface User {
  id: string;
  username: string;
  password: string;
  email: string;
  role: string;
  createdAt: Date;
}

export const insertUserSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email format"),
  role: z.string().default("admin"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;

// News article types and schemas
export interface NewsArticle {
  id: string;
  title: string;
  titleEn: string | null;
  excerpt: string;
  excerptEn: string | null;
  content: string;
  contentEn: string | null;
  category: string;
  categoryEn: string | null;
  imageUrl: string | null;
  published: boolean;
  views: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export const insertNewsArticleSchema = z.object({
  title: z.string().min(1, "Title is required"),
  titleEn: z.string().optional(),
  excerpt: z.string().min(1, "Excerpt is required"),
  excerptEn: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  contentEn: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  categoryEn: z.string().optional(),
  imageUrl: z.string().optional(),
  published: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export type InsertNewsArticle = z.infer<typeof insertNewsArticleSchema>;

// Contact message types and schemas
export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  isRead: boolean;
  repliedAt: Date | null;
  createdAt: Date;
}

export const insertContactMessageSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone is required"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(1, "Message is required"),
});

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;