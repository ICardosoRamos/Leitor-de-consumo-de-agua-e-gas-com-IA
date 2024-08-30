import { FastifyInstance } from "fastify";
import {
  PostMeasures,
  ConfirmOrCorrectLLMReading,
  ListCustomerMeasures,
} from "../../services/measures";
import path from "path";
import fs from "fs/promises";

export async function MeasureRoutes(app: FastifyInstance) {
  app.post("/upload", async (req, res) => {
    try {
      const response = await PostMeasures(req);

      if (response.measure_already_exists) {
        return res.status(409).send({
          error_code: "DOUBLE_REPORT",
          error_description: "Leitura do mês já realizada",
        });
      }

      return res.status(200).send({
        image_url: response.image_url,
        measure_value: Number(response.textExtracted),
        measure_uuid: response.measure_uuid,
        success_description: "Operação realizada com sucesso!",
      });
    } catch (error: any) {
      console.log(error);

      if (error.errors) {
        return res.status(400).send({
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos",
        });
      }

      return res.status(500).send(error);
    }
  });

  app.get("/tmp/:filename", async (req, res) => {
    const { filename } = req.params as { filename: string };
    const filePath = path.resolve(process.cwd(), "tmp", filename);
    const imageBuffer = await fs.readFile(filePath);

    res.type("image/png");

    try {
      res.send(imageBuffer);
    } catch (error) {
      console.log(error);
      res.status(404).send("File not found");
    }
  });

  app.patch("/confirm", async (req, res) => {
    try {
      const response = await ConfirmOrCorrectLLMReading(req);

      if (response?.measure_does_not_exist) {
        return res.status(404).send({
          error_code: "MEASURE_NOT_FOUND",
          error_description: "Leitura do mês já realizada",
        });
      }

      if (response?.has_confirmed_already) {
        return res.status(409).send({
          error_code: "CONFIRMATION_DUPLICATE",
          error_description: "Leitura do mês já realizada",
        });
      }

      return res.status(200).send({
        success: true,
      });
    } catch (error: any) {
      console.error(error);

      if (error.errors) {
        return res.status(400).send({
          error_code: "INVALID_DATA",
          error_description:
            "Os dados fornecidos no corpo da requisição são inválidos",
        });
      }

      return res.status(500).send(error);
    }
  });

  app.get("/:customer_code/list", async (req, res) => {
    try {
      const response = await ListCustomerMeasures(req);

      if (response?.customer_code_not_informed) {
        return res.status(400).send({
          error_code: "CUSTOMER_USER",
          error_description: "O código de cliente não foi informado",
        });
      }

      if (response.measures_not_found) {
        return res.status(404).send({
          error_code: "MEASURES_NOT_FOUND",
          error_description: "Nenhuma leitura encontrada",
        });
      }

      return res.status(200).send({
        customer_code: response.customer_code,
        measures: response.measures,
      });
    } catch (error: any) {
      console.error(error);

      if (error.errors) {
        return res.status(400).send({
          error_code: "INVALID_TYPE",
          error_description: "Tipo de medição não permitida",
        });
      }

      return res.status(500).send(error);
    }
  });
}
