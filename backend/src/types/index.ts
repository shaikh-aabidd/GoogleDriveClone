import type { Request } from 'express';

// User Types
export interface User {
  id: number;  // int8
  email: string;
  password: string;
  full_name: string;
  is_verified: boolean;
  storage_used: number;   // int8
  storage_limit: number;  // int8
  created_at: string;     // timestamptz
  updated_at: string;     // timestamptz
}

export interface CreateUserData {
  email: string;
  password: string;
  fullName: string;
}

export interface UserWithoutPassword extends Omit<User, 'password'> {}

// File Types
export interface File {
  id: number;  
  name: string;
  original_name: string;
  mime_type: string;
  size: number;  
  user_id: number;  
  parent_folder_id: number | null;  
  file_path: string | null;
  is_folder: boolean;
  created_at: string;
  updated_at: string;  
}

export interface CreateFileData {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  userId: number;
  parentFolderId?: number | null;
  filePath?: string | null;
  isFolder?: boolean;
}

export interface UpdateFileData {
  name?: string;
  [key: string]: any;
}

// OTP Types
export interface OTPRecord {
  id: number;  
  email: string;
  otp: string;
  expires_at: string;
  created_at: string;
}

export interface OTPVerificationResult {
  valid: boolean;
  message: string;
}

// JWT Types
export interface JWTPayload {
  userId: number;
  email: string;
}

export interface RefreshTokenPayload {
  userId: number;  // fixed
}

// Request Types
export interface AuthenticatedRequest extends Request {
  user: JWTPayload;
}

// API Response Types
export interface ApiResponseData<T = any> {
  statusCode: number;
  data: T;
  message: string;
  success: boolean;
}

// Storage Types
export interface StorageInfo {
  used: number;
  limit: number;
  percentage: number;
}

// Email Types
export interface EmailOptions {
  from: string;
  to: string;
  subject: string;
  html: string;
}

// Environment Variables
export interface EnvironmentVariables {
  PORT: string;
  NODE_ENV: string;
  CORS_ORIGIN: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRY: string;
  REFRESH_TOKEN_EXPIRY: string;
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  EMAIL_USER: string;
  EMAIL_PASSWORD: string;
}

// Supabase Types
export interface SupabaseConfig {
  url: string;
  key: string;
}

// File Upload Types
export interface FileUploadData {
  parentFolderId?: number | null;  // fixed
}

// Folder Creation Types
export interface FolderCreationData {
  name: string;
  parentFolderId?: number | null;  // fixed
}

// File Rename Types
export interface FileRenameData {
  newName: string;
}

// Search Types
export interface SearchQuery {
  query: string;
}

// Pagination Types
export interface PaginationOptions {
  page?: number;
  limit?: number;
}

// Error Types
export interface ApiErrorData {
  statusCode: number;
  message: string;
  errors?: any[];
  stack?: string;
}


export interface FileShare {
  id: number;
  created_at: string;
  item_type: 'file' | 'folder';
  item_id: number;
  shared_with: number; // or string if using email
  permission: 'view' | 'edit';
}

export interface CreateFileShareData {
  itemType: 'file' | 'folder';
  itemId: number;
  sharedWith: number; // or string
  permission: 'view' | 'edit';
}

export interface UpdateFileShareData {
  permission?: 'view' | 'edit';
}

