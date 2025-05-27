import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";
import { IPomodoro, PomodoroModel } from "../models/pomodoro.model";

export class PomodoroRepository implements IPomodoroRepository {
  async create(data: IPomodoroDTO): Promise<IPomodoro> {
    const pomodoro = await PomodoroModel.create(data);

    return pomodoro;
  }
}
