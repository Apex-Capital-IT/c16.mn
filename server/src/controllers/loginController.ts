import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { UserModel } from "../models/UserModel";

export const loginController = async (req: any, res: any) => {
  const { username, password } = req.body;

  try {
    console.log("Received username:", username);

    const user = await UserModel.findOne({ username });

    if (!user) {
      console.log("User not found");
      return res
        .status(404)
        .send({ message: "Нууц үг эсвэл хэрэглэгчийн нэр буруу байна" });
    }

    console.log("User found, checking password");
    console.log("JWT Secret: ", process.env.SECRET);

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.log("Password mismatch");
      return res
        .status(401)
        .send({ message: "Нууц үг эсвэл хэрэглэгчийн нэр буруу байна" });
    }

    const token = jwt.sign({ id: user._id }, process.env.SECRET as string, {
      expiresIn: "1d",
    });

    res.status(200).send({ message: "Login successful", token, user });
  } catch (error) {
    console.error("Error in loginController:", error);
    res.status(500).send({ message: "Internal server error" });
  }
};
