import { supabase } from '../db/index';
import { FileShare, CreateFileShareData, UpdateFileShareData } from '../types/index';

export class FileShareModel {
  static async create(shareData: CreateFileShareData): Promise<FileShare> {
    const { itemType, itemId, sharedWith, permission } = shareData;

    const { data, error } = await supabase
      .from('shares')
      .insert([
        {
          item_type: itemType,
          item_id: itemId,
          shared_with: sharedWith, // should be user_id or email
          permission,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("File share creation failed");

    return data[0] as FileShare;
  }

  static async findById(id: number): Promise<FileShare | null> {
    const { data, error } = await supabase
      .from('shares')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // not found
      throw error;
    }

    return data as FileShare;
  }

  static async findBySharedWith(email: string): Promise<FileShare[]> {
    const { data, error } = await supabase
      .from('shares')
      .select('*')
      .eq('shared_with', email)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data ?? []) as FileShare[];
  }

  static async findByItem(itemId: number, itemType: string): Promise<FileShare[]> {
    const { data, error } = await supabase
      .from('shares')
      .select('*')
      .eq('item_id', itemId)
      .eq('item_type', itemType);

    if (error) throw error;
    return (data ?? []) as FileShare[];
  }

  static async update(id: number, updateData: UpdateFileShareData): Promise<FileShare> {
    const { data, error } = await supabase
      .from('shares')
      .update({
        ...updateData,
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("File share update failed");

    return data[0] as FileShare;
  }

  static async delete(id: number): Promise<boolean> {
    const { error } = await supabase
      .from('shares')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
}
