import { UserModel } from "../models/user.model";
import { ILoginDTO } from "../dtos/login.dto";
import jwt from "jsonwebtoken";
import { IAuthRepository } from "../interfaces/auth.interface";

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async login(data: ILoginDTO): Promise<string> {
    const user = await this.authRepository.login(data);

    return user;
  }
}
