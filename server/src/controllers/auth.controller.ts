// import { Request, Response } from "express";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import { AdminModel } from "../models/admin.model";

// // Бүртгэх функц
// export const registerAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     // Хэрэглэгч байгаа эсэхийг шалгах
//     const existingAdmin = await AdminModel.findOne({ email });
//     if (existingAdmin) {
//       return res.status(400).json({ message: "Admin already exists" });
//     }

//     // Нууц үгийг хаш кодлох
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Шинэ админ хэрэглэгчийг үүсгэх
//     const newAdmin = new AdminModel({
//       email,
//       password: hashedPassword,
//     });

//     await newAdmin.save();

//     res.status(201).json({ message: "Admin registered successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error registering admin", error });
//   }
// };

// // Нэвтрэх функц
// export const loginAdmin = async (req: Request, res: Response) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await AdminModel.findOne({ email });
//     if (!admin) return res.status(404).json({ message: "Admin not found" });

//     // Нууц үгийг шалгах
//     const isPasswordValid = await bcrypt.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     // JWT токен үүсгэх
//     const token = jwt.sign({ id: admin._id, email: admin.email }, "secretKey", {
//       expiresIn: "1h",
//     });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: "Error logging in", error });
//   }
// };
