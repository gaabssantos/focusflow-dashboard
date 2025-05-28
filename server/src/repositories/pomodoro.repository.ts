import moment from "moment";
import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";
import { PomodoroModel } from "../models/pomodoro.model";

export class PomodoroRepository implements IPomodoroRepository {
  async incrementTodayCount(userId: string): Promise<IPomodoroDTO> {
    const today = moment().format('YYYY-MM-DD');

    const updated = await PomodoroModel.findOneAndUpdate(
      { userId, date: today },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    return { count: updated.count };
  }

  async getTodayCount(userId: string): Promise<IPomodoroDTO> {
    const today = moment().format('YYYY-MM-DD');

    const record = await PomodoroModel.findOne({ userId, date: today });

    return { count: record?.count || 0 };
  }
}
