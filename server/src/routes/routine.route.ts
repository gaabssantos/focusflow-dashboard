import { Request, Response, Router } from "express";
import { RoutineController } from "../controllers/routine.controller";
import { ensureAuth } from "../middlewares/ensureAuth";

export const routineRoutes = Router();
const routineController = new RoutineController();

routineRoutes.post("/routine", ensureAuth, (req: Request, res: Response) => {
  routineController.handle(req, res);
});

routineRoutes.get("/routine", ensureAuth, (req: Request, res: Response) => {
  routineController.findByUser(req, res);
});

export default routineController;
