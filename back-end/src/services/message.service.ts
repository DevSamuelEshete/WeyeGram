import { eq } from "drizzle-orm";
import DB from "../database/postgres.db";
import messageTable from "../database/schema/messages";
import { generate_id } from "../utils";
import { messageProps, return_info } from "../types";

const setDefaultCreateValues = async (props: messageProps) => {
  props.created_at = props.updated_at = new Date();
  let id_valid = false;

  while (!id_valid) {
    props.id = generate_id();
    id_valid =
      (
        await DB.select()
          .from(messageTable)
          .where(eq(messageTable.id, props.id))
      )[0]?.id === undefined;
  }

  return props;
};

const validateCreateProps = (props: messageProps): return_info => {
  if (!props.contacts_id) {
    return {
      success: false,
      status: 400,
      message: "Contact id required",
      error: "User Input Error",
    };
  } else if (!props.sender_id || !props.receiver_id) {
    return {
      success: false,
      status: 400,
      message: "Both Sender and Receiver are required",
      error: "User input error",
    };
  } else if (!props.images_url && !props.content)
    return {
      success: false,
      status: 400,
      message: "Image or Content required",
      error: "User Input Error",
    };

  return { success: true };
};

export const createMessage = async (
  props: messageProps
): Promise<return_info | messageProps> => {
  const defaultedProps = await setDefaultCreateValues(props);
  const is_valid = validateCreateProps(defaultedProps);

  if (!is_valid.success) throw is_valid;

  try {
    await DB.insert(messageTable).values(defaultedProps);
    return defaultedProps;
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "Internal server error",
      error: e,
    };
  }
};

export const getAllMessages = async (
  contact_id: messageProps["contacts_id"]
): Promise<return_info | messageProps[]> => {
  try {
    const messages = await DB.select()
      .from(messageTable)
      .where(eq(messageTable.contacts_id, contact_id));

    return messages as messageProps[];
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "Error getting all messages",
      error: e,
    };
  }
};

export const deleteMessage = async (
  id: messageProps["id"]
): Promise<return_info> => {
  try {
    await DB.delete(messageTable).where(eq(messageTable.id, id));
    return { success: true };
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "Error deleting message",
      error: e,
    };
  }
};
