import { Router, Request, Response } from "express";
import { UserController } from "../controllers/user.controller";

const userRoutes = Router();
const userController = new UserController();

userRoutes.post("/users", (req: Request, res: Response) => {
  userController.create(req, res);
});

export default userRoutes;
