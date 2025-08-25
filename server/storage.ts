import { type User, type InsertUser, type NewsArticle, type InsertNewsArticle, type ContactMessage, type InsertContactMessage, users, newsArticles, contactMessages } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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

  private async initializeDefaultData() {
    const adminId = randomUUID();
    const hashedPassword = await bcrypt.hash("admin123", 10);
    const admin: User = {
      id: adminId,
      username: "admin",
      email: "admin@firdouslaw.sa",
      password: hashedPassword,
      role: "admin",
      createdAt: new Date(),
    };
    this.users.set(adminId, admin);

    // Legal news articles for Firdous Saud Al-Sharhan Law and Consulting Company
    const article1Id = randomUUID();
    const article1: NewsArticle = {
      id: article1Id,
      title: "حكم قضائي لصالح شركة صرافة وتوقيع اتفاقيات دولية",
      titleEn: "Court Ruling for Exchange Company and International Agreements",
      excerpt: "انتصار قانوني بارز لشركة صرافة ضد هيئة الزكاة والضريبة والجمارك، وتوقيع اتفاقيات دولية استراتيجية.",
      excerptEn: "A major legal victory for an exchange company against the Zakat, Tax, and Customs Authority, alongside strategic international agreements.",
      content: "استطعنا اكتساب حكم قضائي لصالح شركة صرافة ضد هيئة الزكاة والضريبة والجمارك، حيث تم رفض دعوى مالية قدرها 1,400,000 ريال خلال مرحلة الاستئناف. كما تم وضع وتوقيع اتفاقية عالمية مع BFC (Bahrain Financing Company) لتنظيم المعاملات المالية والتجارية. إضافة إلى ذلك، تمت متابعة ملفات منازعات مستثمرين بالاشتراك مع السفارة السعودية في المغرب لضمان سلامة الاستثمارات، وصياغة عقود لشركات سعودية مع كيانات أجنبية في مصر بما يكفل الحماية القانونية. كما قدّمنا استشارات متخصصة حول التشريع القضائي الإماراتي ومقارنته بالتشريعات السعودية لضمان مطابقة التزامات المستثمرين.",
      contentEn: "We secured a court ruling in favor of an exchange company against the Zakat, Tax, and Customs Authority, dismissing a financial claim of SAR 1.4 million at the appeal stage. Additionally, a global agreement was signed with BFC (Bahrain Financing Company) to regulate financial and trade transactions. Investor dispute cases were followed up in collaboration with the Saudi Embassy in Morocco to safeguard investments, while contracts were drafted for Saudi companies with foreign entities in Egypt to ensure legal protection. Specialized consultations were also provided on UAE judicial legislation compared with Saudi laws to ensure investor compliance.",
      category: "قرارات قضائية",
      categoryEn: "Judicial Decisions",
      imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsArticles.set(article1Id, article1);

    const article2Id = randomUUID();
    const article2: NewsArticle = {
      id: article2Id,
      title: "تأسيس الهيكل القانوني لمؤسسة حلول النقد",
      titleEn: "Establishing Legal Framework for Hulool Al-Naqd IT",
      excerpt: "دعم قانوني متكامل لمؤسسة حلول النقد عبر بناء هيكل قانوني وربطه بالهيئات المعنية.",
      excerptEn: "Comprehensive legal support for Hulool Al-Naqd through building its legal framework and linking it to relevant authorities.",
      content: "تم إنشاء الهيكل القانوني لمؤسسة حلول النقد لتقنية المعلومات وربطه بالهيئات والسلطات المعنية، إلى جانب وضع اتفاقيات تقنية وسياسات سرية متوافقة مع قانون حماية البيانات الشخصية في المملكة.",
      contentEn: "The legal framework for Hulool Al-Naqd IT was established and linked to the relevant authorities, with the implementation of technical agreements and confidentiality policies in line with Saudi Arabia's Personal Data Protection Law.",
      category: "تحديثات قانونية",
      categoryEn: "Legal Updates",
      imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsArticles.set(article2Id, article2);

    const article3Id = randomUUID();
    const article3: NewsArticle = {
      id: article3Id,
      title: "مواءمة تراخيص وسياسات مكافحة غسل الأموال لشركة الحربي للصرافة",
      titleEn: "Licensing and AML Compliance Alignment for Al-Harbi Exchange",
      excerpt: "إدارة شاملة لتراخيص الحربي للصرافة مع مواءمة سياسات مكافحة غسل الأموال.",
      excerptEn: "Comprehensive management of licensing for Al-Harbi Exchange with AML compliance alignment.",
      content: "تمت إدارة ملفات التراخيص والتصاريح لشركة الحربي للصرافة بالتنسيق مع البنك المركزي السعودي، مع مواءمة سياسات مكافحة غسل الأموال وتمويل الإرهاب وفقاً للإجراءات المعمول بها.",
      contentEn: "Licensing and permit files for Al-Harbi Exchange were managed in coordination with the Saudi Central Bank, ensuring Anti-Money Laundering (AML) and Counter-Terrorism Financing policies were aligned with applicable regulations.",
      category: "تحديثات قانونية",
      categoryEn: "Legal Updates",
      imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsArticles.set(article3Id, article3);

    const article4Id = randomUUID();
    const article4: NewsArticle = {
      id: article4Id,
      title: "تطوير معايير \"اعرف عميلك\" لشركة بازيد للصرافة",
      titleEn: "Enhancing KYC Standards for Bazid Exchange",
      excerpt: "تعزيز معايير الامتثال لشركة بازيد للصرافة عبر تطوير سياسات KYC.",
      excerptEn: "Strengthening compliance for Bazid Exchange through advanced KYC policies.",
      content: "أجرت شركة بازيد للصرافة إجراءات تطوير معايير \"اعرف عميلك\" (KYC) وخطط الامتثال المرتبطة بها، بما يتماشى مع أفضل الممارسات المحلية والدولية.",
      contentEn: "Bazid Exchange undertook measures to enhance \"Know Your Customer\" (KYC) standards and related compliance plans, aligning with both local and international best practices.",
      category: "تحديثات قانونية",
      categoryEn: "Legal Updates",
      imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsArticles.set(article4Id, article4);

    const article5Id = randomUUID();
    const article5: NewsArticle = {
      id: article5Id,
      title: "إنجازات قانونية لشركة عبدالرحمن الشرهان وشركاه للصرافة",
      titleEn: "Legal Achievements for Abdulrahman Al-Sharhan & Partners Exchange",
      excerpt: "إدارة متكاملة للشؤون القانونية والنزاعات وعقود الموظفين لصالح شركة الشرهان للصرافة.",
      excerptEn: "Comprehensive legal management of disputes and employment contracts for Al-Sharhan Exchange.",
      content: "تولت الشركة إدارة الشؤون القانونية وصياغة عقد Global Blue بما يتوافق مع الأنظمة المحلية والدولية، إضافة إلى معالجة النزاعات التجارية وإعداد مذكرات رد مدعمة بالأحكام القضائية. كما قامت بإدارة عقود الموظفين وإعداد السياسات الداخلية للموارد البشرية بما يتفق مع تشريعات العمل السعودية. كذلك قدّمت المشورة بشأن تسويات الموظفين والنزاعات العمالية أمام المحاكم، وشاركت في مباحثات تسويات استراتيجية مع جهات محلية وعالمية. ومن أبرز الإنجازات إسقاط دعوى ضريبية بقيمة 1.4 مليون ريال في مرحلة الاستئناف.",
      contentEn: "The firm managed all legal affairs, including drafting and reviewing the Global Blue contract to align with local and international laws, handling commercial disputes, and preparing defense memoranda supported by judicial rulings. It also managed employment contracts at all levels, developed HR policies in line with Saudi labor regulations, and provided advice on employee settlements and labor disputes before the courts. Strategic settlement negotiations were conducted with local and international parties. A key achievement was the dismissal of a SAR 1.4 million tax claim at the appeal stage.",
      category: "قرارات قضائية",
      categoryEn: "Judicial Decisions",
      imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
      published: true,
      views: 0,
      publishedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.newsArticles.set(article5Id, article5);
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

export class DatabaseStorage implements IStorage {
  private initialized = false;

  constructor() {
    this.initializeDefaultData();
  }

  private async initializeDefaultData() {
    if (this.initialized) return;
    
    try {
      // Check if admin user exists
      const existingAdmin = await this.getUserByUsername("admin");
      if (!existingAdmin) {
        // Create admin user
        const hashedPassword = await bcrypt.hash("admin123", 10);
        await db.insert(users).values({
          username: "admin",
          email: "admin@firdouslaw.sa",
          password: hashedPassword,
          role: "admin",
        });
      }

      // Check if news articles exist
      const existingArticles = await this.getNewsArticles();
      if (existingArticles.length === 0) {
        // Insert the legal news articles
        await db.insert(newsArticles).values([
          {
            title: "حكم قضائي لصالح شركة صرافة وتوقيع اتفاقيات دولية",
            titleEn: "Court Ruling for Exchange Company and International Agreements",
            excerpt: "انتصار قانوني بارز لشركة صرافة ضد هيئة الزكاة والضريبة والجمارك، وتوقيع اتفاقيات دولية استراتيجية.",
            excerptEn: "A major legal victory for an exchange company against the Zakat, Tax, and Customs Authority, alongside strategic international agreements.",
            content: "استطعنا اكتساب حكم قضائي لصالح شركة صرافة ضد هيئة الزكاة والضريبة والجمارك، حيث تم رفض دعوى مالية قدرها 1,400,000 ريال خلال مرحلة الاستئناف. كما تم وضع وتوقيع اتفاقية عالمية مع BFC (Bahrain Financing Company) لتنظيم المعاملات المالية والتجارية. إضافة إلى ذلك، تمت متابعة ملفات منازعات مستثمرين بالاشتراك مع السفارة السعودية في المغرب لضمان سلامة الاستثمارات، وصياغة عقود لشركات سعودية مع كيانات أجنبية في مصر بما يكفل الحماية القانونية. كما قدّمنا استشارات متخصصة حول التشريع القضائي الإماراتي ومقارنته بالتشريعات السعودية لضمان مطابقة التزامات المستثمرين.",
            contentEn: "We secured a court ruling in favor of an exchange company against the Zakat, Tax, and Customs Authority, dismissing a financial claim of SAR 1.4 million at the appeal stage. Additionally, a global agreement was signed with BFC (Bahrain Financing Company) to regulate financial and trade transactions. Investor dispute cases were followed up in collaboration with the Saudi Embassy in Morocco to safeguard investments, while contracts were drafted for Saudi companies with foreign entities in Egypt to ensure legal protection. Specialized consultations were also provided on UAE judicial legislation compared with Saudi laws to ensure investor compliance.",
            category: "قرارات قضائية",
            categoryEn: "Judicial Decisions",
            imageUrl: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            published: true,
            publishedAt: new Date(),
          },
          {
            title: "تأسيس الهيكل القانوني لمؤسسة حلول النقد",
            titleEn: "Establishing Legal Framework for Hulool Al-Naqd IT",
            excerpt: "دعم قانوني متكامل لمؤسسة حلول النقد عبر بناء هيكل قانوني وربطه بالهيئات المعنية.",
            excerptEn: "Comprehensive legal support for Hulool Al-Naqd through building its legal framework and linking it to relevant authorities.",
            content: "تم إنشاء الهيكل القانوني لمؤسسة حلول النقد لتقنية المعلومات وربطه بالهيئات والسلطات المعنية، إلى جانب وضع اتفاقيات تقنية وسياسات سرية متوافقة مع قانون حماية البيانات الشخصية في المملكة.",
            contentEn: "The legal framework for Hulool Al-Naqd IT was established and linked to the relevant authorities, with the implementation of technical agreements and confidentiality policies in line with Saudi Arabia's Personal Data Protection Law.",
            category: "تحديثات قانونية",
            categoryEn: "Legal Updates",
            imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            published: true,
            publishedAt: new Date(),
          },
          {
            title: "مواءمة تراخيص وسياسات مكافحة غسل الأموال لشركة الحربي للصرافة",
            titleEn: "Licensing and AML Compliance Alignment for Al-Harbi Exchange",
            excerpt: "إدارة شاملة لتراخيص الحربي للصرافة مع مواءمة سياسات مكافحة غسل الأموال.",
            excerptEn: "Comprehensive management of licensing for Al-Harbi Exchange with AML compliance alignment.",
            content: "تمت إدارة ملفات التراخيص والتصاريح لشركة الحربي للصرافة بالتنسيق مع البنك المركزي السعودي، مع مواءمة سياسات مكافحة غسل الأموال وتمويل الإرهاب وفقاً للإجراءات المعمول بها.",
            contentEn: "Licensing and permit files for Al-Harbi Exchange were managed in coordination with the Saudi Central Bank, ensuring Anti-Money Laundering (AML) and Counter-Terrorism Financing policies were aligned with applicable regulations.",
            category: "تحديثات قانونية",
            categoryEn: "Legal Updates",
            imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            published: true,
            publishedAt: new Date(),
          },
          {
            title: "تطوير معايير \"اعرف عميلك\" لشركة بازيد للصرافة",
            titleEn: "Enhancing KYC Standards for Bazid Exchange",
            excerpt: "تعزيز معايير الامتثال لشركة بازيد للصرافة عبر تطوير سياسات KYC.",
            excerptEn: "Strengthening compliance for Bazid Exchange through advanced KYC policies.",
            content: "أجرت شركة بازيد للصرافة إجراءات تطوير معايير \"اعرف عميلك\" (KYC) وخطط الامتثال المرتبطة بها، بما يتماشى مع أفضل الممارسات المحلية والدولية.",
            contentEn: "Bazid Exchange undertook measures to enhance \"Know Your Customer\" (KYC) standards and related compliance plans, aligning with both local and international best practices.",
            category: "تحديثات قانونية",
            categoryEn: "Legal Updates",
            imageUrl: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            published: true,
            publishedAt: new Date(),
          },
          {
            title: "إنجازات قانونية لشركة عبدالرحمن الشرهان وشركاه للصرافة",
            titleEn: "Legal Achievements for Abdulrahman Al-Sharhan & Partners Exchange",
            excerpt: "إدارة متكاملة للشؤون القانونية والنزاعات وعقود الموظفين لصالح شركة الشرهان للصرافة.",
            excerptEn: "Comprehensive legal management of disputes and employment contracts for Al-Sharhan Exchange.",
            content: "تولت الشركة إدارة الشؤون القانونية وصياغة عقد Global Blue بما يتوافق مع الأنظمة المحلية والدولية، إضافة إلى معالجة النزاعات التجارية وإعداد مذكرات رد مدعمة بالأحكام القضائية. كما قامت بإدارة عقود الموظفين وإعداد السياسات الداخلية للموارد البشرية بما يتفق مع تشريعات العمل السعودية. كذلك قدّمت المشورة بشأن تسويات الموظفين والنزاعات العمالية أمام المحاكم، وشاركت في مباحثات تسويات استراتيجية مع جهات محلية وعالمية. ومن أبرز الإنجازات إسقاط دعوى ضريبية بقيمة 1.4 مليون ريال في مرحلة الاستئناف.",
            contentEn: "The firm managed all legal affairs, including drafting and reviewing the Global Blue contract to align with local and international laws, handling commercial disputes, and preparing defense memoranda supported by judicial rulings. It also managed employment contracts at all levels, developed HR policies in line with Saudi labor regulations, and provided advice on employee settlements and labor disputes before the courts. Strategic settlement negotiations were conducted with local and international parties. A key achievement was the dismissal of a SAR 1.4 million tax claim at the appeal stage.",
            category: "قرارات قضائية",
            categoryEn: "Judicial Decisions",
            imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
            published: true,
            publishedAt: new Date(),
          },
        ]);
      }

      this.initialized = true;
    } catch (error) {
      console.error("Error initializing database:", error);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  // News article methods
  async getNewsArticles(options?: { published?: boolean; limit?: number; offset?: number }): Promise<NewsArticle[]> {
    let query = db.select().from(newsArticles);
    
    if (options?.published !== undefined) {
      query = query.where(eq(newsArticles.published, options.published));
    }
    
    query = query.orderBy(desc(newsArticles.publishedAt));
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    return query;
  }

  async getNewsArticle(id: string): Promise<NewsArticle | undefined> {
    const [article] = await db.select().from(newsArticles).where(eq(newsArticles.id, id));
    return article || undefined;
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const [article] = await db
      .insert(newsArticles)
      .values({
        ...insertArticle,
        publishedAt: insertArticle.published ? new Date() : null,
      })
      .returning();
    return article;
  }

  async updateNewsArticle(id: string, updateData: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const [updated] = await db
      .update(newsArticles)
      .set({
        ...updateData,
        updatedAt: new Date(),
        publishedAt: updateData.published && !(await this.getNewsArticle(id))?.published ? new Date() : undefined,
      })
      .where(eq(newsArticles.id, id))
      .returning();
    return updated || undefined;
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    const result = await db.delete(newsArticles).where(eq(newsArticles.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async incrementNewsViews(id: string): Promise<void> {
    const article = await this.getNewsArticle(id);
    if (article) {
      await db
        .update(newsArticles)
        .set({
          views: article.views + 1,
        })
        .where(eq(newsArticles.id, id));
    }
  }

  // Contact message methods
  async getContactMessages(options?: { isRead?: boolean; limit?: number; offset?: number }): Promise<ContactMessage[]> {
    let query = db.select().from(contactMessages);
    
    if (options?.isRead !== undefined) {
      query = query.where(eq(contactMessages.isRead, options.isRead));
    }
    
    query = query.orderBy(desc(contactMessages.createdAt));
    
    if (options?.offset) {
      query = query.offset(options.offset);
    }
    
    if (options?.limit) {
      query = query.limit(options.limit);
    }
    
    return query;
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message || undefined;
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const [message] = await db
      .insert(contactMessages)
      .values(insertMessage)
      .returning();
    return message;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const result = await db
      .update(contactMessages)
      .set({ isRead: true })
      .where(eq(contactMessages.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const result = await db.delete(contactMessages).where(eq(contactMessages.id, id));
    return result.rowCount ? result.rowCount > 0 : false;
  }
}

export const storage = new DatabaseStorage();
