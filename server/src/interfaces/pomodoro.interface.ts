import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoro } from "../models/pomodoro.model";

export interface IPomodoroRepository {
  create(data: IPomodoroDTO): Promise<IPomodoro>;
  getSessionById(id: string): Promise<number>;
}
