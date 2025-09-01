import type { Multer } from "multer";

declare global {
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

export {}; // 👈 very important to make this a module, prevents clobbering "express"
