import { Request, Response } from "express";
import { ProfileService } from "../services/profile.service";

export class ProfileController {
  constructor() {
    this.getProfile = this.getProfile.bind(this);
  }

  async getProfile(req: Request, res: Response): Promise<Response> {
    const { email } = req.body;

    const profileService = new ProfileService();

    try {
      const user = await profileService.execute(email);
      return res.json({ user });
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  }
}
