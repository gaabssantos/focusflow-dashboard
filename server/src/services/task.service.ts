import { TaskModel } from "../models/task.model";
import { CreateTaskDTO } from "../dtos/task.dto";
import { ITaskInterface } from "../interfaces/task.interface";

export class CreateTaskService {
  constructor(private taskRepository: ITaskInterface) {}

  async execute(data: CreateTaskDTO) {
    const task = await this.taskRepository.create(data);

    return task;
  }

  async findByUser(userId: string) {
    const tasks = await this.taskRepository.findByUser(userId);

    return tasks;
  }

  async updateStatus(taskId: string, status: string) {
    const task = await this.taskRepository.updateStatus(taskId, status);

    return task;
  }

  async delete(taskId: string) {
    const task = await this.taskRepository.delete(taskId);
    
    if (!task) {
      throw new Error("Task not found");
    }

    return task;
  }

  async getTasksByDoneStatus(userId: string) {
    const tasksCount = await TaskModel.countDocuments({
      userId: userId,
      status: "done",
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }).sort({ createdAt: -1 });

    return tasksCount;
  }

  async getTasksByProgressStatus(userId: string) {
    const tasksCount = await TaskModel.countDocuments({
      userId: userId,
      status: "todo",
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }).sort({ createdAt: -1 });

    return tasksCount;
  }
}
