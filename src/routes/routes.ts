import { app } from "../server.js";
import { MeasureRoutes } from "./measures/index.js";

export default async function Routes() {
  app.register(MeasureRoutes);
}
