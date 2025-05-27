import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";
import { IPomodoro } from "../models/pomodoro.model";

export class PomodoroService {
  constructor(private pomodoroRepository: IPomodoroRepository) {}

  async create(data: IPomodoroDTO): Promise<IPomodoro> {
    const pomodoro = await this.pomodoroRepository.create(data);

    return pomodoro;
  }
}
