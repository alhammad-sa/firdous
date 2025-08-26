import { type User, type InsertUser, type NewsArticle, type InsertNewsArticle, type ContactMessage, type InsertContactMessage } from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcrypt";
import { promises as fs } from 'fs';
import { join } from 'path';

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

export class FileStorage implements IStorage {
  private dataDir: string;
  private usersFile: string;
  private newsArticlesFile: string;
  private contactMessagesFile: string;
  private initialized = false;

  constructor() {
    this.dataDir = join(process.cwd(), 'data');
    this.usersFile = join(this.dataDir, 'users.json');
    this.newsArticlesFile = join(this.dataDir, 'news-articles.json');
    this.contactMessagesFile = join(this.dataDir, 'contact-messages.json');
    this.initializeFileSystem();
  }

  private async initializeFileSystem() {
    if (this.initialized) return;
    
    try {
      // Create data directory if it doesn't exist
      await fs.mkdir(this.dataDir, { recursive: true });

      // Initialize files if they don't exist
      await this.initializeFile(this.usersFile, []);
      await this.initializeFile(this.newsArticlesFile, []);
      await this.initializeFile(this.contactMessagesFile, []);

      // Initialize with default data
      await this.initializeDefaultData();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize file system:', error);
    }
  }

  private async initializeFile(filePath: string, defaultData: any[]) {
    try {
      await fs.access(filePath);
    } catch {
      await fs.writeFile(filePath, JSON.stringify(defaultData, null, 2));
    }
  }

