import { Request } from "express-serve-static-core";

export interface AuthRequest
  extends Request<
    Record<string, string>, // params
    any,                    // res body
    any,                    // req body
    any                     // query
  > {
  user?: {
    id: string;
  };
}
