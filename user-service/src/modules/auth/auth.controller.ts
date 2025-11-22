import { FastifyReply, FastifyRequest } from "fastify";
import { AuthService } from "./auth.service";

type LoginBody = {
  email: string;
  password: string;
};

export class AuthController {
  authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  login = async (req: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = req.body as LoginBody;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      return reply.code(401).send({ message: "Invalid credentials" });
    }

    // payload token – include info yang sering dipakai di service lain
    const token = await reply.jwtSign({
      sub: user.id,
      email: user.email,
      role_id: user.role_id,
      sup_id: user.sup_id,
      uptd_id: user.uptd_id,
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
