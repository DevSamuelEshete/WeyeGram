import { Request, Response, NextFunction } from "express";

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.user?.id) {
      return res.status(401).json({
        message:
          "UnAuthorized access, login or register to access this endpoint",
      });
    }

    return next();
  } catch (e) {
    next(e);
  }
};

export default authMiddleware;
