import { Redis } from "@upstash/redis";
import { createClient } from "redis";
import { REDIS_PORT, REDIS_TOKEN, REDIS_URL } from "../config/env.config";

const client = createClient({
  url: REDIS_URL,
  socket: {
    tls: true,
    rejectUnauthorized: false,
  },
}).on("error", (e) => {
  throw e;
});

client.connect().catch((e) => {
  throw e;
});

export default client;
