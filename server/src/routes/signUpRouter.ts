import { Router } from "express";
import { signUpController } from "../controllers/signUpController";

const signUpRouter = Router();

signUpRouter.route("/user/signup").post(signUpController);

export default signUpRouter;
