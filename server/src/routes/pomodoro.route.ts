import { Router } from "express";
import { PomodoroController } from "../controllers/pomodoro.controller";

const pomodoroRoutes = Router();
const pomodoroController = new PomodoroController();

pomodoroRoutes.post("/pomodoro", (req, res) => {
  pomodoroController.create(req, res);
});

pomodoroRoutes.get("/pomodoro/session", (req, res) => {
  pomodoroController.getSessionById(req, res);
});

export default pomodoroRoutes;
