import { Router } from "express";
import { GetAll, SendMessage } from "../controllers/message.controller";

const messageRouter = Router();

messageRouter.get("/:contacts_id", GetAll);
messageRouter.post("/send", SendMessage);

export default messageRouter;
