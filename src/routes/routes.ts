import { app } from "../server.js";
import { measureRoutes } from "./measures/index.js";

export default async function Routes() {
  app.register(measureRoutes);
}
