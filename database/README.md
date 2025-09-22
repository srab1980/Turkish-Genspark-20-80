# Turkish Learning App - Database Setup

This directory contains the complete MySQL database schema and setup utilities for the Turkish Learning Application.

## 📋 Database Overview

The database is designed to support a comprehensive language learning application with the following features:

- **User Management**: Registration, authentication, profiles, and preferences
- **Learning Content**: Vocabulary, lessons, categories with Turkish-English translations
- **Progress Tracking**: Detailed learning analytics and spaced repetition
- **Gamification**: XP system, achievements, leaderboards, and user statistics
- **Session Management**: Learning sessions, quiz responses, and time tracking

## 🗄️ Database Schema

### Core Tables

- **users** - User accounts and profiles
- **categories** - Learning content categories (Greetings, Family, etc.)
- **vocabulary** - Turkish-English word pairs with metadata
- **lessons** - Structured learning lessons

### Progress Tracking

- **user_vocabulary_progress** - Individual word learning progress
- **user_lesson_progress** - Lesson completion tracking
- **learning_sessions** - Learning session records
- **session_responses** - Detailed question responses

### Gamification

- **user_stats** - User statistics and metrics
- **achievements** - Available achievements
- **user_achievements** - User achievement progress
- **leaderboards** - Ranking and competition data

### System Tables

- **user_sessions** - JWT session management
- **password_reset_tokens** - Password reset functionality
- **app_settings** - Application configuration
- **activity_logs** - System activity monitoring

## 🚀 Quick Start

### 1. Prerequisites

- MySQL 8.0+ installed and running
- Node.js 18+ installed
- npm or yarn package manager

### 2. Database Configuration

1. Create a MySQL database:
```sql
CREATE DATABASE turkish_learning_app CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Update your `.env` file:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=turkish_learning_app
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Initialize Database

```bash
# Check database connection
npm run db:check

# Initialize database with schema and sample data
npm run db:init

# Reset database (development only)
npm run db:reset
```

## 📊 Sample Data

The database comes pre-loaded with:

- **10 categories**: Greetings, Family, Food & Drink, Numbers, Colors, Time, Travel, Shopping, Work, Daily Life
- **25+ vocabulary words**: Basic Turkish words with English translations
- **5 lessons**: Beginner-level lessons for each category
- **10 achievements**: Bronze to Platinum level achievements
- **App settings**: Default configuration values

## 🔧 Database Operations

### Connection Management

```typescript
import { executeQuery, findById, insert, updateById } from './src/database/db.js';

// Execute raw query
const users = await executeQuery('SELECT * FROM users WHERE is_active = ?', [true]);

// Find by ID
const user = await findById('users', 123);

// Insert new record
const userId = await insert('users', { email: 'user@example.com', name: 'John Doe' });

// Update record
await updateById('users', 123, { last_login_at: new Date() });
```

### User Operations

```typescript
import { UserDB } from './src/database/db.js';

// Find user by email
const user = await UserDB.findByEmail('user@example.com');

// Create new user
const userId = await UserDB.createUser({
    email: 'user@example.com',
    name: 'John Doe',
    username: 'johndoe'
});
```

### Progress Tracking

```typescript
import { ProgressDB } from './src/database/db.js';

// Get user stats
const stats = await ProgressDB.getUserStats(userId);

// Update vocabulary progress
await ProgressDB.updateVocabularyProgress(userId, vocabularyId, {
    mastery_level: 'familiar',
    confidence_score: 0.75,
    times_correct: 5
});
```

## 🛡️ Security Considerations

- **Password Hashing**: User passwords are hashed using bcrypt
- **JWT Tokens**: Session management with secure JWT tokens
- **SQL Injection**: All queries use parameterized statements
- **Data Validation**: Input validation at application level
- **Environment Variables**: Sensitive data in environment variables

## 📈 Performance Optimization

- **Indexes**: Optimized indexes on frequently queried columns
- **Connection Pooling**: MySQL connection pooling for efficiency
- **Soft Deletes**: Non-destructive data deletion with `is_active` flags
- **Pagination**: Built-in pagination for large datasets

## 🔄 Backup and Migration

### Backup Database

```bash
# Create backup using mysqldump
mysqldump -u root -p turkish_learning_app > backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore from backup
mysql -u root -p turkish_learning_app < backup_file.sql
```

## 🐛 Troubleshooting

### Common Issues

1. **Connection Error**: Check MySQL service is running and credentials are correct
2. **Character Encoding**: Ensure database uses `utf8mb4` for Turkish character support
3. **Permission Denied**: Verify MySQL user has necessary privileges
4. **Port Conflicts**: Check if MySQL is running on the expected port (3306)

### Debug Mode

Enable debug logging by setting:
```env
NODE_ENV=development
```

## 📚 Additional Resources

- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Turkish Language Learning Resources](https://github.com/topics/turkish-language)
- [Spaced Repetition Algorithm](https://en.wikipedia.org/wiki/Spaced_repetition)

## 🤝 Contributing

When adding new features:

1. Update the schema in `database/schema.sql`
2. Add corresponding TypeScript types
3. Update migration scripts
4. Add sample data if applicable
5. Update this documentation

---

**Note**: This database schema is designed for educational purposes and includes comprehensive features for a language learning application. Adjust according to your specific requirements and scale.