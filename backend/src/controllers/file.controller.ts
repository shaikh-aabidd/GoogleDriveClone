import { Request, Response } from "express";
import { FileModel } from "../models/file.model.js";
import { UserModel } from "../models/user.model.js";
import { supabase } from "../db/index.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  AuthenticatedRequest,
  CreateFileData,
  File,
  StorageInfo,
} from "../types/index.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import { FileShareModel } from "../models/fileShare.model.js";

// Upload File
const uploadFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { parentFolderId } = req.body;
  const userId: number = req.user.userId; // ✅ ensure number

  if (!req.file) {
    throw new ApiError(400, "No file uploaded");
  }

  // Check user storage limit
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const currentStorageUsed = await FileModel.getStorageUsed(userId);
  const newStorageUsed = currentStorageUsed + req.file.size;

  if (newStorageUsed > user.storage_limit) {
    throw new ApiError(400, "Storage limit exceeded");
  }

  // Generate unique filename
  const fileExtension = path.extname(req.file.originalname);
  const fileName = `${uuidv4()}${fileExtension}`;
  const filePath = `users/${userId}/files/${fileName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("files")
    .upload(filePath, req.file.buffer, {
      contentType: req.file.mimetype,
      cacheControl: "3600",
    });

    console.log(uploadError)

  if (uploadError) {
    throw new ApiError(500, "Error uploading file to storage");
  }

  // Create file record in database
  const fileData: CreateFileData = {
    name: req.file.originalname,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
    userId,
    parentFolderId: parentFolderId ? Number(parentFolderId) : null, // ✅ convert properly
    filePath,
    isFolder: false,
  };

  const file = await FileModel.create(fileData);

  // Update user storage used
  await UserModel.updateStorageUsed(userId, newStorageUsed);

  return res
    .status(201)
    .json(new ApiResponse(201, file, "File uploaded successfully"));
});

// Create Folder
const createFolder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { name, parentFolderId } = req.body;
  const userId: number = req.user.userId;

  if (!name) {
    throw new ApiError(400, "Folder name is required");
  }

  // Check if folder with same name exists in same location
  const existingFiles = await FileModel.findByUserId(
    userId,
    parentFolderId ? Number(parentFolderId) : null
  );
  const folderExists = existingFiles.some(
    (file) => file.is_folder && file.name.toLowerCase() === name.toLowerCase()
  );

  if (folderExists) {
    throw new ApiError(409, "Folder with this name already exists");
  }

  const folderData: CreateFileData = {
    name,
    originalName: name,
    mimeType: "application/x-directory",
    size: 0,
    userId,
    parentFolderId: parentFolderId ? Number(parentFolderId) : null,
    filePath: null,
    isFolder: true,
  };

  const folder = await FileModel.create(folderData);

  return res
    .status(201)
    .json(new ApiResponse(201, folder, "Folder created successfully"));
});

// Get Files
const getFiles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { parentFolderId } = req.query;
  const userId: number = req.user.userId;

  const files = await FileModel.findByUserId(
    userId,
    parentFolderId ? Number(parentFolderId) : null
  );

  return res
    .status(200)
    .json(new ApiResponse(200, files, "Files fetched successfully"));
});

// Download File
const downloadFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const fileId = Number(req.params.fileId); // ✅ ensure number
  const userId: number = req.user.userId;

  const file = await FileModel.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.user_id !== userId) {
    throw new ApiError(403, "Access denied");
  }

  if (file.is_folder) {
    throw new ApiError(400, "Cannot download a folder");
  }

  // Get file from Supabase Storage
  const { data, error } = await supabase.storage
    .from("files")
    .download(file.file_path!);

  if (error) {
    throw new ApiError(500, "Error downloading file");
  }

  const arrayBuffer = await data.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  res.setHeader("Content-Type", file.mime_type);
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="${file.original_name}"`
  );
  res.send(buffer);
});

// Delete File/Folder
const deleteFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const fileId = Number(req.params.fileId); // ✅ ensure number
  const userId: number = req.user.userId;

  const file = await FileModel.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.user_id !== userId) {
    throw new ApiError(403, "Access denied");
  }

  // If it's a folder, check if it's empty
  if (file.is_folder) {
    const folderContents = await FileModel.findByUserId(userId, fileId);
    if (folderContents.length > 0) {
      throw new ApiError(400, "Cannot delete non-empty folder");
    }
  } else {
    // Delete from Supabase Storage
    const { error: storageError } = await supabase.storage
      .from("files")
      .remove([file.file_path!]);

    if (storageError) {
      console.error("Error deleting from storage:", storageError);
    }
  }

  // Delete from database
  await FileModel.delete(fileId);

  // Update user storage if it's a file
  if (!file.is_folder) {
    const currentStorageUsed = await FileModel.getStorageUsed(userId);
    await UserModel.updateStorageUsed(userId, currentStorageUsed);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "File deleted successfully"));
});

// Rename File/Folder
const renameFile = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const fileId = Number(req.params.fileId); // ✅ ensure number
  const { newName } = req.body;
  const userId: number = req.user.userId;

  if (!newName) {
    throw new ApiError(400, "New name is required");
  }

  const file = await FileModel.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  if (file.user_id !== userId) {
    throw new ApiError(403, "Access denied");
  }

  // Check if name already exists in same location
  const existingFiles = await FileModel.findByUserId(
    userId,
    file.parent_folder_id
  );
  const nameExists = existingFiles.some(
    (existingFile) =>
      existingFile.id !== fileId &&
      existingFile.name.toLowerCase() === newName.toLowerCase()
  );

  if (nameExists) {
    throw new ApiError(409, "File with this name already exists");
  }

  const updatedFile = await FileModel.update(fileId, { name: newName });

  return res
    .status(200)
    .json(new ApiResponse(200, updatedFile, "File renamed successfully"));
});

