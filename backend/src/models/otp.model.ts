import { supabase } from '../db/index.js';
import { OTPRecord, OTPVerificationResult } from '../types/index.js';

export class OTPModel {
  static async create(email: string, otp: string): Promise<OTPRecord> {
    const { data, error } = await supabase
      .from('otps')
      .insert([
        {
          email,
          otp,
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutes
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (error) throw error;
    if (!data || data.length === 0) throw new Error("OTP creation failed");

    return data[0] as OTPRecord;
  }

  static async findByEmail(email: string): Promise<OTPRecord | null> {
    const { data, error } = await supabase
      .from('otps')
      .select('*')
      .eq('email', email)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === "PGRST116") return null; // no OTP found
      throw error; // real error
    }

    return data as OTPRecord;
  }

  static async verifyOTP(email: string, otp: string): Promise<OTPVerificationResult> {
    const otpRecord = await this.findByEmail(email);

    if (!otpRecord) {
      return { valid: false, message: "OTP not found" };
    }

    if (new Date() > new Date(otpRecord.expires_at)) {
      return { valid: false, message: "OTP expired" };
    }
    if (otpRecord.otp !== otp) {
      return { valid: false, message: "Invalid OTP" };
    }

    // delete OTP after verification
    await this.deleteByEmail(email);

    return { valid: true, message: "OTP verified successfully" };
  }

  static async deleteByEmail(email: string): Promise<boolean> {
    const { error } = await supabase.from("otps").delete().eq("email", email);

    if (error) throw error;
    return true;
  }

  static async cleanupExpiredOTPs(): Promise<boolean> {
    const { error } = await supabase
      .from("otps")
      .delete()
      .lt("expires_at", new Date().toISOString());

    if (error) throw error;
    return true;
  }
}
