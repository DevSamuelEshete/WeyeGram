import { Server } from "socket.io";
import http from "http";
import express from "express";
import { userProps } from "../types";
import { DOMAIN, PORT } from "../config/env.config";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      `http://localhost:${PORT}`,
      DOMAIN || "https://weyegram.onrender.com",
    ],
    credentials: true,
  },
});

const userSocketMap: { [key: string]: string } = {};

export const mapSocketId = (user_id: userProps["id"]): string | null => {
  const user_socket_id = userSocketMap[user_id];
  return user_socket_id || null;
};

io.on("connection", (socket) => {
  const user_id = socket.handshake.query.user_id as string;

  if (user_id) userSocketMap[user_id] = socket.id;
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    if (user_id && userSocketMap[user_id]) delete userSocketMap[user_id];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
