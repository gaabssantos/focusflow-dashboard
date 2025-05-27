import { TaskModel } from "../models/task.model";
import { CreateTaskDTO } from "../dtos/task.dto";

export class CreateTaskService {
  async execute(data: CreateTaskDTO) {
    const task = await TaskModel.create(data);
    return task;
  }

  async findByUser(userId: string) {
    const tasks = await TaskModel.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    return tasks;
  }

  async updateStatus(taskId: string, status: string) {
    const task = await TaskModel.updateOne({ _id: taskId }, { status: status });

    return task;
  }

  async delete(taskId: string) {
    const task = await TaskModel.deleteOne({ _id: taskId });
    if (task.deletedCount === 0) {
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
