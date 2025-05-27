import { ICreateUserDTO } from "../dtos/create-user.dto";
import { IProfileRepository } from "../interfaces/profile.interface";
import { UserModel } from "../models/user.model";

export class ProfileRepository implements IProfileRepository {
  async execute(email: string): Promise<ICreateUserDTO | null> {
    const user = await UserModel.findOne({
      email,
    });

    return user;
  }
}
