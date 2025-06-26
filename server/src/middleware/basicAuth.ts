import { Request, Response, NextFunction } from "express";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;

export function basicAuth(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Basic ")) {
    res.status(401).send("Authentication required.");
    return;
  } else {

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii");
  const [username, password] = credentials.split(":");

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return next();
  }

    res.status(401).send("Invalid credentials.");
  }
} 