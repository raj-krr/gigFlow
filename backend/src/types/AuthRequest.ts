import { Request } from "express";

export interface AuthRequest extends Request {
  user?: {
    id: string;
  };
  cookies?: Record<string, string>;
  params: {
    [key: string]: string;
  };
}
