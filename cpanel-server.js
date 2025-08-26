const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'your-secret-key-2024-firdous-law-firm';

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// Helper functions for file operations
async function readJsonFile(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

async function writeJsonFile(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
  }
}

// Initialize data files
async function initializeData() {
  const dataDir = path.join(__dirname, 'data');
  
  // Create data directory if it doesn't exist
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory already exists
  }

  const usersFile = path.join(dataDir, 'users.json');
  const newsFile = path.join(dataDir, 'news-articles.json');
  const contactFile = path.join(dataDir, 'contact-messages.json');

  // Initialize files if they don't exist
  try {
    await fs.access(usersFile);
  } catch {
    const adminPassword = await bcrypt.hash('admin123', 10);
    const defaultUsers = [{
      id: randomUUID(),
      username: 'admin',
      email: 'admin@firdouslaw.sa',
      password: adminPassword,
      role: 'admin',
      createdAt: new Date().toISOString()
    }];
    await writeJsonFile(usersFile, defaultUsers);
  }

  try {
    await fs.access(newsFile);
  } catch {
    await writeJsonFile(newsFile, []);
  }

  try {
    await fs.access(contactFile);
  } catch {
    await writeJsonFile(contactFile, []);
  }
}

// Authentication middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

// Routes

// Auth routes
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const users = await readJsonFile(path.join(__dirname, 'data', 'users.json'));
    
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, user: { id: user.id, username: user.username, role: user.role } });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// News routes
app.get('/api/news', async (req, res) => {
  try {
    const articles = await readJsonFile(path.join(__dirname, 'data', 'news-articles.json'));
    res.json(articles);
  } catch (error) {
    console.error('Error fetching news:', error);
    res.status(500).json({ error: 'Failed to fetch news' });
  }
});

app.post('/api/news', authenticateToken, async (req, res) => {
  try {
    const articles = await readJsonFile(path.join(__dirname, 'data', 'news-articles.json'));
    
    const newArticle = {
      id: randomUUID(),
      ...req.body,
      imageUrl: req.body.imageUrl || '/images/saudi-legal-default.jpg',
      published: req.body.published || false,
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: req.body.published ? new Date().toISOString() : null
    };

    articles.unshift(newArticle);
    await writeJsonFile(path.join(__dirname, 'data', 'news-articles.json'), articles);
    
    res.status(201).json(newArticle);
  } catch (error) {
    console.error('Error creating news article:', error);
    res.status(500).json({ error: 'Failed to create article' });
  }
});

app.put('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await readJsonFile(path.join(__dirname, 'data', 'news-articles.json'));
    
    const articleIndex = articles.findIndex(a => a.id === id);
    if (articleIndex === -1) {
      return res.status(404).json({ error: 'Article not found' });
    }

    const updatedArticle = {
      ...articles[articleIndex],
      ...req.body,
      updatedAt: new Date().toISOString(),
      publishedAt: req.body.published && !articles[articleIndex].published 
        ? new Date().toISOString() 
        : articles[articleIndex].publishedAt
    };

    articles[articleIndex] = updatedArticle;
    await writeJsonFile(path.join(__dirname, 'data', 'news-articles.json'), articles);
    
    res.json(updatedArticle);
  } catch (error) {
    console.error('Error updating news article:', error);
    res.status(500).json({ error: 'Failed to update article' });
  }
});

app.delete('/api/news/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const articles = await readJsonFile(path.join(__dirname, 'data', 'news-articles.json'));
    
    const filteredArticles = articles.filter(a => a.id !== id);
    if (filteredArticles.length === articles.length) {
      return res.status(404).json({ error: 'Article not found' });
    }

    await writeJsonFile(path.join(__dirname, 'data', 'news-articles.json'), filteredArticles);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting news article:', error);
    res.status(500).json({ error: 'Failed to delete article' });
  }
});

// Contact routes
app.get('/api/contact', authenticateToken, async (req, res) => {
  try {
    const messages = await readJsonFile(path.join(__dirname, 'data', 'contact-messages.json'));
    res.json(messages);
  } catch (error) {
    console.error('Error fetching contact messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

app.post('/api/contact', async (req, res) => {
  try {
    const messages = await readJsonFile(path.join(__dirname, 'data', 'contact-messages.json'));
    
    const newMessage = {
      id: randomUUID(),
      ...req.body,
      read: false,
      createdAt: new Date().toISOString()
    };

    messages.unshift(newMessage);
    await writeJsonFile(path.join(__dirname, 'data', 'contact-messages.json'), messages);
    
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error creating contact message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
});

app.put('/api/contact/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readJsonFile(path.join(__dirname, 'data', 'contact-messages.json'));
    
    const messageIndex = messages.findIndex(m => m.id === id);
    if (messageIndex === -1) {
      return res.status(404).json({ error: 'Message not found' });
    }

    messages[messageIndex] = { ...messages[messageIndex], ...req.body };
    await writeJsonFile(path.join(__dirname, 'data', 'contact-messages.json'), messages);
    
    res.json(messages[messageIndex]);
  } catch (error) {
    console.error('Error updating contact message:', error);
    res.status(500).json({ error: 'Failed to update message' });
  }
});

app.delete('/api/contact/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const messages = await readJsonFile(path.join(__dirname, 'data', 'contact-messages.json'));
    
    const filteredMessages = messages.filter(m => m.id !== id);
    if (filteredMessages.length === messages.length) {
      return res.status(404).json({ error: 'Message not found' });
    }

    await writeJsonFile(path.join(__dirname, 'data', 'contact-messages.json'), filteredMessages);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contact message:', error);
    res.status(500).json({ error: 'Failed to delete message' });
  }
});

// Serve React app for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Initialize and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Firdous Law Firm server running on port ${PORT}`);
    console.log(`📱 Website: http://localhost:${PORT}`);
    console.log(`🔐 Admin: http://localhost:${PORT}/admin`);
    console.log(`👤 Login: admin / admin123`);
  });
}).catch(error => {
  console.error('Failed to initialize server:', error);
});