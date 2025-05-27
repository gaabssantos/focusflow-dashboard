import { CreateTaskDTO } from "../dtos/task.dto";
import { ITask } from "../models/task.model";

export interface ITaskInterface {
  create(data: CreateTaskDTO): Promise<ITask>;
  findByUser(userId: string): Promise<ITask[]>;
  updateStatus(taskId: string, status: string): Promise<ITask>;
  delete(taskId: string): Promise<ITask>;
  getTasksByDoneStatus(userId: string): Promise<number>;
  getTasksByProgressStatus(userId: string): Promise<number>;
}
