import { supabase } from '../db/index.js';
import { File, CreateFileData, UpdateFileData } from '../types/index.js';

export class FileModel {
  static async create(fileData: CreateFileData): Promise<File> {
    const {
      name,
      originalName,
      mimeType,
      size,
      userId,
      parentFolderId = null,
      filePath,
      isFolder = false,
    } = fileData;

    const { data, error } = await supabase
      .from("files")
      .insert([
        {
          name,
          original_name: originalName,
          mime_type: mimeType,
          size,
          user_id: userId,
          parent_folder_id: parentFolderId,
          file_path: filePath,
          is_folder: isFolder,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("File creation failed");

    return data[0] as File;
  }

  static async findById(id: number): Promise<File | null> {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // not found
      throw error;
    }
    return data as File;
  }

  static async findByUserId(
    userId: number,
    parentFolderId: number | null = null
  ): Promise<File[]> {
    const query = supabase.from("files").select("*").eq("user_id", userId);

    if (parentFolderId === null) {
      query.is("parent_folder_id", null);
    } else {
      query.eq("parent_folder_id", parentFolderId);
    }

    const { data, error } = await query
      .order("is_folder", { ascending: false })
      .order("name", { ascending: true });

    if (error) throw error;
    return (data ?? []) as File[];
  }

  static async update(id: number, updateData: UpdateFileData): Promise<File> {
    const { data, error } = await supabase
      .from("files")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("File update failed");

    return data[0] as File;
  }

  static async delete(id: number): Promise<boolean> {
    const { error } = await supabase.from("files").delete().eq("id", id);

    if (error) throw error;
    return true;
  }

  static async getStorageUsed(userId: number): Promise<number> {
    const { data, error } = await supabase
      .from("files")
      .select("size")
      .eq("user_id", userId)
      .eq("is_folder", false);

    if (error) throw error;

    return (data ?? []).reduce(
      (total: number, file: { size: number }) => total + (file.size || 0),
      0
    );
  }

  static async searchFiles(userId: number, searchTerm: string): Promise<File[]> {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .eq("user_id", userId)
      .ilike("name", `%${searchTerm}%`)
      .order("updated_at", { ascending: false });

    if (error) throw error;
    return (data ?? []) as File[];
  }
}
