import bcrypt from "bcrypt";
import env from "dotenv";
import { UserModel } from "../models/UserModel";
env.config();

export const signUpController = async (req: any, res: any) => {
  const { username, password } = req.body;

  const hashedPassword = bcrypt.hashSync(password, 11);

  try {
    const newUser = await UserModel.create({
      username,
      password: hashedPassword,
    });
    res.status(201).send({ message: "User created successfully" });
  } catch (error) {
    res.send({ message: "Email already registered" });
  }
};
