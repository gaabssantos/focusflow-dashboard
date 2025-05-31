import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";

export class PomodoroService {
  constructor(private readonly repository: IPomodoroRepository) {}

  async incrementSession(userId: string): Promise<IPomodoroDTO> {
    return await this.repository.incrementTodayCount(userId);
  }

  async getTodaySessionCount(userId: string, onlyCount: number): Promise<IPomodoroDTO> {
    return await this.repository.getTodayCount(userId, onlyCount);
  }

  async streak(userId: string): Promise<{ currentStreak: number }> {
    return await this.repository.streak(userId);
  }
}
