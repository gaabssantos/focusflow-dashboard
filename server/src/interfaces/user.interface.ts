import { ICreateUserDTO } from "../dtos/create-user.dto";
import { IUser } from "../models/user.model";

export interface IUserRepository {
  create(data: ICreateUserDTO): Promise<IUser>;
  findByEmail(email: string): Promise<IUser | null>;
}
