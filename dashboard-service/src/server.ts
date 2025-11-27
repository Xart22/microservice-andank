import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import fastifyJwt from "@fastify/jwt";
import { ruasRoutes } from "./routes/ruas.routes.js";
import { supRoutes } from "./routes/sup.routes.js";
import { uptdRoutes } from "./routes/uptd.routes.js";
import talikuatGatewayRoutes from "./routes/talikuat.gateway.route.js";
import authGatewayRoutes from "./routes/auth.gateway.routes.js";
import { pemeliharaanGatewayRoutes } from "./routes/pemeliharaan.gateway.routes.js";
import laporanMasyarakatGatewayRoutes from "./routes/laporan-masyarakat.gateway.routes.js";
import { rumijaGatewayRoutes } from "./routes/rumija.gateway.routes.js";

async function buildServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(prismaPlugin);

  await fastify.register(fastifyJwt, {
    secret: process.env.JWT_SECRET || "dev-secret",
  });

  // auth middleware
  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify(); // isi request.user
      } catch (err) {
        reply.code(401).send({ message: "Unauthorized" });
      }
    }
  );

  fastify.get("/health", async () => {
    return { status: "ok", service: "order-service" };
  });

  fastify.register(ruasRoutes, { prefix: "/ruas" });
  fastify.register(supRoutes, { prefix: "/sup" });
  fastify.register(uptdRoutes, { prefix: "/uptd" });
  fastify.register(talikuatGatewayRoutes, { prefix: "/gateway" });
  fastify.register(authGatewayRoutes, { prefix: "/gateway" });
  fastify.register(pemeliharaanGatewayRoutes, { prefix: "/gateway" });
  fastify.register(laporanMasyarakatGatewayRoutes, { prefix: "/gateway" });
  fastify.register(rumijaGatewayRoutes, { prefix: "/gateway" });

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: 3000, host: "0.0.0.0" });
    console.log("Dashboard service running on http://localhost:3000");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

// Type augmentation untuk JWT & authenticate

declare module "@fastify/jwt" {
  interface FastifyJWT {
    user: {
      sub: number;
      email: string;
      role_id: number;
      role_name: string | null;
      sup_id: number | null;
      uptd_id: number | null;
    };
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}
