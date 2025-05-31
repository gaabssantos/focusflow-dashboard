import {
  CreateRoutineDTO,
  FindAllRoutinesByUserDTO,
} from "../dtos/routine.dto";
import { IRoutineRepository } from "../interfaces/routine.interface";
import { Routine, RoutineModel } from "../models/routine.model";

export class RoutineRepository implements IRoutineRepository {
  async create(data: CreateRoutineDTO): Promise<Routine> {
    const routine = new RoutineModel(data);
    await routine.save();
    return routine;
  }

  async delete(id: string): Promise<Routine> {
    const routine = await RoutineModel.findOneAndDelete({ _id: id }).lean();

    if (!routine) {
      throw new Error("Routine not found");
    }

    return routine as unknown as Routine;
  }

  async findByUser(data: FindAllRoutinesByUserDTO): Promise<Routine[]> {
    return await RoutineModel.find({ userId: data.userId });
  }
}
