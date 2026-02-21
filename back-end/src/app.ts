import express from "express";
import {
  PORT,
  SESSION_SECRET,
  SESSION_AGE,
  NODE_ENV,
} from "./config/env.config";

import { log } from "./utils";

import session from "express-session";
import { RedisStore } from "connect-redis";

import authRouter from "./routes/auth.routes";
import userRouter from "./routes/user.routes";
import contactRouter from "./routes/contacts.routes";
import messageRouter from "./routes/message.routes";

import errorMiddleware from "./middlewares/error.middleware";
import authMiddleware from "./middlewares/auth.middleware";

import client from "./utils/redisClient";

import cors from "cors";
import cookieParser from "cookie-parser";
import verifyMiddleware from "./middlewares/verify.middleware";
import { app, server } from "./utils/socket";
import path from "path";

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

const redisStore = new RedisStore({ client });

app.use(
  cors({
    origin: [`http://localhost:${PORT}`, "https://weyegram.onrender.com/"],
    credentials: true,
  }),
);

app.use(
  session({
    name: "sid", // name of the cookie
    secret: SESSION_SECRET || "supersecret",
    resave: false,
    saveUninitialized: false,
    store: redisStore,
    cookie: {
      httpOnly: true, // JS cannot access cookie
      secure: false, // set true in production (HTTPS)
      sameSite: "lax",
      maxAge: parseInt(SESSION_AGE || "604800000"), // 1 week
    },
  }),
);

app.use("/auth", authRouter);
app.use("/users", authMiddleware, userRouter);

app.use("/contacts", authMiddleware, verifyMiddleware, contactRouter);
app.use("/messages", authMiddleware, verifyMiddleware, messageRouter);

app.use(errorMiddleware);

if (NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../front-end", "dist")));

  app.get("/*home", (req, res) => {
    res.sendFile(path.join(__dirname, "../../front-end", "dist", "index.html"));
  });
}

console.log("PORT:", PORT);

server.listen(PORT, async () => {
  console.log(`API running on localhost:${PORT}`);
  log({ type: "success", info: "Successfully connected to database" });
});
