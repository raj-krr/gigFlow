import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/AuthRequest";

const protect = (req: AuthRequest, res: any, next: any) => {
  try {
    const token = (req as any).cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { userId: string };

    req.user = { id: decoded.userId };

    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};

export default protect;
