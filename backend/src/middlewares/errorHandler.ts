import { NextFunction, Request, Response } from "express";

export const errorHandler = (
  error: Error,
  _request: Request,
  resp: Response,
  next: NextFunction
) => {
  if (resp.headersSent) return next(error);

  resp.status(500).send(error.message);
};
