import {
  AddProduct,
  DeleteProduct,
  GetProductDetail,
  GetProducts,
  UpdateProduct,
} from "../controllers/product";
import express from "express";
import { AdminMiddleware } from "../middlewares/adminMiddleware";

const router = express.Router();

router.get("/", GetProducts);
router.post("/add", AdminMiddleware, AddProduct);
router.get("/:productId", GetProductDetail);
router.put("/:productId/update", AdminMiddleware, UpdateProduct);
router.delete("/:productId/delete", AdminMiddleware, DeleteProduct);

export default router;
