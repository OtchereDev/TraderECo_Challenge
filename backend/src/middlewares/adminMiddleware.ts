import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const AdminMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [, token] = (req.headers.authorization || "").split(" ");

  if (token?.length) {
    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

      if (decoded.role == "admin" && decoded.userId?.length) {
        next();
      } else {
        res.status(StatusCodes.UNAUTHORIZED).json({
          message: "Unauthorized",
        });
        return;
      }
    } catch (error) {
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: "Unauthorized",
      });
      return;
    }
  } else {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: "Unauthorized",
    });
    return;
  }
};
