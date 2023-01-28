import { CurrentUser, UserCreate, UserLogin } from "../controllers/user";
import express from "express";

const router = express.Router();

router.post("/login", UserLogin);
router.post("/signup", UserCreate);
router.post("/current-user", CurrentUser);

export default router;
