/**
 * TypeScript declaration file for db-connector.js
 */

export interface User {
  id: number;
  email: string;
  username: string;
  name: string;
  password_hash: string;
  google_id: string | null;
  created_at: string;
  updated_at: string;
  last_login_at: string | null;
  is_active: number;
}

export interface VocabularyItem {
  id: number;
  category_id: number;
  turkish_text: string;
  english_text: string;
  arabic_text: string;
  turkish_pronunciation: string;
  english_definition: string;
  word_type: string;
  difficulty_level: string;
  example_sentence_tr: string;
  example_sentence_en: string;
  example_sentence_ar: string;
  audio_url: string;
  image_url: string;
  svg_icon: string;
  frequency_score: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  name_tr: string;
  description: string;
  description_tr: string;
  icon: string;
  color: string;
  sort_order: number;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface UserStats {
  user_id: number;
  total_xp: number;
  level: number;
  coins: number;
  updated_at: string;
}

export interface UserVocabularyProgress {
  user_id: number;
  vocabulary_id: number;
  familiarity: number;
  correct_count: number;
  incorrect_count: number;
  last_seen_at: string;
}

export interface LearningSession {
  id: number;
  user_id: number;
  session_type: string;
  category_id: number;
  total_questions: number;
  correct_answers: number;
  incorrect_answers: number;
  accuracy_percentage: number;
  duration_seconds: number;
  xp_earned: number;
  coins_earned: number;
  started_at: string;
  completed_at: string | null;
}

export function getDatabase(): Promise<any>;
export function query(sql: string, params?: any[]): Promise<any>;
export function get(sql: string, params?: any[]): Promise<any>;
export function all(sql: string, params?: any[]): Promise<any>;
export function run(sql: string, params?: any[]): Promise<any>;
export function close(): Promise<void>;

export const User: {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(userData: Partial<User>): Promise<number>;
  updateLastLogin(userId: number): Promise<any>;
};

export const Vocabulary: {
  getByCategory(categoryId: number, limit?: number): Promise<VocabularyItem[]>;
  getRandom(limit?: number): Promise<VocabularyItem[]>;
  search(searchTerm: string): Promise<VocabularyItem[]>;
};

export const Category: {
  getAll(): Promise<Category[]>;
  getById(id: number): Promise<Category | null>;
};

export const Progress: {
  getUserStats(userId: number): Promise<UserStats>;
  updateUserStats(userId: number, updates: Partial<UserStats>): Promise<any>;
  getVocabularyProgress(userId: number, vocabularyId: number): Promise<UserVocabularyProgress | null>;
  updateVocabularyProgress(userId: number, vocabularyId: number, progress: Partial<UserVocabularyProgress>): Promise<any>;
};

export const Session: {
  create(sessionData: Partial<LearningSession>): Promise<number>;
  complete(sessionId: number, completionData: Partial<LearningSession>): Promise<any>;
  getUserSessions(userId: number, limit?: number): Promise<LearningSession[]>;
};

export const DB_PATH: string;