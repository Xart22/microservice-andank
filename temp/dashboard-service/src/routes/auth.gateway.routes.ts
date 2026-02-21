// src/routes/auth.gateway.routes.ts
import { FastifyInstance } from "fastify";
import { callService } from "../libs/httpClient.js";

export default async function authGatewayRoutes(fastify: FastifyInstance) {
  const userServiceUrl = process.env.USER_SERVICE_URL!;

  fastify.post(
    "/login",

    async (request, reply) => {
      try {
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: userServiceUrl,
          path: "/auth/login",
          method: "POST",
          body,
        });

        return reply.send(result);
      } catch (err: any) {
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    }
  );

  fastify.get(
    "/me",
    { preHandler: [fastify.authenticate] },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: userServiceUrl,
          path: "/auth/me",
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
    }
  );
}
