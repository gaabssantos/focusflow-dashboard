import { Request, Response } from "express";
import { PomodoroService } from "../services/pomodoro.service";
import { PomodoroRepository } from "../repositories/pomodoro.repository";

const service = new PomodoroService(new PomodoroRepository());

export interface IRequest extends Request {
  user?: any;
}

export class PomodoroController {
  async incrementPomodoro(req: IRequest, res: Response) {
    try {
      const userId = req.user.id;
      const result = await service.incrementSession(userId);
      return res.json(result); // { count, currentStreak }
    } catch (err) {
      return res.status(500).json({ error: "Erro ao registrar pomodoro." });
    }
  }

  async getPomodoroToday(req: IRequest, res: Response) {
    try {
      const userId = req.user.id;
      const result = await service.getTodaySessionCount(userId);
      return res.json(result); // { count, currentStreak }
    } catch (err) {
      return res.status(500).json({ error: "Erro ao buscar sessões de hoje." });
    }
  }
}
