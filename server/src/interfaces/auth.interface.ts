import { IAuthUserDTO } from "../dtos/auth.dto";

export interface IAuthRepository {
  login(data: IAuthUserDTO): Promise<string>;
}
