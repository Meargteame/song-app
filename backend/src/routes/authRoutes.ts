import { Router } from "express";
import {
  registerUser,
  loginUser,
  getMe,
  toggleFavoriteSong,
} from "../controllers/authController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", protect, getMe);
router.post("/favorites/:songId", protect, toggleFavoriteSong);

export default router;
