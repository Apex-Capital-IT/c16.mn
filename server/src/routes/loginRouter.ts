import { Router } from "express";
import { loginController } from "../controllers/loginController";

const loginRouter = Router();

loginRouter.route("/user/login").post(loginController);

export default loginRouter;
