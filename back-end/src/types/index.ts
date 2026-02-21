import "express-session";

declare module "express-session" {
  interface SessionData {
    user?: {
      id: string;
      email: string;
      username: string;
      phone?: string;
    };
  }
}

export interface return_info {
  success: boolean;
  status?: number;
  message?: string;
  error?: any;
}

export interface logProps {
  type: "success" | "log" | "warning" | "error";
  info: return_info | string;
}

export interface userProps {
  id: string;
  username: string;
  email: string;
  phone?: string;

  global_name: string;
  profile_url: string;

  status?: string;
  status_expires_in?: Date;

  account_type: "local" | "google";
  password?: string;

  email_verified?: boolean;
  phone_verified?: boolean;

  created_at: Date;
  updated_at: Date;
}

export interface userUpdateProps {
  username?: string;
  phone?: string;

  global_name?: string;
  profile_url?: string;

  status?: string;
  status_expires_in?: Date;

  email_verified?: boolean;
  phone_verified?: boolean;

  password?: string;

  updated_at?: Date;
}

export interface contactProps {
  id: string;

  user1_id: string;
  user2_id: string;

  created_at: Date;
}

export interface messageProps {
  id: string;
  contacts_id: string;

  sender_id: string;
  receiver_id: string;

  images_url?: string[];
  content?: string;

  created_at: Date;
  updated_at: Date;
}
