import { Router, Request, Response } from "express";
import { ProfileController } from "../controllers/profile.controller";

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.post("/profile", (req: Request, res: Response) => {
  profileController.getProfile(req, res);
});

export default profileRoutes;
