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
    }
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
    }
  );
}
