import { Request, Response, NextFunction } from "express";
import { createMessage, getAllMessages } from "../services/message.service";
import { messageProps } from "../types";
import cloud from "../utils/cloud";
import { io, mapSocketId } from "../utils/socket";

export const GetAll = async (
  req: Request<{ contacts_id: string }>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const contacts_id = req.params.contacts_id;

    const messages = await getAllMessages(contacts_id);
    if ("success" in messages) throw messages;

    return res
      .status(200)
      .json({ message: "Successfully fetched messages", data: { messages } });
  } catch (e) {
    next(e);
  }
};

export const SendMessage = async (
  req: Request<{}, {}, messageProps>,
  res: Response,
  next: NextFunction,
) => {
  const props = req.body;
  const user_id = req.session.user?.id || "";

  try {
    if (props.images_url && props.images_url[0]) {
      const images_url = await Promise.all(
        props.images_url.map(async (image_url) => {
          const upload_data = await cloud.uploader.upload(image_url);
          return upload_data.secure_url;
        }),
      );

      props.images_url = images_url;
    }

    const new_message = await createMessage({ ...props, sender_id: user_id });
    if ("success" in new_message) throw new_message;

    const socket_id = mapSocketId(new_message.receiver_id);

    if (socket_id) {
      io.to(socket_id).emit("newMessage", new_message);
    }

    return res.status(201).json({
      message: "Message successfully sent!",
      data: { message: new_message },
    });
  } catch (e) {
    next(e);
  }
};
