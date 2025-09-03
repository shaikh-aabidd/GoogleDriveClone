import type { Request, Response, NextFunction } from 'express';
import { UserModel } from '../models/user.model';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { AuthenticatedRequest, JWTPayload } from '../types/index';
import jwt from 'jsonwebtoken';

const verifyJWT = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  try {
    //cookies for websites header for mobile devices
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
    if (!token) {
      throw new ApiError(401, "Unauthorized Access");
    }
  
    const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as JWTPayload;
  
    const user = await UserModel.findById(decodeToken.userId);

    if (!user) {
      throw new ApiError(401, "Unauthorized access: User not found");
    }

    (req as AuthenticatedRequest).user = decodeToken;
    next();
  } catch (error: any) {
    if (error.name === "JsonWebTokenError") {
      throw new ApiError(401, "Invalid access token");
    } else if (error.name === "TokenExpiredError") {
      throw new ApiError(401, "Access token expired");
    } else {
      throw new ApiError(401, error?.message || "Unauthorized access");
    }
  }
});

export { verifyJWT };
