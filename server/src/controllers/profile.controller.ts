import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";
import { ProfileRepository } from "../repositories/profile.repository";

export interface IRequest extends Request {
  user?: any;
}

export class ProfileController {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const profileRepository = new ProfileRepository();
    const profileService = new ProfileService(profileRepository);

    try {
      const user = await profileService.execute(email);
      return res.json({ user });
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  }

  async changeProfile(req: IRequest, res: Response): Promise<Response> {
    const { name, email, currentPassword, newPassword } = req.body;

    const profileRepository = new ProfileRepository();
    const profileService = new ProfileService(profileRepository);

    try {
      const user = await profileService.changeProfile({
        name,
        email,
        currentPassword,
        newPassword,
      }, req.user?.id);
      return res.json({ user });
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  }
}
