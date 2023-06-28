import z from "zod";

const TRTs = z.enum([
  "TRT-1",
  "TRT-2",
  "TRT-3",
  "TRT-4",
  "TRT-5",
  "TRT-6",
  "TRT-7",
  "TRT-8",
  "TRT-9",
  "TRT-10",
  "TRT-11",
  "TRT-12",
  "TRT-13",
  "TRT-14",
  "TRT-15",
  "TRT-16",
  "TRT-17",
  "TRT-18",
  "TRT-19",
  "TRT-20",
  "TRT-21",
  "TRT-22",
  "TRT-23",
  "TRT-24",
]);

const timestamp = z.object({
  _seconds: z.number(),
  _nanoseconds: z.number(),
});

const successResult = z.object({
  response: z.object({
    url: z.string(),
    urlResult: z.string(),
    status: z.enum(["done"]),
    tribunal: TRTs,
    documento: z.string(),
    resposta: z.array(
      z.object({
        processos: z.array(
          z.object({
            numero_unico: z.string(),
            data: z.string(),
            url: z.string(),
            sistema: z.string(),
            instancia: z.string(),
            extra_instancia: z.string(),
            vara: z.string(),
          })
        ),
      })
    ),
    pdfUrl: z.string(),
  }),
  success: z.literal(true),
  tribunalSlug: TRTs,
});

const errorResult = z.object({
  error: z.string(),
  success: z.literal(false),
  status: z.enum(["error"]),
});

export const CertificatesWebhookResponseSchema = z.object({
  data: z.object({
    createdAt: timestamp,
    system: z.enum(["TRT"]),
    costCenterId: z.string(),
    document: z.string(),
    payment: z.array(
      z.object({
        at: timestamp,
        status: z.enum(["notInvoice"]),
      })
    ),
    id: z.string(),
    tribunal: TRTs,
    paymentStatus: z.enum(["notInvoice"]),
    status: z.enum(["todo", "error"]),
    updatedAt: timestamp,
    companyId: z.string(),
    systemSlug: z.enum(["trt"]),
    grau: z.number(),
    regiao: z.number(),
    webhook: z.array(
      z.object({
        match: z.string(),
        url: z.string(),
      })
    ),
  }),
  result: successResult.or(errorResult),
});

export type CertificatesWebhookResponse = z.infer<
  typeof CertificatesWebhookResponseSchema
>;
