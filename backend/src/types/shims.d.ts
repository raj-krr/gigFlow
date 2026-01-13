declare module "express";
declare module "cors";
declare module "cookie-parser";
declare module "jsonwebtoken";

declare var process: {
  env: {
    [key: string]: string | undefined;
  };
};
