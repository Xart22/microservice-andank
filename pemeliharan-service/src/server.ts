import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import prismaPlugin from "./plugins/prisma";
import fastifyJwt from "@fastify/jwt";
import { sapulobangRoutes } from "./routes/sapulobang.routes";
import { ensureUploadDir } from "./helper/utils";
import fastifyMultipart from "@fastify/multipart";
import { kegiatanRutinRoutes } from "./routes/kegiatan-rutin.routes";

async function buildServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(prismaPlugin);
  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
  });

  await ensureUploadDir();

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
    return { status: "ok", service: "pemeliharan-service" };
  });

  // register routes
  fastify.register(sapulobangRoutes, { prefix: "/sapulobang" });
  fastify.register(kegiatanRutinRoutes, { prefix: "/kegiatan-rutin" });

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: 3002, host: "0.0.0.0" });
    console.log("Pemeliharan service running on http://localhost:3002");
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
