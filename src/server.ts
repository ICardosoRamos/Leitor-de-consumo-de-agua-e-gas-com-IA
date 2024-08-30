import fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import Routes from "./routes/routes";
import * as dotenvx from "@dotenvx/dotenvx";
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenvx.config();

export const genAIFile = new GoogleAIFileManager(
  process.env.GEMINI_API_KEY as string
);
export const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY as string
);

export const app = fastify({ bodyLimit: 10485760 });

app.register(fastifyCors, {
  origin: true,
  methods: ["GET", "POST", "DELETE", "PATCH", "UPDATE"],
});

app.register(fastifyMultipart);

app.register(Routes);

const port = process.env.PORT ? Number(process.env.PORT) : 3333;

app.listen(
  {
    host: "0.0.0.0",
    port: port,
  },
  (err, address) => {
    if (err) {
      return console.log(err);
    }

    return console.log("HTTP Server running on port: " + port);
  }
);
