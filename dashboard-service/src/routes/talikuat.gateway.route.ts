// src/routes/paket.gateway.routes.ts
import { FastifyInstance } from "fastify";
import { callService } from "../libs/httpClient.js";
import { requireRoles } from "../middleware/requireRoles.js";

export default async function talikuatGatewayRoutes(fastify: FastifyInstance) {
  const talikuatServiceUrl = process.env.TALIKUAT_SERVICE_URL!;

  // Contoh: get list paket (hanya ADMIN & PPK)
  fastify.get(
    "/talikuat",
    {
      preHandler: [fastify.authenticate, requireRoles(["ADMIN", "PPK"])],
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";

        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: "/paket", // sesuaikan dengan route di paket-service
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
  //get data umum by auth
  fastify.get(
    "/talikuat/data-umum",
    {
      preHandler: [fastify.authenticate, requireRoles(["ADMIN", "PPK"])],
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";

        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: "/data-umum",
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
  // get all data umum
  fastify.get(
    "/talikuat/data-umum/all",
    {
      preHandler: [fastify.authenticate, requireRoles(["ADMIN", "PPK"])],
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: "/data-umum/all",
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

  // create data umum
  fastify.post(
    "/talikuat/data-umum",
    {
      preHandler: [fastify.authenticate, requireRoles(["ADMIN", "PPK"])],
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: "/data-umum",
          method: "POST",
          headers: {
            authorization: authHeader,
          },
          body,
        });
        return reply.send(result);
      } catch (err: any) {
        console.log(err);
        reply
          .code(err.statusCode || 500)
          .send(err.body || { message: "Error" });
      }
    }
  );

  // update data umum
  fastify.put(
    "/talikuat/data-umum/:id",
    {
      preHandler: [fastify.authenticate, requireRoles(["ADMIN", "PPK"])],
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: `/data-umum/${id}`,
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
    }
  );

  // addendum data umum
  fastify.post(
    "/talikuat/data-umum/adendum/:id",
    {
      preHandler: [fastify.authenticate, requireRoles(["ADMIN", "PPK"])],
    },
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { id } = request.params as { id: string };
        const body = request.body;
        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: `/data-umum/adendum/${id}`,
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
    }
  );

  // jadual routes
  fastify.get("/talikuat/jadual", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/jadual`,
        method: "GET",
        headers: {
          authorization: authHeader,
        },
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  fastify.post("/talikuat/jadual", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/jadual`,
        method: "POST",
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

  // update jadual
  fastify.put("/talikuat/jadual/:id", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const { id } = request.params as { id: string };
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/jadual/${id}`,
        headers: {
          authorization: authHeader,
        },
        method: "PUT",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  // get jadual by id
  fastify.get("/talikuat/jadual/:id", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const { id } = request.params as { id: string };
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/jadual/data-umum-detail/${id}`,
        method: "GET",
        headers: {
          authorization: authHeader,
        },
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  //laporan mingguan routes
  fastify.get(
    "/talikuat/laporan-mingguan/:dataUmumId",
    async (request, reply) => {
      try {
        const authHeader = request.headers.authorization || "";
        const { dataUmumId } = request.params as { dataUmumId: string };
        const result = await callService({
          serviceBaseUrl: talikuatServiceUrl,
          path: `/data-umum/laporan-mingguan/${dataUmumId}`,
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

  fastify.post("/talikuat/laporan-mingguan", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/data-umum/laporan-mingguan`,
        method: "POST",
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

  fastify.put("/talikuat/laporan-mingguan/:id", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const { id } = request.params as { id: string };
      const body = request.body;
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/data-umum/laporan-mingguan/${id}`,
        headers: {
          authorization: authHeader,
        },
        method: "PUT",
        body,
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });

  fastify.delete("/talikuat/laporan-mingguan/:id", async (request, reply) => {
    try {
      const authHeader = request.headers.authorization || "";
      const { id } = request.params as { id: string };
      const result = await callService({
        serviceBaseUrl: talikuatServiceUrl,
        path: `/data-umum/laporan-mingguan/${id}`,
        method: "DELETE",
        headers: {
          authorization: authHeader,
        },
      });
      return reply.send(result);
    } catch (err: any) {
      reply.code(err.statusCode || 500).send(err.body || { message: "Error" });
    }
  });
}
