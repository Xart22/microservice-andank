import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import prismaPlugin from "./plugins/prisma.js";
import fastifyJwt from "@fastify/jwt";
import { ensureUploadDir } from "./helper/utils.js";
import fastifyMultipart from "@fastify/multipart";
import dataUmumRoutes from "./routes/data-umum.routes.js";
import jadualRoutes from "./routes/jadual.routes.js";
import laporanMingguanRoutes from "./routes/laporan-mingguan.routes.js";
import dataUmumFileRoutes from "./routes/data-umum-file.routes.js";

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
    return { status: "ok", service: "talikuat-service" };
  });

  // register routes
  fastify.register(dataUmumRoutes, { prefix: "/data-umum" });
  fastify.register(jadualRoutes, { prefix: "/jadual" });
  fastify.register(laporanMingguanRoutes, { prefix: "/laporan-mingguan" });
  fastify.register(dataUmumFileRoutes, { prefix: "/data-umum-file" });

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: 3003, host: "0.0.0.0" });
    console.log("Tlikuat service running on http://localhost:3003");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();

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
