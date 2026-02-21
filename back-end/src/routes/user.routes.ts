import { Router } from "express";
import verifyMiddleware from "../middlewares/verify.middleware";
import {
  getAllUsers,
  getEmailCode,
  getUser,
  logOut,
  updateUserSettings,
  uploadProfile,
  verifyEmail,
} from "../controllers/user.controller";

const userRouter = Router();

userRouter.get("/all", verifyMiddleware, getAllUsers);

userRouter.get("/@me", verifyMiddleware, getUser);
userRouter.put("/@me", verifyMiddleware, updateUserSettings);
userRouter.put("/@me/profile", verifyMiddleware, uploadProfile);

userRouter.get("/logout", logOut);

userRouter.get("/@me/verify/email", getEmailCode);

userRouter.post("/@me/verify/email/:code", verifyEmail);

export default userRouter;
