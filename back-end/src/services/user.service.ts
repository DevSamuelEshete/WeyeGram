import usersTable from "../database/schema/users";
import DB from "../database/postgres.db";
import { eq } from "drizzle-orm";

import { return_info, userProps, userUpdateProps } from "../types";
import { encrypt_password, generate_id } from "../utils";

const email_valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const pass_valid = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;

const validateInput = (props: userProps): return_info => {
  if (!props.email) {
    return {
      success: false,
      status: 400,
      message: "Input feild Email is required",
      error: "User Input Error",
    };
  } else if (!email_valid.test(props.email)) {
    return {
      success: false,
      status: 400,
      message: "Email in invalid format",
      error: "Invalid User Input Error",
    };
  } else if (!props.global_name) {
    return {
      success: false,
      status: 400,
      message: "Input feild Global name is required",
      error: "User Input Error",
    };
  } else if (!props.username) {
    return {
      success: false,
      status: 400,
      message: "Input feild Username name is required",
      error: "User Input Error",
    };
  } else if (props.username.length < 3) {
    return {
      success: false,
      status: 400,
      message: "Input feild Username must be atleast 3 characters",
      error: "User Input Error",
    };
  } else if (!props.password) {
    return {
      success: false,
      status: 400,
      message: "Input field Password is required",
      error: "User Input Error",
    };
  } else if (!pass_valid.test(props.password)) {
    return {
      success: false,
      status: 400,
      message:
        "Password must contain atleast 1 uppercase 1 lowercase and 1 symbol",
      error: "Invalid User Input Error",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Input Valid",
  };
};

const checkIfUnique = async (props: userProps): Promise<return_info> => {
  const username_valid = !(
    await DB.select()
      .from(usersTable)
      .where(eq(usersTable.username, props.username))
  )[0]?.username;

  const email_valid = !(
    await DB.select().from(usersTable).where(eq(usersTable.email, props.email))
  )[0]?.email;

  if (!email_valid) {
    return {
      success: false,
      status: 409,
      message: "Email already registered",
      error: "Email Conflict Error",
    };
  } else if (!username_valid) {
    return {
      success: false,
      status: 409,
      message: "Username already exists",
      error: "Username Conflict Error",
    };
  }

  return {
    success: true,
    status: 200,
    message: "User fields are unique",
  };
};

const setDefaultValues = async (props: userProps): Promise<userProps> => {
  let id_valid = false;

  while (!id_valid) {
    props.id = generate_id();

    const userExists = (
      await DB.select().from(usersTable).where(eq(usersTable.id, props.id))
    )[0];

    if (!userExists?.id) id_valid = true;
  }

  props.account_type = "local";
  props.created_at = props.updated_at = new Date();

  const encrypt_info = await encrypt_password(props.password || "");

  if (typeof encrypt_info !== "string") throw encrypt_info;
  props.password = encrypt_info;

  return props;
};

export const createUser = async (
  props: userProps
): Promise<userProps | return_info> => {
  const validator_info = validateInput(props);
  if (!validator_info.success) return validator_info;

  const unique_check_info = await checkIfUnique(props);
  if (!unique_check_info.success) return unique_check_info;

  const new_props = await setDefaultValues(props);

  try {
    await DB.insert(usersTable).values(new_props);

    return new_props;
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An Internal server error occured",
      error: e,
    };
  }
};

const checkUpdateInput = async (
  user_id: string,
  props: userUpdateProps
): Promise<return_info> => {
  if (props.username) {
    const user = (
      await DB.select()
        .from(usersTable)
        .where(eq(usersTable.username, props.username))
    )[0];

    if (user?.id && user.id !== user_id)
      return {
        success: false,
        status: 409,
        message: "Username taken",
        error: "User Update Conflict",
      };
  }

  if (props.password !== undefined) {
    if (!pass_valid.test(props.password)) {
      return {
        success: false,
        status: 400,
        message:
          "Password must contain atleast 1 uppercase 1 lowercase and 1 symbol",
        error: "User Update Conflict Error",
      };
    } else {
      const hashed_pass = await encrypt_password(props.password);

      if (typeof hashed_pass !== "string") throw hashed_pass;
      props.password = hashed_pass;
    }
  }

  return {
    success: true,
    status: 200,
    message: "Inputs Valid",
  };
};

export const updateUser = async (
  user_id: string,
  props: userUpdateProps
): Promise<userProps | return_info> => {
  props.updated_at = new Date();
  console.table(props);

  const check_update_input = await checkUpdateInput(user_id, props);
  if (!check_update_input.success) return check_update_input;

  try {
    await DB.update(usersTable).set(props).where(eq(usersTable.id, user_id));

    const user_info = await getUserById(user_id);

    return user_info;
  } catch (e) {
    throw {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};

export const getAll = async (): Promise<return_info | userProps[]> => {
  try {
    const users = await DB.select().from(usersTable);
    return users as userProps[];
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};

export const getUserById = async (
  id: string
): Promise<userProps | return_info> => {
  try {
    const user = (
      await DB.select().from(usersTable).where(eq(usersTable.id, id))
    )[0];

    if (!user)
      return {
        success: false,
        status: 404,
        message: "A user with an ID not found",
        error: "Get User By ID Error",
      };

    return user as userProps;
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};

export const getUserByEmail = async (
  email: string
): Promise<userProps | return_info> => {
  try {
    const user = (
      await DB.select().from(usersTable).where(eq(usersTable.email, email))
    )[0];

    if (!user)
      return {
        success: false,
        status: 404,
        message: "User with an Email not found",
        error: "Get User By Email Error",
      };

    return user as userProps;
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};

export const getUserByUsername = async (
  username: string
): Promise<userProps | return_info> => {
  try {
    const user = (
      await DB.select()
        .from(usersTable)
        .where(eq(usersTable.username, username))
    )[0];

    if (!user)
      return {
        success: false,
        status: 404,
        message: "User with a Username not found",
        error: "Get User By Username Error",
      };

    return user as userProps;
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};
