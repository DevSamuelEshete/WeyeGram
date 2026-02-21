import { Request, Response, NextFunction } from "express";
import { contactProps, userProps } from "../types";
import { create, getAll } from "../services/contacts.service";
import { getUserById } from "../services/user.service";

export const getContacts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user_id = req.session.user?.id;

    if (!user_id)
      throw {
        success: false,
        status: 500,
        message: "An internal server error occured",
      };

    const contacts = await getAll(user_id);
    if ("success" in contacts) throw contacts;

    const userContacts: userProps[] = await Promise.all(
      contacts.map(async (contact) => {
        let id = contact.user1_id;
        if (contact.user1_id === user_id) id = contact.user2_id;

        const user = await getUserById(id);
        if ("success" in user) throw user;

        return {
          id: user.id,
          email: "",
          username: user.username,

          global_name: user.global_name,
          profile_url: user.profile_url,

          account_type: "google",
          contacts_id: contact.id,

          created_at: user.created_at,
          updated_at: user.updated_at,
        } as userProps;
      }),
    );

    return res.status(200).json({
      message: "Contacts successfully fetched",
      data: { contacts: userContacts },
    });
  } catch (e) {
    next(e);
  }
};

export const createContacts = async (
  req: Request<{}, {}, contactProps>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user1_id = req.session.user?.id;

    if (!req.body.user2_id || !user1_id)
      throw {
        success: false,
        status: 400,
        message: "exactly 2 users must be present",
        error: "Contacts Length Error",
      };

    req.body.user1_id = user1_id;

    const new_contact = await create(req.body);

    return res.status(200).json({
      message: "Contact successfully created",
      data: { contact: new_contact },
    });
  } catch (e) {
    next(e);
  }
};
