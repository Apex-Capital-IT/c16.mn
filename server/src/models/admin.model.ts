// import { Schema, model, models, Model } from "mongoose";
// import bcrypt from "bcrypt";

// export type AdminRole = "superadmin" | "editor" | "moderator";

// export type AdminModelType = {
//   fullName: string;
//   email: string;
//   password: string;
//   role: AdminRole;
//   isActive: boolean;
//   lastLogin?: Date;
//   createdAt: Date;
//   updatedAt: Date;
// };

// const AdminSchema = new Schema<AdminModelType>({
//   fullName: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: {
//     type: String,
//     enum: ["superadmin", "editor", "moderator"],
//     default: "editor",
//   },
//   isActive: { type: Boolean, default: true },
//   lastLogin: { type: Date },
//   createdAt: { type: Date, default: Date.now, immutable: true },
//   updatedAt: { type: Date, default: Date.now },
// });

// // Нууц үг хадгалахын өмнө шифрлэнэ
// AdminSchema.pre("save", async function (next) {
//   if (this.isModified("password")) {
//     this.password = await bcrypt.hash(this.password, 10);
//   }
//   next();
// });

// // Модел
// export const AdminModel: Model<AdminModelType> =
//   models.Admin || model<AdminModelType>("Admin", AdminSchema);
