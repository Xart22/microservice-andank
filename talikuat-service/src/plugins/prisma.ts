import fp from "fastify-plugin";
import { FastifyInstance } from "fastify";

import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../../generated/prisma/client";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}

async function prismaPlugin(fastify: FastifyInstance) {
  const connectionString = `${process.env.DATABASE_URL}`;
  const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
  });
  const prisma = new PrismaClient({ adapter });
  await prisma.$connect();
  fastify.log.info("Prisma connected to MySQL");

  fastify.decorate("prisma", prisma);

  fastify.addHook("onClose", async (app) => {
    app.log.info("Disconnecting Prisma");
    await app.prisma.$disconnect();
  });
}

export default fp(prismaPlugin);
