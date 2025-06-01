import { ICreateUserDTO } from "../dtos/create-user.dto";
import { IProfileDTO } from "../dtos/profile.dto";

export interface IProfileRepository {
  execute(email: string): Promise<ICreateUserDTO | null>;
  changeProfile(data: IProfileDTO, _id: string | undefined): Promise<ICreateUserDTO | null>;
}
