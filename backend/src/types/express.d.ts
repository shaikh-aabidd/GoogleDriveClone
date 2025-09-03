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

export {};