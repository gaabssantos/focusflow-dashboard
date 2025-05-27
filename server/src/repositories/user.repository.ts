import { IUserRepository } from "../interfaces/user.interface";
import { ICreateUserDTO } from "../dtos/create-user.dto";
import { UserModel, IUser } from "../models/user.model";

export class UserRepository implements IUserRepository {
  async create(data: ICreateUserDTO): Promise<IUser> {
    const user = new UserModel(data);
    await user.save();
    return user;
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return UserModel.findOne({ email });
  }
}
