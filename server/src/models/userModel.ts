import { Model, Schema, models, model } from "mongoose";

export type UsersModelType = {
  _id: Schema.Types.ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

const UserSchema = new Schema<UsersModelType>(
  {
    username: { type: String, required: true, unique: true }, // Хэрэглэгчийн нэрийг заавал байх ёстой болголоо
    password: { type: String, required: true },
  },
  {
    timestamps: true, // createdAt болон updatedAt автомат үүсгэгдэнэ
  }
);

export const UserModel: Model<UsersModelType> =
  models["Users"] || model<UsersModelType>("Users", UserSchema);
