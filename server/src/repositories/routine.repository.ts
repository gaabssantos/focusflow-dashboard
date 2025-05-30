import { CreateRoutineDTO, FindAllRoutinesByUserDTO } from "../dtos/routine.dto";
import { IRoutineRepository } from "../interfaces/routine.interface";
import { Routine, RoutineModel } from "../models/routine.model";

export class RoutineRepository implements IRoutineRepository {
  async create(data: CreateRoutineDTO): Promise<Routine> {
    const routine = new RoutineModel(data);
    await routine.save();
    return routine;
  }
  async findByUser(data: FindAllRoutinesByUserDTO): Promise<Routine[]> {
    return await RoutineModel.find({ userId: data.userId });
  }
}
