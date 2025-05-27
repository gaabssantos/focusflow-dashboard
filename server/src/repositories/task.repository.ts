import { CreateTaskDTO } from "../dtos/task.dto";
import { ITaskInterface } from "../interfaces/task.interface";
import { ITask, TaskModel } from "../models/task.model";

export class TaskRepository implements ITaskInterface {
  async create(data: CreateTaskDTO): Promise<ITask> {
    const task = await TaskModel.create(data);

    return task;
  }

  async findByUser(userId: string): Promise<ITask[]> {
    const tasks = await TaskModel.find({
      userId: userId,
    }).sort({ createdAt: -1 });

    return tasks;
  }
  async updateStatus(taskId: string, status: string): Promise<ITask> {
    const task = await TaskModel.findByIdAndUpdate(
      taskId,
      { status: status },
      { new: true }
    ).lean();

    return task as ITask;
  }
  async delete(taskId: string): Promise<ITask> {
    const task = await TaskModel.findByIdAndDelete(taskId).lean();

    return task as ITask;
  }

  async getTasksByDoneStatus(userId: string): Promise<number> {
    const tasksCount = await TaskModel.countDocuments({
      userId: userId,
      status: "done",
      createdAt: {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30)),
      },
    }).sort({ createdAt: -1 });

    return tasksCount;
  }
  async getTasksByProgressStatus(userId: string): Promise<number> {
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
