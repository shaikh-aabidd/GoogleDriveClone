import type { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { OTPModel } from '../models/otp.model';
import emailService from '../services/emailService';
import { ApiError } from '../utils/ApiError';
import { ApiResponse } from '../utils/ApiResponse';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest, JWTPayload, RefreshTokenPayload } from '../types/index';
import bcrypt from 'bcrypt';
import jwt, { SignOptions, Secret } from 'jsonwebtoken';

// Generate JWT Token
const generateTokens = (userId: number, email: string): { accessToken: string; refreshToken: string } => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as Secret;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as Secret;

  const accessTokenExpiry = (process.env.ACCESS_TOKEN_EXPIRY || '1d') as SignOptions['expiresIn'];
  const refreshTokenExpiry = (process.env.REFRESH_TOKEN_EXPIRY || '7d') as SignOptions['expiresIn'];

  const accessToken = jwt.sign(
    { userId, email } as JWTPayload,
    accessTokenSecret,
    { expiresIn: accessTokenExpiry }
  );

  const refreshToken = jwt.sign(
    { userId } as RefreshTokenPayload,
    refreshTokenSecret,
    { expiresIn: refreshTokenExpiry }
  );

  return { accessToken, refreshToken };
};

// Generate OTP (always a string)
const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Register User
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password, fullName } = req.body;

  if (!email || !password || !fullName) {
    throw new ApiError(400, "All fields are required");
  }

  const existingUser = await UserModel.findByEmail(email);
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const user = await UserModel.create({
    email,
    password,
    fullName
  });

  const otp = generateOTP();
  await OTPModel.create(email, otp);
  await emailService.sendOTP(email, otp);

  const { password: _, ...userWithoutPassword } = user;

  return res.status(201).json(
    new ApiResponse(201, userWithoutPassword, "User registered successfully. Please check your email for verification.")
  );
});

// Verify Email OTP
const verifyEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    throw new ApiError(400, "Email and OTP are required");
  }

  const verificationResult = await OTPModel.verifyOTP(email, String(otp));
  if (!verificationResult.valid) {
    throw new ApiError(400, verificationResult.message);
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  await UserModel.updateVerificationStatus(user.id, true);

  try {
    await emailService.sendWelcomeEmail(email, user.full_name);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Email verified successfully!")
  );
});

// Resend OTP
const resendOTP = asyncHandler(async (req: Request, res: Response) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.is_verified) {
    throw new ApiError(400, "Email is already verified");
  }

  const otp = generateOTP();
  await OTPModel.deleteByEmail(email);
  await OTPModel.create(email, otp);
  await emailService.sendOTP(email, otp);

  return res.status(200).json(
    new ApiResponse(200, {}, "OTP sent successfully")
  );
});

// Login User
const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await UserModel.findByEmail(email);
  if (!user) {
    throw new ApiError(401, "Invalid credentials");
  }

  if (!user.is_verified) {
    throw new ApiError(401, "Please verify your email first");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = generateTokens(user.id, user.email);
  const { password: _, ...userWithoutPassword } = user;

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  return res.status(200).json(
    new ApiResponse(200, {
      user: userWithoutPassword,
      accessToken
    }, "User logged in successfully")
  );
});

// Logout User
const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken");
  return res.status(200).json(
    new ApiResponse(200, {}, "User logged out successfully")
  );
});

// Refresh Access Token
const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token is required");
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET as string) as RefreshTokenPayload;
    const user = await UserModel.findById(decoded.userId);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }
    

    const { accessToken } = generateTokens(user.id, user.email);

    return res.status(200).json(
      new ApiResponse(200, { accessToken,user }, "Access token refreshed successfully")
    );
  } catch {
    throw new ApiError(401, "Invalid refresh token");
  }
});

// Get Current User
const getCurrentUser = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  const user = await UserModel.findById(req.user.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const { password: _, ...userWithoutPassword } = user;

  return res.status(200).json(
    new ApiResponse(200, userWithoutPassword, "User fetched successfully")
  );
});

export {
  registerUser,
  verifyEmail,
  resendOTP,
  loginUser,
  logoutUser,
  refreshAccessToken,
  getCurrentUser
};
