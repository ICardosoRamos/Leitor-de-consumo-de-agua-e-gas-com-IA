import { app } from "../server.js";
import { measureRoutes } from "./measures/index.js";

export async function routes() {
  app.register(measureRoutes);
}
