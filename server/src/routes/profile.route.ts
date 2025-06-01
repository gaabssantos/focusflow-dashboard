import { Router, Request, Response } from "express";
import { ProfileController } from "../controllers/profile.controller";
import { ensureAuth } from "../middlewares/ensureAuth";

const profileRoutes = Router();
const profileController = new ProfileController();

profileRoutes.post("/profile", (req: Request, res: Response) => {
  profileController.getProfile(req, res);
});

profileRoutes.put("/profile", ensureAuth, (req: Request, res: Response) => {
  profileController.changeProfile(req, res);
});

export default profileRoutes;
