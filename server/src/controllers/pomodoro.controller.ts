import { Request, Response } from "express";
import { PomodoroRepository } from "../repositories/pomodoro.repository";
import { PomodoroService } from "../services/pomodoro.service";

export interface IRequest extends Request {
  user?: any;
}

export class PomodoroController {
  constructor() {
    this.create = this.create.bind(this);
  }

  async create(req: IRequest, res: Response): Promise<Response> {
    const { sessionToday } = req.body;

    const pomodoroRepository = new PomodoroRepository();
    const pomodoroService = new PomodoroService(pomodoroRepository);

    try {
      const pomodoro = await pomodoroService.create({ sessionToday, userId: req.user.id });
      return res.json(pomodoro);
    } catch (error) {
      return res.status(401).json({ message: (error as Error).message });
    }
  }
}
