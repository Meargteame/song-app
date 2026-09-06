import { Router } from "express";
import { SongController } from "../controllers/songController";

const router = Router();

// Statistics route (MUST come before /:id)
router.get("/statistics", SongController.getStatistics);

// Batch operations (MUST come before /:id)
router.delete("/batch", SongController.batchDelete);
router.post("/batch", SongController.batchCreate);

// Core CRUD routes
router.post("/", SongController.create);
router.get("/", SongController.getAll);
router.get("/:id", SongController.getById);
router.patch("/:id", SongController.update);
router.delete("/:id", SongController.delete);

export default router;