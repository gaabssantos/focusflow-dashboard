import { CreateRoutineDTO, FindAllRoutinesByUserDTO } from "../dtos/routine.dto";
import { Routine } from "../models/routine.model";

export interface IRoutineRepository {
  create(data: CreateRoutineDTO): Promise<Routine>;
  findByUser(data: FindAllRoutinesByUserDTO): Promise<Routine[]>;
}
