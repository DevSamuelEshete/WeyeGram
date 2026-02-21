import { Request, Response, NextFunction, request } from "express";
import {
  updateUser,
  getUserById,
  getAll,
  getUserByEmail,
} from "../services/user.service";
import { generate_id, send_email_code } from "../utils";
import { userProps, userUpdateProps } from "../types";
import client from "../utils/redisClient";
import { MAX_CODE_AGE } from "../config/env.config";
import cloud from "../utils/cloud";

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await getAll();
    const formated_users: userProps[] = [];

    if ("success" in users) throw users;

    users.map((user) => {
      formated_users.push({
        id: user.id,
        email: "",
        username: user.username,

        global_name: user.global_name,
        profile_url: user.profile_url,

        account_type: "google",

        created_at: user.created_at,
        updated_at: user.updated_at,
      });
    });

    return res.status(200).json({
      message: "Successfully fetched users",
      data: { users: formated_users },
    });
  } catch (e) {
    next(e);
  }
};

export const getUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const id = req.session.user?.id || "";

    const user_info = await getUserById(id);

    if ("success" in user_info) throw user_info;

    return res.status(200).json({
      message: "Successfully fetched user",
      data: {
        user: {
          id: user_info.id,
          email: user_info.email,
          username: user_info.username,
          phone: user_info.phone,

          global_name: user_info.global_name,
          profile_url: user_info.profile_url,
          status: user_info.status,

          email_verified: user_info.email_verified,
          phone_verified: user_info.phone_verified,

          created_at: user_info.created_at,
          updated_at: user_info.updated_at,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

export const logOut = (req: Request, res: Response, next: NextFunction) => {
  try {
    req.session.destroy(() => {
      return res.status(200).json({ message: "Successfully logged out" });
    });
  } catch (e) {
    next(e);
  }
};

export const getEmailCode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    if (!req.session.user) {
      throw {
        success: false,
        status: 500,
        message: "An internal server error occured",
        error: "No user in session",
      };
    }

    const ver_code_exists = await client.get(req.session.user.id);
    const cooldown = await client.ttl(req.session.user.id);

    if (ver_code_exists)
      throw {
        success: false,
        status: 429,
        message: `Try again in ${cooldown} second(s)`,
        error: "Email Cooldown Error",
      };

    const user_info = await getUserById(req.session.user.id);

    if ("success" in user_info) throw user_info;

    if (user_info.email_verified)
      throw {
        success: false,
        status: 409,
        message: "User email already verified",
        error: "User Verification Conflict",
      };

    const ver_code = generate_id(5);

    await client.setEx(
      user_info.id,
      parseInt(MAX_CODE_AGE || "60000") / 1000,
      ver_code,
    );

    const message_id = await send_email_code(user_info.email, ver_code);

    if (typeof message_id !== "string")
      throw {
        success: false,
        status: 500,
        message: "An internal server error occured",
        error: "Failed to send verification code to user",
      };

    return res
      .status(200)
      .json({ message: "Email verification code successfully sent!" });
  } catch (e) {
    next(e);
  }
};

export const verifyEmail = async (
  req: Request<{ code: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const code = req.params.code;

    if (!req.session.user)
      throw {
        success: false,
        status: 500,
        message: "An internal server error occured",
        error: "User Not Found In Session",
      };

    const user_id = req.session.user.id;
    const ver_code = await client.get(user_id);

    console.log(`code: ${code} | ver_code: ${ver_code}`);

    if (ver_code) {
      await client.del(user_id);
    }

    if (code !== ver_code) {
      throw {
        success: false,
        status: 400,
        message: "Invalid verification code",
        error: "Invalid User Verification Error",
      };
    }

    const user_info = await getUserById(user_id);
    if ("success" in user_info) throw user_info;

    const updated_user = await updateUser(user_info.id, {
      email_verified: true,
    });

    if ("success" in updated_user) throw updated_user;

    return res.status(200).json({
      message: "Email successfully verified",
      data: {
        user: {
          id: updated_user.id,
          email: updated_user.email,
          username: updated_user.username,
          phone: updated_user.phone,

          glboal_name: updated_user.global_name,
          profile_url: updated_user.profile_url,
          status: updated_user.status,

          email_verified: updated_user.email_verified,
          phone_verified: updated_user.phone_verified,

          created_at: updated_user.created_at,
          updated_at: updated_user.updated_at,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

export const updateUserSettings = async (
  req: Request<{}, {}, userUpdateProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.session.user?.id;
    const props = req.body;

    if (!user_id)
      throw {
        success: false,
        status: 500,
        message: "An internal server error occurd",
        error: "User Id Not Found",
      };

    const formated_props = {
      username: props.username,
      phone: props.phone,

      global_name: props.global_name,

      status: props.status,
      status_expires_in: props.status_expires_in,

      updated_at: props.updated_at,
    };

    const updated_user = await updateUser(user_id, formated_props);

    if ("success" in updated_user) throw updated_user;

    res.status(200).json({
      message: "Updated user settings!",
      data: {
        user: {
          id: updated_user.id,
          email: updated_user.email,
          username: updated_user.username,
          phone: updated_user.phone,

          glboal_name: updated_user.global_name,
          profile_url: updated_user.profile_url,
          status: updated_user.status,

          email_verified: updated_user.email_verified,
          phone_verified: updated_user.phone_verified,

          created_at: updated_user.created_at,
          updated_at: updated_user.updated_at,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};

export const uploadProfile = async (
  req: Request<{}, {}, userProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    console.table(req.body);
    const profile_url = req.body?.profile_url;
    const user_id = req.session.user?.id || "";

    if (!profile_url)
      throw {
        success: false,
        status: 400,
        message: "Profile url required",
      };

    const upload_info = await cloud.uploader.upload(profile_url);
    const updated_user = await updateUser(user_id, {
      profile_url: upload_info.secure_url,
    });

    if ("success" in updated_user) throw updated_user;

    return res.status(200).json({
      message: "Profile successfully uploaded!",
      data: {
        user: {
          id: updated_user.id,
          email: updated_user.email,
          username: updated_user.username,
          phone: updated_user.phone,

          glboal_name: updated_user.global_name,
          profile_url: updated_user.profile_url,
          status: updated_user.status,

          email_verified: updated_user.email_verified,
          phone_verified: updated_user.phone_verified,

          created_at: updated_user.created_at,
          updated_at: updated_user.updated_at,
        },
      },
    });
  } catch (e) {
    next(e);
  }
};
