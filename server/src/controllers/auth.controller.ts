import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRepository } from "../repositories/auth.repository";

export class AuthController {
  constructor() {
    this.login = this.login.bind(this);
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const authRepository = new AuthRepository();
    const authService = new AuthService(authRepository);

    try {
      const token = await authService.login({ email, password });
      return res.json({ email, token });
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  }
}
