import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";

interface JwtPayload {
  userId: string;
}

const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = (req as any).cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    req.user = {
      id: decoded.userId as any
    };

    next();
  } catch {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