// Search Files
const searchFiles = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const { query } = req.query;
  const userId: number = req.user.userId;

  if (!query) {
    throw new ApiError(400, "Search query is required");
  }

  const files = await FileModel.searchFiles(userId, query as string);

  return res
    .status(200)
    .json(new ApiResponse(200, files, "Search completed successfully"));
});

// Get Storage Info
const getStorageInfo = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const userId: number = req.user.userId;

  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const storageUsed = await FileModel.getStorageUsed(userId);

  const storageInfo: StorageInfo = {
    used: storageUsed,
    limit: user.storage_limit,
    percentage: Math.round((storageUsed / user.storage_limit) * 100),
  };

  return res
    .status(200)
    .json(new ApiResponse(200, storageInfo, "Storage info fetched successfully"));
});


const shareFileWithEmail = async (req:AuthenticatedRequest, res:Response) => {
  try {
    const { fileId, email, permission } = req.body;

    if (!fileId || !email) {
      return res.status(400).json({ error: "fileId and email are required" });
    }

    // check if file exists
    const { data: file, error: fileError } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fileError || !file) {
      return res.status(404).json({ error: "File not found" });
    }

    // insert into shared_items
    const { data, error } = await supabase
      .from("shares")
      .insert([
        {
          item_type: "file",
          item_id: fileId,
          shared_with: email,
          permission: permission || "read", // default read-only
        },
      ])
      .select();

    if (error) throw error;

    return res.status(201).json({ message: "File shared successfully", data });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};

/**
 * Generate a public sharable link for a file
 */
const generateSharableLink = async (req:AuthenticatedRequest, res:Response) => {
  try {
    const { fileId, permission } = req.body;

    if (!fileId) {
      return res.status(400).json({ error: "fileId is required" });
    }

    // check if file exists
    const { data: file, error: fileError } = await supabase
      .from("files")
      .select("*")
      .eq("id", fileId)
      .single();

    if (fileError || !file) {
      return res.status(404).json({ error: "File not found" });
    }

    // generate unique token
    const token = uuidv4();

    // store in shared_items table
    const { data, error } = await supabase
      .from("shares")
      .insert([
        {
          item_type: "file",
          item_id: fileId,
          shared_token: token, // storing token instead of email
          permission: permission || "read",
        },
      ])
      .select();

    if (error) throw error;

    // generate public URL (frontend can handle opening via /share/:token)
    const sharableLink = `${process.env.CORS_ORIGIN}/share/${token}`;

    return res
      .status(201)
      .json({ message: "Sharable link created", link: sharableLink });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
};


const getSharedFile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { token } = req.params;

    // 1. Find the share record
    const { data: shareRecord, error: shareError } = await supabase
      .from("shares")
      .select("item_id")
      .eq("shared_token", token.trim()) // make sure no spaces
      .single();


    if (shareError || !shareRecord) {
      return res.status(404).json({ error: "Invalid or expired link" });
    }

    // 2. Check expiry
    // if (shareRecord.expires_at && new Date(shareRecord.expires_at) < new Date()) {
    //   return res.status(410).json({ error: "This link has expired" });
    // }

    // 3. Fetch file details using item_id
    const { data: fileData, error: fileError } = await supabase
      .from("files")
      .select("id, name, file_path, mime_type, size, created_at")
      .eq("id", shareRecord.item_id)
      .single();

    if (fileError || !fileData) {
      return res.status(404).json({ error: "File not found" });
    }

    // 4. Generate a signed URL for download (valid for 1 hour)
    const { data: signedUrlData, error: signedUrlError } = await supabase.storage
      .from("files") // 👈 replace with your bucket name
      .createSignedUrl(fileData.file_path, 3600);

    if (signedUrlError) {
      return res.status(500).json({ error: "Error generating file URL" });
    }

    // 5. Return response
    return res.json({
      file: {
        id: fileData.id,
        name: fileData.name,
        mime_type: fileData.mime_type,
        size: fileData.size,
        download_url: signedUrlData.signedUrl,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const getSharedWithMe = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // assume req.user is set by auth middleware
    const userEmail = req.user.email;
    // 1. Fetch all share records for this user
    const shares = await FileShareModel.findBySharedWith(userEmail);
    // console.log(shares)
    if (!shares || shares.length === 0) {
      return res.status(200).json({ data: [] });
    }

    // 2. Fetch the actual file/folder details from "files" table
    const items = await Promise.all(
      shares.map(async (share) => {
        if (share.item_type === "file") {
          const { data: file, error } = await supabase
            .from("files")
            .select("id, name, file_path, mime_type, size, created_at")
            .eq("id", share.item_id)
            .single();

          if (error || !file) return null;

          return {
            id: share.id,
            type: "file",
            permission: share.permission,
            sharedAt: share.created_at,
            file,
          };
        } else if (share.item_type === "folder") {
          const { data: folder, error } = await supabase
            .from("folders")
            .select("id, name, created_at")
            .eq("id", share.item_id)
            .single();

          if (error || !folder) return null;

          return {
            id: share.id,
            type: "folder",
            permission: share.permission,
            sharedAt: share.created_at,
            folder,
          };
        }
        return null;
      })
    );

    console.log(items);

    // 3. Filter out nulls and return
    const result = items.filter((item) => item !== null);

    return res.status(200).json({ data: result });
  } catch (err) {
    console.error("Error fetching shared with me files:", err);
    res.status(500).json({ error: "Server error while fetching shared files" });
  }
};

export {
  uploadFile,
  createFolder,
  getFiles,
  downloadFile,
  deleteFile,
  renameFile,
  searchFiles,
  getStorageInfo,
  shareFileWithEmail,
  generateSharableLink,
  getSharedFile,
};
