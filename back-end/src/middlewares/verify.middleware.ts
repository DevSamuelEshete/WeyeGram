import { Request, Response, NextFunction } from "express";
import { getUserById } from "../services/user.service";
import { blur_email, generate_id, send_email_code } from "../utils";
import client from "../utils/redisClient";
import { MAX_CODE_AGE } from "../config/env.config";

const verifyMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.user?.id)
      throw {
        success: false,
        status: 401,
        message: "Un authorized access, login to use this endpoint",
        error: "User UnAuthorized Error",
      };

    const user_info = await getUserById(req.session.user.id);

    if ("success" in user_info) throw user_info;

    if (!user_info.email_verified) {
      const ver_code_exists = await client.get(user_info.id);

      if (!ver_code_exists) {
        const ver_code = generate_id(5);

        await client.setEx(
          user_info.id,
          parseInt(MAX_CODE_AGE || "60000") / 1000,
          ver_code
        );

        const message_id = await send_email_code(user_info.email, ver_code);
        // const message_id = "asd2qwdaq3";
        if (typeof message_id !== "string")
          throw {
            success: false,
            status: 500,
            message: "An internal server error occured",
            error: "Verification Email Faild",
          };
      }

      const blured_email = blur_email(user_info.email);

      throw {
        success: false,
        status: 403,
        message: `Verification code has been sent to '${blured_email}'`,
      };
    }

    return next();
  } catch (e) {
    next(e);
  }
};

export default verifyMiddleware;
