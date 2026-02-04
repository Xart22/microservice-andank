import Fastify, { FastifyReply, FastifyRequest } from "fastify";
import fastifyMultipart from "@fastify/multipart";
import prismaPlugin from "./plugins/prisma.js";
import fastifyJwt from "@fastify/jwt";
import { rumijaRoutes } from "./routes/rumija.routes.js";
import { rumijaPelanggaranRoutes } from "./routes/rumija-pelenggaran.routes.js";
import { rumijaTypeRoutes } from "./routes/rumija-type.routes.js";
import { rumijaKelasRoutes } from "./routes/rumija-kelas.routes.js";
import { rumijaInventarisRoutes } from "./routes/rumija-inventaris.routes.js";
import { ensureUploadDir } from "./modules/helper/utils.js";

async function buildServer() {
  const fastify = Fastify({
    logger: true,
  });

  await fastify.register(fastifyMultipart, {
    attachFieldsToBody: true,
    limits: {
      fileSize: 200 * 1024 * 1024, // 200 MB (aman untuk load test)
      fieldSize: 50 * 1024 * 1024, // 50 MB untuk field-string JSON
      fields: 200, // jumlah field
      parts: 500, // total parts
      files: 50, // file upload max
    },
  });

  await ensureUploadDir();

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
    },
  );

  fastify.get("/health", async () => {
    return { status: "ok", service: "laporanMasyarakat-service" };
  });

  fastify.register(rumijaRoutes, { prefix: "/rumija" });
  fastify.register(rumijaPelanggaranRoutes, { prefix: "/rumija-pelanggaran" });
  fastify.register(rumijaTypeRoutes, { prefix: "/rumija-type" });
  fastify.register(rumijaKelasRoutes, { prefix: "/rumija-kelas" });
  fastify.register(rumijaInventarisRoutes, { prefix: "/rumija-inventaris" });

  return fastify;
}

async function start() {
  const fastify = await buildServer();

  try {
    await fastify.listen({ port: 3004, host: "0.0.0.0" });
    console.log("LaporanMasyarakat service running on http://localhost:3004");
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
      reply: FastifyReply,
    ) => Promise<void>;
  }
}
