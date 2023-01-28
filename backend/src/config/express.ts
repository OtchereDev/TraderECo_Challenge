import express from "express";
import cors from "cors";
import { errorHandler } from "../middlewares/errorHandler";
import ProductRouter from "../routes/product";
import UserRouter from "../routes/auth";
import { StatusCodes } from "http-status-codes";

const createServer = () => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Hello World!");
    return;
  });

  app.use("/auth", UserRouter);
  app.use("/product", ProductRouter);

  app.use((req, res) => {
    res.status(StatusCodes.NOT_FOUND).json({
      message: "Not Found",
      status: StatusCodes.NOT_FOUND,
    });
  });

  app.use(errorHandler);

  return app;
};

export { createServer };
