import { ICreateUserDTO } from "../dtos/create-user.dto";

export interface IProfileRepository {
  execute(email: string): Promise<ICreateUserDTO | null>;
}
