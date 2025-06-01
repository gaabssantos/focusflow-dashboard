import { ICreateUserDTO } from "../dtos/create-user.dto";
import { IProfileDTO } from "../dtos/profile.dto";
import { IProfileRepository } from "../interfaces/profile.interface";
import { UserModel } from "../models/user.model";

export class ProfileService {
  constructor(private profileRepository: IProfileRepository) {}

  async execute(email: string): Promise<ICreateUserDTO | null> {
    const user = await this.profileRepository.execute(email);

    return user;
  }

  async changeProfile(data: IProfileDTO, _id: string | undefined): Promise<ICreateUserDTO | null> {
    const user = await this.profileRepository.changeProfile(data, _id);

    return user;
  }
}