  private async readFile<T>(filePath: string): Promise<T[]> {
    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data) as T[];
    } catch (error) {
      console.error(`Error reading file ${filePath}:`, error);
      return [];
    }
  }

  private async writeFile<T>(filePath: string, data: T[]): Promise<void> {
    try {
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing file ${filePath}:`, error);
    }
  }

  private async initializeDefaultData() {
    // Check if admin user exists
    const users = await this.readFile<User>(this.usersFile);
    const adminExists = users.some(user => user.username === 'admin');
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("admin123", 10);
      const admin: User = {
        id: randomUUID(),
        username: "admin",
        email: "admin@firdouslaw.sa",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
      };
      users.push(admin);
      await this.writeFile(this.usersFile, users);
    }

    // Check if news articles exist
    const articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    if (articles.length === 0) {
      const defaultArticles: NewsArticle[] = [
        {
          id: randomUUID(),
          title: "حكم قضائي لصالح شركة صرافة وتوقيع اتفاقيات دولية",
          titleEn: "Court Ruling for Exchange Company and International Agreements",
          excerpt: "انتصار قانوني بارز لشركة صرافة ضد هيئة الزكاة والضريبة والجمارك، وتوقيع اتفاقيات دولية استراتيجية.",
          excerptEn: "A major legal victory for an exchange company against the Zakat, Tax, and Customs Authority, alongside strategic international agreements.",
          content: "استطعنا اكتساب حكم قضائي لصالح شركة صرافة ضد هيئة الزكاة والضريبة والجمارك، حيث تم رفض دعوى مالية قدرها 1,400,000 ريال خلال مرحلة الاستئناف. كما تم وضع وتوقيع اتفاقية عالمية مع BFC (Bahrain Financing Company) لتنظيم المعاملات المالية والتجارية. إضافة إلى ذلك، تمت متابعة ملفات منازعات مستثمرين بالاشتراك مع السفارة السعودية في المغرب لضمان سلامة الاستثمارات، وصياغة عقود لشركات سعودية مع كيانات أجنبية في مصر بما يكفل الحماية القانونية. كما قدّمنا استشارات متخصصة حول التشريع القضائي الإماراتي ومقارنته بالتشريعات السعودية لضمان مطابقة التزامات المستثمرين.",
          contentEn: "We secured a court ruling in favor of an exchange company against the Zakat, Tax, and Customs Authority, dismissing a financial claim of SAR 1.4 million at the appeal stage. Additionally, a global agreement was signed with BFC (Bahrain Financing Company) to regulate financial and trade transactions. Investor dispute cases were followed up in collaboration with the Saudi Embassy in Morocco to safeguard investments, while contracts were drafted for Saudi companies with foreign entities in Egypt to ensure legal protection. Specialized consultations were also provided on UAE judicial legislation compared with Saudi laws to ensure investor compliance.",
          category: "قرارات قضائية",
          categoryEn: "Judicial Decisions",
          imageUrl: "/images/saudi-legal-default.jpg",
          published: true,
          views: 0,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          title: "تأسيس الهيكل القانوني لمؤسسة حلول النقد",
          titleEn: "Establishing Legal Framework for Hulool Al-Naqd IT",
          excerpt: "دعم قانوني متكامل لمؤسسة حلول النقد عبر بناء هيكل قانوني وربطه بالهيئات المعنية.",
          excerptEn: "Comprehensive legal support for Hulool Al-Naqd through building its legal framework and linking it to relevant authorities.",
          content: "تم إنشاء الهيكل القانوني لمؤسسة حلول النقد لتقنية المعلومات وربطه بالهيئات والسلطات المعنية، إلى جانب وضع اتفاقيات تقنية وسياسات سرية متوافقة مع قانون حماية البيانات الشخصية في المملكة.",
          contentEn: "The legal framework for Hulool Al-Naqd IT was established and linked to the relevant authorities, with the implementation of technical agreements and confidentiality policies in line with Saudi Arabia's Personal Data Protection Law.",
          category: "تحديثات قانونية",
          categoryEn: "Legal Updates",
          imageUrl: "/images/saudi-legal-default.jpg",
          published: true,
          views: 0,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          title: "مواءمة تراخيص وسياسات مكافحة غسل الأموال لشركة الحربي للصرافة",
          titleEn: "Licensing and AML Compliance Alignment for Al-Harbi Exchange",
          excerpt: "إدارة شاملة لتراخيص الحربي للصرافة مع مواءمة سياسات مكافحة غسل الأموال.",
          excerptEn: "Comprehensive management of licensing for Al-Harbi Exchange with AML compliance alignment.",
          content: "تمت إدارة ملفات التراخيص والتصاريح لشركة الحربي للصرافة بالتنسيق مع البنك المركزي السعودي، مع مواءمة سياسات مكافحة غسل الأموال وتمويل الإرهاب وفقاً للإجراءات المعمول بها.",
          contentEn: "Licensing and permit files for Al-Harbi Exchange were managed in coordination with the Saudi Central Bank, ensuring Anti-Money Laundering (AML) and Counter-Terrorism Financing policies were aligned with applicable regulations.",
          category: "تحديثات قانونية",
          categoryEn: "Legal Updates",
          imageUrl: "/images/saudi-legal-default.jpg",
          published: true,
          views: 0,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          title: "تطوير معايير \"اعرف عميلك\" لشركة بازيد للصرافة",
          titleEn: "Enhancing KYC Standards for Bazid Exchange",
          excerpt: "تعزيز معايير الامتثال لشركة بازيد للصرافة عبر تطوير سياسات KYC.",
          excerptEn: "Strengthening compliance for Bazid Exchange through advanced KYC policies.",
          content: "أجرت شركة بازيد للصرافة إجراءات تطوير معايير \"اعرف عميلك\" (KYC) وخطط الامتثال المرتبطة بها، بما يتماشى مع أفضل الممارسات المحلية والدولية.",
          contentEn: "Bazid Exchange undertook measures to enhance \"Know Your Customer\" (KYC) standards and related compliance plans, aligning with both local and international best practices.",
          category: "تحديثات قانونية",
          categoryEn: "Legal Updates",
          imageUrl: "/images/saudi-legal-default.jpg",
          published: true,
          views: 0,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: randomUUID(),
          title: "إنجازات قانونية لشركة عبدالرحمن الشرهان وشركاه للصرافة",
          titleEn: "Legal Achievements for Abdulrahman Al-Sharhan & Partners Exchange",
          excerpt: "إدارة متكاملة للشؤون القانونية والنزاعات وعقود الموظفين لصالح شركة الشرهان للصرافة.",
          excerptEn: "Comprehensive legal management of disputes and employment contracts for Al-Sharhan Exchange.",
          content: "تولت الشركة إدارة الشؤون القانونية وصياغة عقد Global Blue بما يتوافق مع الأنظمة المحلية والدولية، إضافة إلى معالجة النزaعات التجارية وإعداد مذكرات رد مدعمة بالأحكام القضائية. كما قامت بإدارة عقود الموظفين وإعداد السياسات الداخلية للموارد البشرية بما يتفق مع تشريعات العمل السعودية. كذلك قدّمت المشورة بشأن تسويات الموظفين والنزاعات العمالية أمام المحاكم، وشاركت في مباحثات تسويات استراتيجية مع جهات محلية وعالمية. ومن أبرز الإنجازات إسقاط دعوى ضريبية بقيمة 1.4 مليون ريال في مرحلة الاستئناف.",
          contentEn: "The firm managed all legal affairs, including drafting and reviewing the Global Blue contract to align with local and international laws, handling commercial disputes, and preparing defense memoranda supported by judicial rulings. It also managed employment contracts at all levels, developed HR policies in line with Saudi labor regulations, and provided advice on employee settlements and labor disputes before the courts. Strategic settlement negotiations were conducted with local and international parties. A key achievement was the dismissal of a SAR 1.4 million tax claim at the appeal stage.",
          category: "قرارات قضائية",
          categoryEn: "Judicial Decisions",
          imageUrl: "/images/saudi-legal-default.jpg",
          published: true,
          views: 0,
          publishedAt: new Date(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      await this.writeFile(this.newsArticlesFile, defaultArticles);
    }
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const users = await this.readFile<User>(this.usersFile);
    return users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const users = await this.readFile<User>(this.usersFile);
    return users.find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const users = await this.readFile<User>(this.usersFile);
    return users.find(user => user.email === email);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const users = await this.readFile<User>(this.usersFile);
    const user: User = {
      ...insertUser,
      id: randomUUID(),
      role: insertUser.role || "admin",
      createdAt: new Date(),
    };
    users.push(user);
    await this.writeFile(this.usersFile, users);
    return user;
  }

  // News article methods
  async getNewsArticles(options?: { published?: boolean; limit?: number; offset?: number }): Promise<NewsArticle[]> {
    let articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    
    if (options?.published !== undefined) {
      articles = articles.filter(article => article.published === options.published);
    }
    
    // Sort by publishedAt descending
    articles.sort((a, b) => {
      const dateA = new Date(a.publishedAt || a.createdAt);
      const dateB = new Date(b.publishedAt || b.createdAt);
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
    const articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    return articles.find(article => article.id === id);
  }

  async createNewsArticle(insertArticle: InsertNewsArticle): Promise<NewsArticle> {
    const articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    const now = new Date();
    const article: NewsArticle = {
      ...insertArticle,
      id: randomUUID(),
      views: 0,
      published: insertArticle.published || false,
      titleEn: insertArticle.titleEn || null,
      excerptEn: insertArticle.excerptEn || null,
      contentEn: insertArticle.contentEn || null,
      categoryEn: insertArticle.categoryEn || null,
      imageUrl: insertArticle.imageUrl || "/images/saudi-legal-default.jpg",
      publishedAt: insertArticle.published ? now : null,
      createdAt: now,
      updatedAt: now,
    };
    articles.push(article);
    await this.writeFile(this.newsArticlesFile, articles);
    return article;
  }

  async updateNewsArticle(id: string, updateData: Partial<InsertNewsArticle>): Promise<NewsArticle | undefined> {
    const articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    const index = articles.findIndex(article => article.id === id);
    if (index === -1) return undefined;
    
    const existing = articles[index];
    const updated: NewsArticle = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
      publishedAt: updateData.published && !existing.published ? new Date() : new Date(existing.publishedAt || existing.createdAt),
    };
    
    articles[index] = updated;
    await this.writeFile(this.newsArticlesFile, articles);
    return updated;
  }

  async deleteNewsArticle(id: string): Promise<boolean> {
    const articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    const initialLength = articles.length;
    const filtered = articles.filter(article => article.id !== id);
    
    if (filtered.length === initialLength) return false;
    
    await this.writeFile(this.newsArticlesFile, filtered);
    return true;
  }

  async incrementNewsViews(id: string): Promise<void> {
    const articles = await this.readFile<NewsArticle>(this.newsArticlesFile);
    const index = articles.findIndex(article => article.id === id);
    if (index !== -1) {
      articles[index] = { ...articles[index], views: articles[index].views + 1 };
      await this.writeFile(this.newsArticlesFile, articles);
    }
  }

  // Contact message methods
  async getContactMessages(options?: { isRead?: boolean; limit?: number; offset?: number }): Promise<ContactMessage[]> {
    let messages = await this.readFile<ContactMessage>(this.contactMessagesFile);
    
    if (options?.isRead !== undefined) {
      messages = messages.filter(message => message.isRead === options.isRead);
    }
    
    // Sort by createdAt descending
    messages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    if (options?.offset) {
      messages = messages.slice(options.offset);
    }
    
    if (options?.limit) {
      messages = messages.slice(0, options.limit);
    }
    
    return messages;
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const messages = await this.readFile<ContactMessage>(this.contactMessagesFile);
    return messages.find(message => message.id === id);
  }

  async createContactMessage(insertMessage: InsertContactMessage): Promise<ContactMessage> {
    const messages = await this.readFile<ContactMessage>(this.contactMessagesFile);
    const message: ContactMessage = {
      ...insertMessage,
      id: randomUUID(),
      isRead: false,
      repliedAt: null,
      createdAt: new Date(),
    };
    messages.push(message);
    await this.writeFile(this.contactMessagesFile, messages);
    return message;
  }

  async markMessageAsRead(id: string): Promise<boolean> {
    const messages = await this.readFile<ContactMessage>(this.contactMessagesFile);
    const index = messages.findIndex(message => message.id === id);
    if (index === -1) return false;
    
    messages[index] = { ...messages[index], isRead: true };
    await this.writeFile(this.contactMessagesFile, messages);
    return true;
  }

  async deleteContactMessage(id: string): Promise<boolean> {
    const messages = await this.readFile<ContactMessage>(this.contactMessagesFile);
    const initialLength = messages.length;
    const filtered = messages.filter(message => message.id !== id);
    
    if (filtered.length === initialLength) return false;
    
    await this.writeFile(this.contactMessagesFile, filtered);
    return true;
  }
}

export const storage = new FileStorage();