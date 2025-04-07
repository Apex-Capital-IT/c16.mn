// import { Request, Response } from "express";
// import { AdminModel } from "../models/admin.model";
// import bcrypt from "bcrypt";
// import { generateToken } from "../utils/jwt";

// export const registerAdmin = async (
//   req: Request,
//   res: Response
// ): Promise<Response | undefined> => {
//   const { fullName, email, password } = req.body;
//   const exists = await AdminModel.findOne({ email });
//   if (exists) return res.status(400).json({ message: "Email already exists" });

//   const admin = await AdminModel.create({ fullName, email, password });
//   res
//     .status(201)
//     .json({ token: generateToken(admin._id.toString(), email, admin.role) });
// };

// export const loginAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;
//   const admin = await AdminModel.findOne({ email });
//   if (!admin) return res.status(404).json({ message: "Admin not found" });

//   const match = await bcrypt.compare(password, admin.password);
//   if (!match) return res.status(401).json({ message: "Incorrect password" });

//   admin.lastLogin = new Date();
//   await admin.save();

//   res.json({ token: generateToken(admin._id.toString(), email, admin.role) });
// };

// export const getProfile = async (req: Request, res: Response) => {
//   const admin = await AdminModel.findById((req as any).admin.id).select(
//     "-password"
//   );
//   res.json(admin);
// };

// export const changePassword = async (req: Request, res: Response) => {
//   const { currentPassword, newPassword } = req.body;
//   const admin = await AdminModel.findById((req as any).admin.id);
//   if (!admin) return res.status(404).json({ message: "Admin not found" });

//   const isMatch = await bcrypt.compare(currentPassword, admin.password);
//   if (!isMatch)
//     return res.status(400).json({ message: "Wrong current password" });

//   admin.password = newPassword;
//   await admin.save();

//   res.json({ message: "Password updated successfully" });
// };
