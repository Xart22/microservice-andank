import { FastifyInstance } from "fastify";
import { callService } from "../libs/httpClient.js";

export async function rumijaGatewayRoutes(fastify: FastifyInstance) {
  const rumijaServiceUrl = process.env.RUMIJA_SERVICE_URL!;

  fastify.get(
    "/rumija",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija`,
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

  fastify.get(
    "/rumija/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija/${id}`,
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

  fastify.post(
    "/rumija",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija`,
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: err.message || "Error" });
      }
    },
  );

  fastify.delete(
    "/rumija/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija/${id}`,
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

  fastify.put(
    "/rumija/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija/${id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  fastify.get(
    "/rumija/rumija-pelanggaran",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-pelanggaran`,
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

  fastify.get(
    "/rumija/rumija-pelanggaran/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-pelanggaran/${id}`,
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

  fastify.post(
    "/rumija/rumija-pelanggaran",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-pelanggaran`,
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  fastify.put(
    "/rumija/rumija-pelanggaran/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-pelanggaran/${id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );

  fastify.delete(
    "/rumija/rumija-pelanggaran/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-pelanggaran/${id}`,
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

  fastify.get(
    "/rumija/rumija-types",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-types`,
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

  fastify.get(
    "/rumija/rumija-types/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-types/${id}`,
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
  fastify.post(
    "/rumija/rumija-types",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-types`,
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  fastify.put(
    "/rumija/rumija-types/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-types/${id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  fastify.delete(
    "/rumija/rumija-types/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-types/${id}`,
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
  fastify.get(
    "/rumija/rumija-kelas",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-kelas`,
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
  fastify.get(
    "/rumija/rumija-kelas/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-kelas/${id}`,
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
  fastify.post(
    "/rumija/rumija-kelas",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-kelas`,
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  fastify.put(
    "/rumija/rumija-kelas/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-kelas/${id}`,
          method: "PUT",
          headers: {
            authorization: authHeader,
          },
          body: request.body,
        });
        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    },
  );
  fastify.delete(
    "/rumija/rumija-kelas/:id",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const result = await callService({
          serviceBaseUrl: rumijaServiceUrl,
          path: `/rumija-kelas/${id}`,
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
}
