import { ICreateUserDTO } from "../dtos/create-user.dto";
import { IProfileDTO } from "../dtos/profile.dto";
import { IProfileRepository } from "../interfaces/profile.interface";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";

export class ProfileRepository implements IProfileRepository {
  async execute(email: string): Promise<ICreateUserDTO | null> {
    const user = await UserModel.findOne({
      email,
    });

    return user;
  }

  async changeProfile(
    data: IProfileDTO,
    _id: string | undefined
  ): Promise<ICreateUserDTO | null> {
    const currentUser = await UserModel.findById(_id);
    let newPassword;

    if (data.currentPassword && data.newPassword) {
      if (
        currentUser &&
        !(await currentUser.comparePassword(data.currentPassword))
      ) {
        throw new Error("As senhas não são as mesmas.");
      }

      newPassword = await bcrypt.hash(data.newPassword, 10);
    }

    const user = await UserModel.findByIdAndUpdate(
      _id,
      { email: data.email, name: data.name, password: newPassword },
      { new: true }
    );

    return user;
  }
}
