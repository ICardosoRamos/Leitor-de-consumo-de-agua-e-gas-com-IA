import { FastifyRequest } from "fastify";
import { genAI, genAIFile } from "../../server";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { customAlphabet } from "nanoid";
import { PrismaClient } from "@prisma/client";

const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  10
);

const prisma = new PrismaClient();

const saveImageAndGenerateLink = async (
  base64Image: string
): Promise<string> => {
  const fileName = `${crypto.randomBytes(16).toString("hex")}.png`;
  const filePath = path.resolve(process.cwd(), "tmp", fileName);

  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const imageBuffer = Buffer.from(base64Data, "base64");
  await fs.writeFile(filePath, imageBuffer);

  return `/tmp/${fileName}`;
};

function fileToGenerativePart(image: string, mimeType = "image/jpeg") {
  return {
    inlineData: {
      data: image,
      mimeType,
    },
  };
}

async function measureImageNumberExtractor(image: string) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt =
    "The image its a water meter(Hydrometer). It shows the water consumption in cubic meters(this information does not matters so much), the point is that i need that you show me only the number/text from the meter, can you do this? Dont tell me any text that contains letters, only the number. And i also need only the number without any whitespaces leading and trailing and also in the middle of the number. Between each number will have an empty space because each number will be above a spinning piece and they are separeted, so, dont consider those empty spaces like numbers or white spaces okey? And also notice that the spinning pieces that has the numbers sometimes may be like half of the number already passed and its appering the next, i need that you consider in that case only the number above, the number that its vanishing already by the spinning gear.";

  const imagePart = fileToGenerativePart(image);

  const result = await model.generateContent([prompt, imagePart]);

  return result.response.text();
}

export async function postMeasures(req: FastifyRequest) {
  const createMeasureSchema = z.object({
    image: z.string().base64("Invalid Format"),
    customer_code: z.string(),
    measure_datetime: z.string().datetime(),
    measure_type: z.enum(["WATER", "GAS"]),
  });

  const { customer_code, image, measure_datetime, measure_type } =
    createMeasureSchema.parse(req.body);

  const measureDate = new Date(measure_datetime);

  const existingMeasure = await prisma.measure.findMany({
    where: {
      measure_month: measureDate.getMonth() + 1,
      measure_year: String(measureDate.getFullYear()),
      customer_code: customer_code,
      measure_type: measure_type,
    },
  });

  if (existingMeasure.length) {
    return {
      measure_already_exists: true,
    };
  }

  const text = (await measureImageNumberExtractor(image))
    .trim()
    .replace(/\s+/g, "");

  const measureUUID = nanoid();

  const tempLink = await saveImageAndGenerateLink(image);

  await prisma.measure.create({
    data: {
      customer_code: customer_code,
      measure_month: measureDate.getMonth() + 1,
      measure_year: String(measureDate.getFullYear()),
      uuid: measureUUID,
      measure_value: text,
      measure_type: measure_type,
      measure_datetime: measureDate,
      image_url: "http://localhost:3333" + tempLink,
    },
  });

  return {
    textExtracted: text,
    image_url: "http://localhost:3333" + tempLink,
    measure_uuid: measureUUID,
  };
}

export async function confirmOrCorrectLLMReading(req: FastifyRequest) {
  const createConfirmSchema = z.object({
    measure_uuid: z.string(),
    confirmed_value: z.number(),
  });

  const { confirmed_value, measure_uuid } = createConfirmSchema.parse(req.body);

  const measure = await prisma.measure.findUnique({
    where: { uuid: measure_uuid },
  });

  if (!measure) {
    return {
      measure_does_not_exist: true,
    };
  }

  if (measure.has_confirmed) {
    return {
      has_confirmed_already: true,
    };
  }

  await prisma.measure.update({
    where: { id: measure.id },
    data: {
      measure_value: String(confirmed_value),
      has_confirmed: true,
    },
  });
}

type TMeasures = {
  uuid: string;
  measure_datetime: Date;
  measure_type: string;
  has_confirmed: boolean;
  image_url: string;
};

export async function listCustomerMeasures(req: FastifyRequest) {
  const createListMeasuresSchema = z.object({
    measure_type: z
      .string()
      .transform((val) => val.toUpperCase())
      .optional()
      .refine((val) => !val || ["WATER", "GAS"].includes(val), {
        message: "Invalid measure type",
      }),
  });

  const { measure_type } = createListMeasuresSchema.parse(req.query);
  const { customer_code } = req.params as { customer_code: string };

  if (!customer_code) {
    return {
      customer_code_not_informed: true,
    };
  }

  let measures: TMeasures[] = [];

  if (measure_type) {
    measures = await prisma.measure.findMany({
      where: { measure_type: measure_type, customer_code: customer_code },
    });
  } else {
    measures = await prisma.measure.findMany({
      where: { customer_code: customer_code },
    });
  }

  if (!measures.length) {
    return {
      measures_not_found: true,
    };
  }

  return {
    measures: measures,
    customer_code: customer_code,
  };
}
