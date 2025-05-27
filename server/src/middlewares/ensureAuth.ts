// src/middlewares/ensureAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { IRequest } from "../controllers/task.controller";

interface Payload {
  id: string;
}

export const ensureAuth = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({ error: "Token não fornecido." });
    return;
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as Payload;

    req.user = {
      id: decoded.id,
    };

    return next();
  } catch (err) {
    res.status(401).json({ error: "Token inválido." });
  }
};
