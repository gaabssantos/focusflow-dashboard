import { Request, Response } from "express";
import { z } from "zod";
import { routineSchema } from "../validation/routine.validation";
import { RoutineRepository } from "../repositories/routine.repository";
import { CreateRoutineService } from "../services/routine.service";

export interface IRequest extends Request {
  user?: any;
}

export class RoutineController {
  async handle(req: IRequest, res: Response): Promise<Response> {
    try {
      const data = routineSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const routineRepository = new RoutineRepository();
      const routineService = new CreateRoutineService(routineRepository);

      const routine = await routineService.execute({
        ...data,
        userId,
      });

      return res.status(201).json(routine);
    } catch (e) {
      if (e instanceof z.ZodError) {
        return res.status(400).json({ errors: e.errors });
      }
      return res.status(500).json({ error: "Erro interno" });
    }
  }

  async findByUser(req: IRequest, res: Response): Promise<Response> {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const routineRepository = new RoutineRepository();
    const routineService = new CreateRoutineService(routineRepository);

    try {
      const routines = await routineService.findByUser(userId);
      return res.status(200).json(routines);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Erro ao buscar rotinas do usuário" });
    }
  }
}
