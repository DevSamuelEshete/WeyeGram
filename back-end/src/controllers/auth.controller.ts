import { NextFunction, Request, Response } from "express";

import {
  createUser,
  getUserByEmail,
  getUserById,
  getUserByUsername,
  updateUser,
} from "../services/user.service";

import { userProps } from "../types";
import {
  blur_email,
  compare_password,
  encrypt_password,
  generate_id,
  send_email_code,
  send_reset_code,
} from "../utils";
import client from "../utils/redisClient";
import { MAX_CODE_AGE } from "../config/env.config";

export const register = async (
  req: Request<{}, {}, userProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.table(req.body);

    const user_info = await createUser(req.body);

    if ("success" in user_info) throw user_info;

    const ver_code = generate_id(5);

    await client.setEx(user_info.email, 60, ver_code);
    req.session.user = {
      id: user_info.id,
      username: user_info.username,
      email: user_info.email,
      phone: user_info.phone,
    };

    const message_id = await send_email_code(user_info.id, ver_code);

    if (typeof message_id !== "string")
      throw {
        success: false,
        status: 500,
        message: "Failed to send email verification code to user",
      };

    const blured_email = blur_email(user_info.email);

    return res.status(201).json({
      message: `Verification code has been sent to '${blured_email}'`,
    });
  } catch (e) {
    next(e);
  }
};

export const login = async (
  req: Request<{}, {}, userProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { username, email, password } = req.body;
    let user = null;

    if (!username && !email) {
      throw {
        success: false,
        status: 400,
        message: "Username or Email required",
        error: "Input user error",
      };
    } else if (!password) {
      throw {
        success: false,
        status: 400,
        message: "Password required",
        error: "Input user error",
      };
    }

    if (email) {
      const user_info = await getUserByEmail(email);
      if ("success" in user_info)
        throw { ...user_info, message: "Invalid Credentials" };

      user = user_info;
    } else if (username) {
      const user_info = await getUserByUsername(username);
      if ("success" in user_info)
        throw { ...user_info, message: "Invalid Credentials" };

      user = user_info;
    }

    if (!user)
      throw {
        success: false,
        status: 500,
        message: "An internal server error occurred",
        error: "User login error",
      };

    const isSame = await compare_password(password, user.password || "");

    if (!isSame)
      throw {
        success: false,
        status: 400,
        message: "Invalid Credentials",
        error: "Invalid Password Error",
      };

    req.session.user = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    if (!user.email_verified) {
      const ver_code = generate_id(5);

      const message_id = send_email_code(user.email, ver_code);

      if (!message_id)
        throw {
          success: false,
          status: 500,
          message: "Error sending verification code to user",
          error: "Verification code sending issue",
        };

      await client.setEx(user.id, 60, ver_code);
      const blured_email = blur_email(user.email);

      throw {
        success: false,
        status: 403,
        message: `Un-verified, verification code successfully sent to '${blured_email}'`,
        error: "UnVerified User Error",
      };
    }

    return res.status(200).json({
      message: "Successfully logged in",
      data: {
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          phone: user.phone,

          profile_url: user.profile_url,
          status: user.status,

          created_at: user.created_at,
          updated_at: user.updated_at,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

export const getResetCode = async (
  req: Request<{ email: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const email = req.params.email;

    const reset_code_exists = await client.get(email);
    const expires_in = await client.ttl(email);

    if (reset_code_exists)
      throw {
        success: false,
        status: 429,
        message: `Try again in ${expires_in} second(s)`,
        error: "Email Cooldown Error",
      };

    const user_info = await getUserByEmail(email);

    if (!("success" in user_info)) {
      res.cookie("res_email", user_info.email, {
        maxAge: parseInt(MAX_CODE_AGE || "60000"),
        httpOnly: true,
      });

      const pass_code = generate_id(5);

      await client.setEx(
        user_info.email,
        parseInt(MAX_CODE_AGE || "60000") / 1000,
        pass_code,
      );

      const message_id = await send_reset_code(user_info.email, pass_code);

      if (typeof message_id !== "string")
        throw {
          success: false,
          status: 500,
          message: "An internal server error occured",
          error: "Password Verification Email Error",
        };
    }

    return res.status(200).json({
      message: `Password reset code has been sent to ${blur_email(email)}`,
    });
  } catch (e) {
    next(e);
  }
};

export const verifyResetCode = async (
  req: Request<{ code: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const code = req.params.code;
    const res_email = req.cookies.res_email;

    if (!code)
      throw {
        success: false,
        status: 400,
        message: "Params code is required",
        error: "User Input Error",
      };
    else if (!res_email)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "No Reset Email Error",
      };

    const res_code = await client.get(res_email);

    if (!res_code)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "No Reset Code With Email",
      };
    else if (code !== res_code)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "Reset Code doesn't match",
      };

    res.cookie("res_code", code, {
      httpOnly: true,
      maxAge: parseInt(MAX_CODE_AGE || "60000"),
    });

    return res.status(200).json({ message: "Reset code verified", data: null });
  } catch (e) {
    next(e);
  }
};

export const ResetPassword = async (
  req: Request<{}, {}, { password: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const code = req.cookies.res_code;
    const res_email = req.cookies.res_email;

    const password = req.body.password;

    if (!code)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "User Input Error",
      };
    else if (!password)
      throw {
        success: false,
        status: 400,
        message: "Password is required",
        error: "User Input Error",
      };
    else if (!res_email)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "No Reset Email Present",
      };

    const res_code = await client.get(res_email);

    if (!res_code)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "No Reset Code With The Email",
      };
    else if (code !== res_code)
      throw {
        success: false,
        status: 400,
        message: "Invalid reset code",
        error: "Reset Code Doesn't Match",
      };

    await client.del(res_email);

    res.cookie("res_email", "", { maxAge: 0 });
    res.cookie("res_code", "", { maxAge: 0 });

    const user_info = await getUserByEmail(res_email);
    if ("success" in user_info) throw user_info;

    const updated_user_info = await updateUser(user_info.id, {
      password: password,
    });
    if ("success" in updated_user_info) throw updated_user_info;

    return res.status(200).json({
      message: "Password reseted successfully",
      data: {
        user: {
          id: updated_user_info.id,
          email: updated_user_info.email,
          username: updated_user_info.username,
          phone: updated_user_info.phone,

          profile_url: updated_user_info.profile_url,
          status: updated_user_info.status,

          created_at: updated_user_info.created_at,
          updated_at: updated_user_info.updated_at,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
