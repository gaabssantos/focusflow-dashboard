import moment from "moment";
import { IPomodoroDTO } from "../dtos/pomodoro.dto";
import { IPomodoroRepository } from "../interfaces/pomodoro.interface";
import { PomodoroModel } from "../models/pomodoro.model";

export class PomodoroRepository implements IPomodoroRepository {
  async incrementTodayCount(userId: string): Promise<IPomodoroDTO> {
    const today = moment().format("YYYY-MM-DD");

    // Busca o registro de hoje (deve existir pois startSession foi chamado antes)
    let record = await PomodoroModel.findOne({ userId, date: today });

    if (!record) {
      // Fallback: se não existir, cria um novo (não deveria acontecer)
      const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");
      const lastRecord = await PomodoroModel.findOne({ userId }).sort({
        date: -1,
      });

      const isYesterday =
        lastRecord &&
        moment(lastRecord.date).format("YYYY-MM-DD") === yesterday;
      const newStreak = isYesterday ? (lastRecord.currentStreak || 0) + 1 : 1;

      record = await PomodoroModel.create({
        userId,
        date: today,
        count: 1,
        currentStreak: newStreak,
        lastUpdated: new Date(),
      });
    } else {
      // Incrementa apenas o contador
      record.count += 1;
      record.lastUpdated = new Date();
      await record.save();
    }

    return {
      count: record.count,
      currentStreak: record.currentStreak,
    };
  }

  async getTodayCount(userId: string, onlyCount = 0): Promise<IPomodoroDTO> {
    const today = moment().format("YYYY-MM-DD");
    let count = 0;
    let currentStreak = 0;

    if (onlyCount == 1) {
      const record = await PomodoroModel.findOne({ userId, date: today });
      count = record?.count || 0;
      currentStreak = record?.currentStreak || 0;
    } else {
      const record = await PomodoroModel.findOne({ userId });
      currentStreak = record?.currentStreak || 0;
    }

    return {
      count,
      currentStreak,
    };
  }

  async streak(userId: string): Promise<{ currentStreak: number }> {
    const today = moment().format("YYYY-MM-DD");
    const yesterday = moment().subtract(1, "day").format("YYYY-MM-DD");

    // Tenta encontrar um registro do usuário para hoje
    let record = await PomodoroModel.findOne({ userId });

    if (!record) {
      // Tenta encontrar o último registro anterior (para verificar streak)
      const lastRecord = await PomodoroModel.findOne({ userId }).sort({
        date: -1,
      });

      const isYesterday =
        lastRecord &&
        moment(lastRecord.date).format("YYYY-MM-DD") === yesterday;
      const newStreak = isYesterday ? (lastRecord.currentStreak || 0) + 1 : 1;

      // Cria o novo registro do dia com streak atualizado, mas count zerado
      record = await PomodoroModel.create({
        userId,
        date: today,
        count: 0, // Inicia zerado, será incrementado apenas ao completar
        currentStreak: newStreak,
        lastUpdated: new Date(),
      });
    } else {
      const lastUpdatedDate = moment(record.lastUpdated).format("YYYY-MM-DD");

      if (lastUpdatedDate != today) {
        record.currentStreak += 1;
        record.lastUpdated = new Date();
        await record.save();
      }
      return {
        currentStreak: record.currentStreak,
      };
    }

    return {
      currentStreak: record.currentStreak,
    };
  }
}
