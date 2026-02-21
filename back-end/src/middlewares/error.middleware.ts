import { Request, Response, NextFunction } from "express";
import { return_info } from "../types";

const errorMiddleware = (
  err: return_info,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.error(err);
    return res.status(err.status || 500).json({ message: err.message });
  } catch (e) {
    console.error(e);
  }
};

export default errorMiddleware;
