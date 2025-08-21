import { type User, type InsertUser, type NewsArticle, type InsertNewsArticle, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // News article methods
  getNewsArticles(options?: { published?: boolean; limit?: number; offset?: number }): Promise<NewsArticle[]>;
  getNewsArticle(id: string): Promise<NewsArticle | undefined>;
  createNewsArticle(article: InsertNewsArticle): Promise<NewsArticle>;
  updateNewsArticle(id: string, article: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined>;
  deleteNewsArticle(id: string): Promise<boolean>;
  incrementNewsViews(id: string): Promise<void>;

  // Contact message methods
  getContactMessages(options?: { isRead?: boolean; limit?: number; offset?: number }): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  markMessageAsRead(id: string): Promise<boolean>;
  deleteContactMessage(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private newsArticles: Map<string, NewsArticle>;
  private contactMessages: Map<string, ContactMessage>;

  constructor() {
    this.users = new Map();
    this.newsArticles = new Map();
    this.contactMessages = new Map();

    // Initialize with default admin user
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    const adminId = randomUUID();
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@firdouslaw.sa",
      password: "$2a$10$rOQ.dKKQiDKV.XkqJ0K0XO8KgF8.6QVkzO0RGKrJ8LvL8vPvO5Q8e", // "admin123"
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Sample news articles
    const article1Id = randomUUID();
    const article1: NewsArticle = {
      id: article1Id,
      title: "التحديثات الجديدة في قانون الشركات السعودي لعام 2024",
      titleEn: "New Updates in Saudi Company Law for 2024",
      excerpt: "نظرة شاملة على أهم التعديلات الجديدة في قانون الشركات وتأثيرها على الشركات العاملة في المملكة",
      excerptEn: "A comprehensive overview of the most important new amendments to the Company Law and their impact on companies operating in the Kingdom",
      content: "يشهد قانون الشركات السعودي تطورات مهمة في عام 2024 تهدف إلى تعزيز بيئة الأعمال وتحسين الممارسات الحوكمية...",
      contentEn: "Saudi Company Law is witnessing important developments in 2024 aimed at enhancing the business environment and improving governance practices...",
      category: "تحديثات قانونية",
      categoryEn: "Legal Updates",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 245,
      publishedAt: new Date("2024-01-15"),
      createdAt: new Date("2024-01-15"),
      updatedAt: new Date("2024-01-15"),
    };
    this.newsArticles.set(article1Id, article1);

    const article2Id = randomUUID();
    const article2: NewsArticle = {
      id: article2Id,
      title: "قرار محكمة الاستئناف حول التجارة الإلكترونية",
      titleEn: "Court of Appeal Decision on E-commerce",
      excerpt: "تحليل قانوني شامل لقرار محكمة الاستئناف الأخير وتأثيره على شركات التجارة الإلكترونية",
      excerptEn: "Comprehensive legal analysis of the recent Court of Appeal decision and its impact on e-commerce companies",
      content: "أصدرت محكمة الاستئناف قراراً مهماً يتعلق بالتجارة الإلكترونية والذي سيكون له تأثير كبير على القطاع...",
      contentEn: "The Court of Appeal issued an important decision related to e-commerce that will have a significant impact on the sector...",
      category: "قرارات قضائية",
      categoryEn: "Court Decisions",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 189,
      publishedAt: new Date("2024-01-10"),
      createdAt: new Date("2024-01-10"),
      updatedAt: new Date("2024-01-10"),
    };
    this.newsArticles.set(article2Id, article2);
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "admin",
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  // News article methods
  async getNewsArticles(options?: { published?: boolean; limit?: number; offset?: number }): Promise<NewsArticle[]> {
    let articles = Array.from(this.newsArticles.values());
    
    if (options?.published !== undefined) {
      articles = articles.filter(article => article.published === options.published);
    }
    
    // Sort by publishedAt descending
    articles.sort((a, b) => {
      const dateA = a.publishedAt || a.createdAt;
      const dateB = b.publishedAt || b.createdAt;
      return dateB.getTime() - dateA.getTime();
    });
    
    if (options?.offset) {
      articles = articles.slice(options.offset);
    }
    
    if (options?.limit) {
      articles = articles.slice(0, options.limit);
    }
    
    return articles;
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    return this.newsArticles.get(id);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const id = randomUUID();
    const now = new Date();
    const article: NewsArticle = {
      ...insertArticle,
      id,
      views: 0,
      published: insertArticle.published || false,
      titleEn: insertArticle.titleEn || null,
      excerptEn: insertArticle.excerptEn || null,
      contentEn: insertArticle.contentEn || null,
      categoryEn: insertArticle.categoryEn || null,
      imageUrl: insertArticle.imageUrl || null,
      publishedAt: insertArticle.published ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    this.newsArticles.set(id, article);
    return article;
  }

  async updateNewsArticle(id: string, updateData: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const existing = this.newsArticles.get(id);
    if (!existing) return undefined;
    
    const updated: NewsArticle = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
      publishedAt: updateData.published && !existing.published ? new Date() : existing.publishedAt,
    };
    
    this.newsArticles.set(id, updated);
    return updated;
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    return this.newsArticles.delete(id);
  }

  async incrementNewsViews(id: string): Promise<void> {
    const article = this.newsArticles.get(id);
    if (article) {
      const updated = { ...article, views: article.views + 1 };
      this.newsArticles.set(id, updated);
    }
  }

  // Contact message methods
  async getContactMessages(options?: { isRead?: boolean; limit?: number; offset?: number }): Promise<ContactMessage[]> {
    let messages = Array.from(this.contactMessages.values());
    
    if (options?.isRead !== undefined) {
      messages = messages.filter(message => message.isRead === options.isRead);
    }
    
    // Sort by createdAt descending
    messages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    
    if (options?.offset) {
      messages = messages.slice(options.offset);
    }
    
    if (options?.limit) {
      messages = messages.slice(0, options.limit);
    }
    
    return messages;
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    return this.contactMessages.get(id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const id = randomUUID();
    const message: ContactMessage = {
      ...insertMessage,
      id,
      isRead: false,
      repliedAt: null,
      createdAt: new Date(),
    };
    this.contactMessages.set(id, message);
    return message;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const message = this.contactMessages.get(id);
    if (!message) return false;
    
    const updated = { ...message, isRead: true };
    this.contactMessages.set(id, updated);
    return true;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    return this.contactMessages.delete(id);
  }
}

export const storage = new MemStorage();
