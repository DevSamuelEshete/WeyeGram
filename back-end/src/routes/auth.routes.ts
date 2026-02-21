import { Router } from "express";
import {
  register,
  login,
  getResetCode,
  ResetPassword,
  verifyResetCode,
} from "../controllers/auth.controller";

const authRouter = Router();

authRouter.get("/reset-password/:email", getResetCode);
authRouter.get("/reset-password/verify/:code", verifyResetCode);

authRouter.put("/reset-password", ResetPassword);

authRouter.post("/register", register);
authRouter.post("/login", login);

export default authRouter;
