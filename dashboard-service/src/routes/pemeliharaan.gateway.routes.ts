import { FastifyInstance } from "fastify";
import { callService } from "../libs/httpClient";

export async function pemeliharaanGatewayRoutes(fastify: FastifyInstance) {
  const pemeliharaanServiceUrl = process.env.PEMELIHARAAN_SERVICE_URL!;
  // get all sapulobang by auth
  fastify.get("/sapulobang", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: "/sapulobang",
        method: "GET",
        body,
      });

      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // get all sapulobang
  fastify.get("/sapulobang/all", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: "/sapulobang/all",
        method: "GET",
        body,
      });

      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // get sapulobang by id
  fastify.get("/sapulobang/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/${id}`,
        method: "GET",
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // create sapulobang
  fastify.post("/sapulobang", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: "/sapulobang",
        method: "POST",
        body,
      });

      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  // delete sapulobang
  fastify.delete("/sapulobang/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/${id}`,
        method: "DELETE",
      });

      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  // update sapulobang
  fastify.put("/sapulobang/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/${id}`,
        method: "PUT",
        body,
      });

      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  // get sapulobang by ruas_jalan_id
  fastify.get("/sapulobang/ruas/:ruas_jalan_id", async (request, reply) => {
    try {
      const { ruas_jalan_id } = request.params as { ruas_jalan_id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/ruas/${ruas_jalan_id}`,
        method: "GET",
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // get sapulobang by sup_id
  fastify.get("/sapulobang/sup/:sup_id", async (request, reply) => {
    try {
      const { sup_id } = request.params as { sup_id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/sup/${sup_id}`,
        method: "GET",
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  // get sapulobang by uptd_id
  fastify.get("/sapulobang/uptd/:uptd_id", async (request, reply) => {
    try {
      const { uptd_id } = request.params as { uptd_id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/uptd/${uptd_id}`,
        method: "GET",
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // perencanaan sapulobang
  fastify.post("/sapulobang/perencanaan/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/perencanaan/${id}`,
        method: "POST",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // penanganan sapulobang
  fastify.post("/sapulobang/penanganan/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/sapulobang/penanganan/${id}`,
        method: "POST",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  //kegiatan rutin routes
  fastify.get("/kegiatan-rutin", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/kegiatan-rutin`,
        method: "GET",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  ///kegiatan rutin by id
  fastify.get("/kegiatan-rutin/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/kegiatan-rutin/${id}`,
        method: "GET",
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  // create kegiatan rutin
  fastify.post("/kegiatan-rutin", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/kegiatan-rutin`,
        method: "POST",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  // update kegiatan rutin
  fastify.put("/kegiatan-rutin/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: "/kegiatan-rutin`/${id}",
        method: "PUT",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // delete kegiatan rutin
  fastify.delete("/kegiatan-rutin/:id", async (request, reply) => {
    try {
      const { id } = request.params as { id: string };
      const result = await callService({
        serviceBaseUrl: pemeliharaanServiceUrl,
        path: `/kegiatan-rutin/${id}`,
        method: "DELETE",
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
}
