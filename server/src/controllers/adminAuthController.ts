import { Request, Response, NextFunction } from "express";
import { basicAuth } from "../middleware/basicAuth";

export const adminAuthHandler = [
  basicAuth,
  (req: Request, res: Response, _next: NextFunction) => {
    res.status(200).json({ message: "Authenticated" });
  },
];
