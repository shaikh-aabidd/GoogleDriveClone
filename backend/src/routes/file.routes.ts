import { Router } from "express";
import {
  uploadFile,
  createFolder,
  getFiles,
  downloadFile,
  deleteFile,
  renameFile,
  searchFiles,
  getStorageInfo
} from "../controllers/file.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Apply authentication middleware to all routes
router.use(verifyJWT);

// File operations
router.post("/upload", upload.single("file"), uploadFile);
router.post("/folder", createFolder);
router.get("/", getFiles);
router.get("/download/:fileId", downloadFile);
router.delete("/:fileId", deleteFile);
router.patch("/:fileId/rename", renameFile);
router.get("/search", searchFiles);
router.get("/storage-info", getStorageInfo);

export default router;
