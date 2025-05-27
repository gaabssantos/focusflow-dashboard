import { IUserRepository } from "../interfaces/user.interface";
import { ICreateUserDTO } from "../dtos/create-user.dto";
import { IUser } from "../models/user.model";

export class CreateUserService {
  constructor(private userRepository: IUserRepository) {}

  async execute(data: ICreateUserDTO): Promise<IUser> {
    const existingUser = await this.userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new Error("User already exists.");
    }

    const user = await this.userRepository.create(data);
    return user;
  }
}
