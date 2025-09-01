import nodemailer, { Transporter } from 'nodemailer';
import { EmailOptions } from '../types/index.js';

class EmailService {
  private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  async sendOTP(email: string, otp: string): Promise<boolean> {
    const mailOptions: EmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Email Verification - Google Drive Clone',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Google Drive Clone</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Email Verification</h2>
            <p style="color: #666; line-height: 1.6;">
              Thank you for signing up! To complete your registration, please use the following verification code:
            </p>
            <div style="background: #fff; border: 2px solid #667eea; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
              <h1 style="color: #667eea; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
            </div>
            <p style="color: #666; line-height: 1.6;">
              This code will expire in 10 minutes. If you didn't request this verification, please ignore this email.
            </p>
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
              <p style="color: #999; font-size: 12px;">
                This is an automated email from Google Drive Clone. Please do not reply to this email.
              </p>
            </div>
          </div>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  async sendWelcomeEmail(email: string, fullName: string): Promise<boolean> {
    const mailOptions: EmailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Welcome to Google Drive Clone!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">Google Drive Clone</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #333; margin-bottom: 20px;">Welcome, ${fullName}!</h2>
            <p style="color: #666; line-height: 1.6;">
              Your email has been successfully verified. You now have access to all features of Google Drive Clone.
            </p>
            <div style="background: #fff; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <h3 style="color: #333; margin-top: 0;">What you can do:</h3>
              <ul style="color: #666; line-height: 1.8;">
                <li>Upload and store files securely</li>
                <li>Organize files in folders</li>
                <li>Share files with others</li>
                <li>Access your files from anywhere</li>
                <li>15GB of free storage space</li>
              </ul>
            </div>
            <p style="color: #666; line-height: 1.6;">
              Start uploading your files and enjoy the convenience of cloud storage!
            </p>
          </div>
        </div>
      `
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      throw error;
    }
  }
}

export default new EmailService();
