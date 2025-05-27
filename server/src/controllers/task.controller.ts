import { Request, Response } from "express";
import { CreateTaskService } from "../services/task.service";
import { z } from "zod";
import { taskSchema } from "../validation/task.validation";

export interface IRequest extends Request {
  user?: any;
}

export class CreateTaskController {
  async handle(req: IRequest, res: Response): Promise<Response> {
    try {
      const data = taskSchema.parse(req.body);

      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const createTaskService = new CreateTaskService();
      const task = await createTaskService.execute({
        ...data,
        description: data.description ?? undefined,
        status: "todo",
        userId,
      });

      return res.status(201).json(task);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ errors: e.errors });
      }
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async findByUserAndStatus(req: IRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const createTaskService = new CreateTaskService();
      const tasks = await createTaskService.findByUser(userId);

      return res.status(200).json(tasks);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async updateStatus(req: IRequest, res: Response): Promise<Response> {
    try {
      const taskId = req.params.id;
      const status = req.body.status;

      if (!taskId || !status) {
        return res
          .status(400)
          .json({ error: "Task ID and status are required" });
      }

      const createTaskService = new CreateTaskService();
      const task = await createTaskService.updateStatus(taskId, status);

      return res.status(200).json(task);
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async delete(req: IRequest, res: Response): Promise<Response> {
    try {
      const taskId = req.params.id;

      if (!taskId) {
        return res.status(400).json({ error: "Task ID is required" });
      }

      const createTaskService = new CreateTaskService();
      await createTaskService.delete(taskId);

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async getTasksByDoneStatus(req: IRequest, res: Response): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const createTaskService = new CreateTaskService();
      const tasksCount = await createTaskService.getTasksByDoneStatus(userId);

      return res.status(200).json({ count: tasksCount });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async getTasksByProgressStatus(
    req: IRequest,
    res: Response
  ): Promise<Response> {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const createTaskService = new CreateTaskService();
      const tasksCount = await createTaskService.getTasksByProgressStatus(
        userId
      );

      return res.status(200).json({ count: tasksCount });
    } catch (error) {
      return res.status(500).json({ error: "Erro interno" });
    }
  }
}
