import { FastifyInstance } from "fastify";
import { callService } from "../libs/httpClient.js";

export default async function laporanMasyarakatGatewayRoutes(
  fastify: FastifyInstance,
) {
  const laporanServiceUrl = process.env.LAPORAN_SERVICE_URL!;

  //get all laporan-masyarakat
  fastify.get("/laporan-masyarakat", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: laporanServiceUrl,
        path: "/laporan-masyarakat",
        method: "GET",
        headers: {
          authorization: authHeader,
        },
        body,
      });

      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  //get laporan-masyarakat by id
  fastify.get(
    "/laporan-masyarakat/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/laporan-masyarakat/${(request.params as any).id}`,
          method: "GET",
          headers: {
            authorization: authHeader,
          },
        });

        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  //create laporan-masyarakat
  fastify.post(
    "/laporan-masyarakat",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: "/laporan-masyarakat",
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body,
        });

        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  //delete laporan-masyarakat by id
  fastify.delete(
    "/laporan-masyarakat/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/laporan-masyarakat/${(request.params as any).id}`,
          method: "DELETE",
          headers: {
            authorization: authHeader,
          },
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //update laporan-masyarakat by id
  fastify.put(
    "/laporan-masyarakat/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/laporan-masyarakat/${(request.params as any).id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply

          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  //jenis laporan routes

  fastify.get("/jenis-laporan", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: laporanServiceUrl,
        path: "/jenis-laporan",
        method: "GET",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  //get jenis-laporan by id
  fastify.get(
    "/jenis-laporan/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/jenis-laporan/${(request.params as any).id}`,
          method: "GET",
          headers: {
            authorization: authHeader,
          },
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //create jenis-laporan
  fastify.post(
    "/jenis-laporan",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: "/jenis-laporan",
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //delete jenis-laporan by id
  fastify.delete(
    "/jenis-laporan/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,

          path: `/jenis-laporan/${(request.params as any).id}`,
          method: "DELETE",
          headers: {
            authorization: authHeader,
          },
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //update jenis-laporan by id
  fastify.put(
    "/jenis-laporan/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,

          path: `/jenis-laporan/${(request.params as any).id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply

          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  //response laporan routes
  fastify.get("/response-laporan", async (request, reply) => {
    try {
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: laporanServiceUrl,
        path: "/response-laporan",
        method: "GET",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
  //get response-laporan by id
  fastify.get(
    "/response-laporan/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/response-laporan/${(request.params as any).id}`,
          method: "GET",
          headers: {
            authorization: authHeader,
          },
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //create response-laporan
  fastify.post(
    "/response-laporan",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: "/response-laporan",
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //delete response-laporan by id
  fastify.delete(
    "/response-laporan/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/response-laporan/${(request.params as any).id}`,
          method: "DELETE",
          headers: {
            authorization: authHeader,
          },
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  //update response-laporan by id
  fastify.put(
    "/response-laporan/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: laporanServiceUrl,
          path: `/response-laporan/${(request.params as any).id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
}
