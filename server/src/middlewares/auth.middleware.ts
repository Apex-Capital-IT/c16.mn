// import { Request, Response, NextFunction } from "express";
// import jwt from "jsonwebtoken";

// export const protect = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): void => {
//   const token = req.headers.authorization?.split(" ")[1];
//   if (!token) {
//     res.status(401).json({ message: "Not authorized" });
//     return;
//   }

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!);
//     (req as any).admin = decoded;
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Invalid token" });
//   }
// };
