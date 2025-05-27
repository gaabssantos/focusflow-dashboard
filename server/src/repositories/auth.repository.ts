import { IAuthUserDTO } from "../dtos/auth.dto";
import { IAuthRepository } from "../interfaces/auth.interface";
import { UserModel } from "../models/user.model";
import jwt from "jsonwebtoken";

export class AuthRepository implements IAuthRepository {
  async login(data: IAuthUserDTO): Promise<string> {
        const user = await UserModel.findOne({ email: data.email });
    
        if (!user || !(await user.comparePassword(data.password))) {
          throw new Error("E-mail ou senha inválidos.");
        }
    
        const token = jwt.sign(
          { id: user._id, email: user.email },
          process.env.JWT_SECRET as string,
          { expiresIn: "1d" }
        );
    
        return token;
  }
}
