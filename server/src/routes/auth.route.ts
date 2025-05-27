import { Request, Response, Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const authRoutes = Router();
const authController = new AuthController();

authRoutes.post("/login", (req: Request, res: Response) => {
  authController.login(req, res);
});

export default authRoutes;
