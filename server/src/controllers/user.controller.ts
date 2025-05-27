import { Request, Response } from "express";
import { UserRepository } from "../repositories/user.repository";
import { CreateUserService } from "../services/create-user.service";
import bcrypt from "bcrypt";

export class UserController {
  constructor() {
    this.create = this.create.bind(this);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, email, password } = req.body;

    const userRepository = new UserRepository();
    const createUser = new CreateUserService(userRepository);

    try {
      const user = await createUser.execute({ name, email, password });
      return res.status(201).json(user);
    } catch (error) {
      return res.status(400).json({ message: (error as Error).message });
    }
  }
}
