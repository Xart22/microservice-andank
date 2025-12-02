import fastifyJwt from "@fastify/jwt";
import fastifyMultipart from "@fastify/multipart";
import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import { ensureUploadDir } from "./helper/utils.js";
import { kegiatanRutinRoutes } from "./routes/kegiatan-rutin.routes.js";
import { sapulobangRoutes } from "./routes/sapulobang.routes.js";
import prismaPlugin from "./plugins/prisma.js";

async function buildServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(prismaPlugin);
  await fastify.register(fastifyMultipart, {
  attachFieldsToBody: true,
  limits: {
    fileSize: 200 * 1024 * 1024,    // 200 MB (aman untuk load test)
    fieldSize: 50 * 1024 * 1024,    // 50 MB untuk field-string JSON
    fields: 200,                    // jumlah field
    parts: 500,                     // total parts
    files: 50                       // file upload max
  }
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
