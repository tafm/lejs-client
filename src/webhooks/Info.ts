/* 
  Esquema criado e validado em cima de uma base com mais de 10.000 respostas do legis
*/

import z from "zod";

const timestamp = z.object({
  _seconds: z.number(),
  _nanoseconds: z.number(),
});

const successResult = z.object({
  success: z.literal(true),
  error: z.null().optional(), // aparentemente quando system = tje vem undefined e pje vem null
  rawResponse: z.object({
    primeiraInstancia: z.string().nullable(),
    segundaInstancia: z.string().nullable(),
  }),
  trt: z.number(),
});

const errorResult1 = z.object({
  success: z.literal(false),
  error: z.enum([
    "lawsuit-not-found",
    "generic-error",
    "cookie-not-found",
    "system",
    "confidential",
  ]),
  rawResponse: z.object({
    primeiraInstancia: z.string().nullable(),
    segundaInstancia: z.string().nullable(),
  }),
  trt: z.number(),
});

const errorResult2 = z.object({
  success: z.literal(false),
  error: z.enum(["pje-request-limit-reached - error"]),
});

export const InfoSchema = z.object({
  data: z.object({
    rawResponse: z.string().nullable(),
    token: z.string().nullable(), // TODO -> identificar casos que vem nulo
    createdAt: timestamp,
    system: z.enum(["PJE", "JTE"]),
    costCenterId: z.string(),
    trt: z.number(),
    payment: z.array(
      z.object({
        at: timestamp,
        status: z.enum(["notInvoice"]),
      })
    ),
    id: z.string(),
    paymentStatus: z.enum(["notInvoice"]),
    lawsuitId: z.string(),
    status: z.enum(["todo"]),
    updatedAt: timestamp,
    companyId: z.string(),
    systemSlug: z.enum(["pje", "jte"]),
    grau: z.number(),
    lawsuitData: z.string(),
    password: z.string().optional(), // aparentemente só vem quando systemSlug = pje
    webhook: z.array(
      z.object({
        match: z.string(),
        url: z.string(),
      })
    ),
  }),
  result: successResult.or(errorResult1).or(errorResult2),
});

export type InfoWebhookResponse = z.infer<typeof InfoSchema>;
