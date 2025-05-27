import { Router } from "express";
import { CreateTaskController } from "../controllers/task.controller";
import { ensureAuth } from "../middlewares/ensureAuth";

const router = Router();

const createTaskController = new CreateTaskController();

router.post("/tasks", ensureAuth, async (req, res) => {
  await createTaskController.handle(req, res);
});

router.get("/tasks", ensureAuth, async (req, res) => {
  await createTaskController.findByUserAndStatus(req, res);
});

router.patch("/tasks/:id", ensureAuth, async (req, res) => {
  await createTaskController.updateStatus(req, res);
});

router.delete("/tasks/:id", ensureAuth, async (req, res) => {
  await createTaskController.delete(req, res);
});

router.get("/tasks/done", ensureAuth, async (req, res) => {
  await createTaskController.getTasksByDoneStatus(req, res);
});

router.get("/tasks/pending", ensureAuth, async (req, res) => {
  await createTaskController.getTasksByProgressStatus(req, res);
});

export { router as taskRoutes };
