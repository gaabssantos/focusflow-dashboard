import { ICreateUserDTO } from "../dtos/create-user.dto";
import { UserModel } from "../models/user.model";

export class ProfileService {
  async execute(email: string): Promise<ICreateUserDTO | null> {
    const task = await UserModel.findOne({
      email,
    });

    return task;
  }
}
