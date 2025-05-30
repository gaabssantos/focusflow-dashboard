import { CreateRoutineDTO } from "../dtos/routine.dto";
import { IRoutineRepository } from "../interfaces/routine.interface";
import { Routine } from "../models/routine.model";

export class CreateRoutineService {
  constructor(private routineRepository: IRoutineRepository) {}

  async execute(data: CreateRoutineDTO): Promise<Routine> {
    if (!data.title || !data.weekDay) {
      throw new Error("Título e dia da semana são obrigatórios.");
    }

    const routine = await this.routineRepository.create(data);
    return routine;
  }

  async findByUser(userId: string): Promise<Routine[]> {
    return await this.routineRepository.findByUser({ userId });
  }
}
