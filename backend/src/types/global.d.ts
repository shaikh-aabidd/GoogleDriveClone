import type { Multer } from "multer";
import { RequestHandler } from 'express';

declare module 'xss-clean' {
  const xss: RequestHandler;
  export = xss;
}

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PORT: string;
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
  }
  
  namespace Express {
    interface Request {
      user?: {
        userId: number;
        email: string;
      };
      file?: Multer.File;
    }
  }
}

export {};