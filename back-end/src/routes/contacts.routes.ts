import { Router } from "express";
import {
  createContacts,
  getContacts,
} from "../controllers/contacts.controllers";

const contactRouter = Router();

contactRouter.get("/", getContacts);
contactRouter.post("/new", createContacts);

export default contactRouter;
