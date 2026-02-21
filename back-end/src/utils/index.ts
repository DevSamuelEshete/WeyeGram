import {
  NODE_ENV,
  MAIL_HOST,
  MAIL_PORT,
  MAIL_APP_NAME,
  MAIL_USER,
  MAIL_APP_PASS,
} from "../config/env.config";

import { logProps, return_info } from "../types";

import { createTransport } from "nodemailer";
import bcrypt from "bcrypt";
import { reset_template, verify_template } from "./templates/email_templates";

const transporter = createTransport({
  service: MAIL_HOST,
  port: parseInt(MAIL_PORT || "587"),
  secure: parseInt(MAIL_PORT || "587") === 465 ? true : false, // true for 465, false for other ports
  auth: {
    user: MAIL_USER,
    pass: MAIL_APP_PASS,
  },
});

export const log = (props: logProps) => {
  switch (NODE_ENV) {
    case "development":
      switch (props.type) {
        case "success":
          if (typeof props.info === "string") return console.info(props.info);
          return console.table(props.info);
        case "log":
          if (typeof props.info === "string") return console.log(props.info);
          return console.table(props.info);
        case "warning":
          if (typeof props.info === "string") return console.warn(props.info);
          return console.table(props.info);
        case "error":
          if (typeof props.info === "string") return console.error(props.info);
          return console.table(props.info);
      }

    case "production":
      switch (props.type) {
        case "success":
          return;
        case "log":
          return;
        case "warning":
          if (typeof props.info === "string") return console.warn(props.info);
          return console.table(props.info);
        case "error":
          if (typeof props.info === "string") return console.error(props.info);
          return console.table(props.info);
      }
  }
};

export const generate_id = (length: number = 12): string => {
  const min = 10 ** (length - 1);
  const max = 10 ** length - 1;

  const random_id = Math.floor(Math.random() * (max - min) + min);
  return random_id.toString();
};

export const encrypt_password = async (
  plane_password: string,
  round: number = 10,
): Promise<string | return_info> => {
  const salt = await bcrypt.genSalt(round);
  const hashed_pass = await bcrypt.hash(plane_password, salt).catch((e) => {
    throw {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  });

  return hashed_pass;
};

export const compare_password = async (
  plain_pass: string,
  hashed_pass: string,
): Promise<boolean> => {
  const isSame = await bcrypt.compare(plain_pass, hashed_pass);
  return isSame;
};

export const blur_email = (email: string): string => {
  const [name, domain] = email.split("@");
  const vissible = email.substring(0, 3);
  const hidden = "*".repeat(Math.max(email.length - 3));

  return `${vissible}${hidden}@${domain}`;
};

export const send_email_code = async (email: string, code: string) => {
  const email_info = await transporter.sendMail({
    from: `${MAIL_USER} <${MAIL_USER}>`,
    subject: "Email Verification",
    to: email,
    html: verify_template.replace("{{code}}", code),
  });

  return email_info.messageId;
};

export const send_reset_code = async (email: string, code: string) => {
  const email_info = await transporter.sendMail({
    from: `${MAIL_USER} <${MAIL_USER}>`,
    subject: "Password Reset",
    to: email,
    html: reset_template.replace("{{code}}", code),
  });

  return email_info.messageId;
};
