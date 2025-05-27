import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";
import { IPomodoro, PomodoroModel } from "../models/pomodoro.model";

export class PomodoroRepository implements IPomodoroRepository {
  async create(data: IPomodoroDTO): Promise<IPomodoro> {
    let pomodoro = await PomodoroModel.findOne({ userId: data.userId });
    if (!pomodoro) {
      pomodoro = await PomodoroModel.create(data);
    }

    return pomodoro;
  }

  async getSessionById(userId: string): Promise<number> {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const sessionsCount = await PomodoroModel.countDocuments({
      userId: userId,
      status: "done",
      createdAt: {
      $gte: startOfDay,
      $lte: endOfDay,
      },
    });

    return sessionsCount;
  }
}
