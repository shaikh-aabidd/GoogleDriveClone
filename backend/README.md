# Google Drive Clone Backend

A modern Google Drive clone backend built with Node.js, Express, TypeScript, and Supabase.

## Features

- 🔐 User authentication with JWT
- 📧 Email verification with OTP
- 📁 File upload and management
- 📂 Folder creation and organization
- 🔍 File search functionality
- 💾 Storage management with limits
- 🛡️ Security features (rate limiting, XSS protection, etc.)
- 📝 Full TypeScript support with strict type checking

## Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: Supabase (PostgreSQL)
- **Storage**: Supabase Storage
- **Authentication**: JWT
- **Email**: Nodemailer
- **Security**: Helmet, XSS Clean, Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account
- Gmail account (for email service)

## Setup Instructions

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Supabase Setup

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Get your project URL and anon key from Settings > API
3. Create the following tables in your Supabase database:

#### Users Table
```sql
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  storage_used BIGINT DEFAULT 0,
  storage_limit BIGINT DEFAULT 16106127360, -- 15GB in bytes
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Files Table
```sql
CREATE TABLE files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size BIGINT DEFAULT 0,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  parent_folder_id UUID REFERENCES files(id) ON DELETE CASCADE,
  file_path VARCHAR(500),
  is_folder BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### OTPs Table
```sql
CREATE TABLE otps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3. Supabase Storage Setup

1. Go to Storage in your Supabase dashboard
2. Create a new bucket called `files`
3. Set the bucket to private
4. Create a storage policy for authenticated users:

```sql
CREATE POLICY "Users can upload files" ON storage.objects
FOR INSERT WITH CHECK (auth.uid()::text = (storage.foldername(name))[1]);
```

```sql
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (auth.uid()::text = (storage.foldername(name))[1]);
```

```sql
CREATE POLICY "Users can update their own files" ON storage.objects
FOR UPDATE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

```sql
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (auth.uid()::text = (storage.foldername(name))[1]);
```

### 4. Environment Variables

Create a `.env` file in the backend directory:

```env
# Server Configuration
PORT=8000
NODE_ENV=development

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_EXPIRY=7d

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
```

### 5. Gmail App Password Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an app password:
   - Go to Google Account settings
   - Security > 2-Step Verification > App passwords
   - Generate a new app password for "Mail"
3. Use this password in your `EMAIL_PASSWORD` environment variable

### 6. Run the Server

```bash
# Development (with hot reload)
npm run dev

# Build for production
npm run build

# Production
npm start
```

## TypeScript Features

- **Strict Type Checking**: Full TypeScript configuration with strict mode enabled
- **Type Safety**: All models, controllers, and utilities are fully typed
- **IntelliSense**: Complete IDE support with autocomplete and error detection
- **Compile-time Error Detection**: Catch errors before runtime
- **Interface Definitions**: Comprehensive type definitions for all data structures

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/verify-email` - Verify email with OTP
- `POST /api/v1/auth/resend-otp` - Resend OTP
- `POST /api/v1/auth/login` - Login user
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/refresh-token` - Refresh access token
- `GET /api/v1/auth/me` - Get current user (protected)

### Files
- `POST /api/v1/files/upload` - Upload a file (protected)
- `POST /api/v1/files/folder` - Create a folder (protected)
- `GET /api/v1/files` - Get files/folders (protected)
- `GET /api/v1/files/download/:fileId` - Download a file (protected)
- `DELETE /api/v1/files/:fileId` - Delete file/folder (protected)
- `PATCH /api/v1/files/:fileId/rename` - Rename file/folder (protected)
- `GET /api/v1/files/search` - Search files (protected)
- `GET /api/v1/files/storage-info` - Get storage info (protected)

### Health Check
- `GET /health` - Server health check

## File Structure

```
backend/
├── src/
│   ├── controllers/
│   │   ├── auth.controller.ts
│   │   └── file.controller.ts
│   ├── db/
│   │   └── index.ts
│   ├── middlewares/
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── multer.middleware.ts
│   ├── models/
│   │   ├── user.model.ts
│   │   ├── file.model.ts
│   │   └── otp.model.ts
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   └── file.routes.ts
│   ├── services/
│   │   └── emailService.ts
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── ApiError.ts
│   │   ├── ApiResponse.ts
│   │   └── asyncHandler.ts
│   ├── app.ts
│   └── index.ts
├── dist/           # Compiled JavaScript output
├── package.json
├── tsconfig.json   # TypeScript configuration
└── README.md
```

## TypeScript Configuration

The project uses a strict TypeScript configuration with:

- **Target**: ES2022
- **Module**: ESNext
- **Strict Mode**: Enabled
- **Null Checks**: Enabled
- **No Implicit Any**: Enabled
- **Source Maps**: Enabled for debugging
- **Declaration Files**: Generated for better IDE support

## Development Workflow

1. **Development**: Use `npm run dev` for hot reloading with tsx
2. **Building**: Use `npm run build` to compile TypeScript to JavaScript
3. **Production**: Use `npm start` to run the compiled JavaScript
4. **Testing**: Use `npm test` to run TypeScript tests with Jest

## Security Features

- Rate limiting to prevent abuse
- XSS protection
- Secure headers with Helmet
- JWT-based authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation and sanitization
- Type-safe request/response handling

## Storage Limits

- Default storage limit: 15GB per user
- File size limits can be configured in multer middleware
- Storage usage is tracked and enforced

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper TypeScript types
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
