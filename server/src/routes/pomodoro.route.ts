import { Response, Router } from "express";
import {
  IRequest,
  PomodoroController,
} from "../controllers/pomodoro.controller";
import { ensureAuth } from "../middlewares/ensureAuth";

const pomodoroRoutes = Router();
const pomodoroController = new PomodoroController();

pomodoroRoutes.get(
  "/pomodoro/stats/:onlyCount",
  ensureAuth,
  async (req: IRequest, res: Response) => {
    await pomodoroController.getPomodoroToday(req, res);
  }
);

pomodoroRoutes.post(
  "/pomodoro/increment",
  ensureAuth,
  async (req: IRequest, res: Response) => {
    await pomodoroController.incrementPomodoro(req, res);
  }
);

pomodoroRoutes.post(
  "/pomodoro/streak",
  ensureAuth,
  async (req: IRequest, res: Response) => {
    await pomodoroController.streakPomodoro(req, res);
  }
);

export default pomodoroRoutes;
