import { IPomodoroDTO } from "../dtos/pomodoro.dto";

export interface IPomodoroRepository {
  incrementTodayCount(userId: string): Promise<IPomodoroDTO>;
  getTodayCount(userId: string): Promise<IPomodoroDTO>;
}
