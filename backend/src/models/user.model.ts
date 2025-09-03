import { supabase } from '../db/index';
import { User, CreateUserData } from '../types/index';
import bcrypt from 'bcrypt';

export class UserModel {
  static async create(userData: CreateUserData): Promise<User> {
    const { email, password, fullName } = userData;

    const hashedPassword = await bcrypt.hash(password, 12);

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password: hashedPassword,
          full_name: fullName,
          is_verified: false,
          storage_used: 0,
          storage_limit: 15 * 1024 * 1024 * 1024, // 15GB
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }
      ])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("User creation failed");

    return data[0] as User;
  }

  static async findByEmail(email: string): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as User;
  }

  static async findById(id: number): Promise<User | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null;
      throw error;
    }
    return data as User;
  }

  static async updateVerificationStatus(userId: number, isVerified: boolean): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        is_verified: isVerified,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("User update failed");

    return data[0] as User;
  }

  static async updateStorageUsed(userId: number, storageUsed: number): Promise<User> {
    const { data, error } = await supabase
      .from('users')
      .update({
        storage_used: storageUsed,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("User update failed");

    return data[0] as User;
  }
}
