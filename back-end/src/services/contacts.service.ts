import { eq, or } from "drizzle-orm";
import DB from "../database/postgres.db";
import contactsTable from "../database/schema/contacts";
import { contactProps, return_info } from "../types";
import { generate_id } from "../utils";

export const getAll = async (
  user_id: contactProps["user1_id"],
): Promise<return_info | contactProps[]> => {
  try {
    const contacts = await DB.select()
      .from(contactsTable)
      .where(
        or(
          eq(contactsTable.user1_id, user_id),
          eq(contactsTable.user2_id, user_id),
        ),
      );

    return contacts as contactProps[];
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "Internal server error",
      error: e,
    };
  }
};

const generateUniqueId = async (): Promise<string> => {
  let id = "";
  let id_valid = false;

  while (!id_valid) {
    id = generate_id();
    id_valid =
      (await DB.select().from(contactsTable).where(eq(contactsTable.id, id)))[0]
        ?.id === undefined;
  }

  return id;
};

export const create = async (
  props: contactProps,
): Promise<return_info | contactProps> => {
  try {
    const id = await generateUniqueId();

    const contact = (
      await DB.insert(contactsTable)
        .values({ ...props, id })
        .returning()
    )[0];

    return contact as contactProps;
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};

export const drop = async (user_id: contactProps["user1_id"]) => {
  try {
    await DB.delete(contactsTable).where(
      or(
        eq(contactsTable.user1_id, user_id),
        eq(contactsTable.user2_id, user_id),
      ),
    );
    return {
      success: true,
      status: 200,
      message: "Successfully dropped contact",
    };
  } catch (e) {
    return {
      success: false,
      status: 500,
      message: "An internal server error occured",
      error: e,
    };
  }
};
