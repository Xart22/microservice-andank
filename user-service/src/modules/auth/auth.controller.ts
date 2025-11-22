import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";

type LoginBody = {
  email: string;
  password: string;
};

export class AuthController {
  constructor(private authService: AuthService) {}

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as LoginBody;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return reply.code(401).send({ message: "Invalid credentials" });
    }

    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
      role_id: user.role_id,
      role_name: user.role?.name ?? null,
      sup_id: user.sup_id ?? null,
      uptd_id: user.uptd_id ?? null,
    });

    return reply.send({
      access_token: token,
      token_type: "Bearer",
    });
  };

  me = async (req: FastifyRequest, reply: FastifyReply) => {
    // request.user diisi oleh jwtVerify()
    return reply.send(req.user);
  };
}
