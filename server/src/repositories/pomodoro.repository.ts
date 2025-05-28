import moment from "moment";
import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";
import { PomodoroModel } from "../models/pomodoro.model";

export class PomodoroRepository implements IPomodoroRepository {
  async incrementTodayCount(userId: string): Promise<IPomodoroDTO> {
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

    // Tenta encontrar um registro do usuário para hoje
    let record = await PomodoroModel.findOne({ userId, date: today });

    if (!record) {
      // Tenta encontrar o último registro anterior (para verificar streak)
      const lastRecord = await PomodoroModel.findOne({ userId }).sort({
        date: -1,
      });

      const isYesterday =
        lastRecord &&
        moment(lastRecord.date).format("YYYY-MM-DD") === yesterday;
      const newStreak = isYesterday ? (lastRecord.currentStreak || 0) + 1 : 1;

      // Cria o novo registro do dia com o streak atualizado
      record = await PomodoroModel.create({
        userId,
        date: today,
        count: 1,
        currentStreak: newStreak,
        lastUpdated: new Date(),
      });
    } else {
      // Se já existe registro hoje, apenas incrementa o contador
      record.count += 1;
      record.lastUpdated = new Date();
      await record.save();
    }

    return {
      count: record.count,
      currentStreak: record.currentStreak,
    };
  }

  async getTodayCount(userId: string): Promise<IPomodoroDTO> {
    const today = moment().format("YYYY-MM-DD");

    const record = await PomodoroModel.findOne({ userId, date: today });

    return {
      count: record?.count || 0,
      currentStreak: record?.currentStreak || 0,
    };
  }
}
