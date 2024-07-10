import express from "express";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTask,
  updatePosition,
  updateTask,
} from "../Controllers/taskController.js";
import { authUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-task/:sectionId", authUser, createTask);
router.put("/edit-task/:taskId", authUser, updateTask);
router.delete("/delete-task/:taskId", authUser, deleteTask);
router.get("/get-task/:taskId", authUser, getTask);
router.get('/get-all-tasks', authUser,getAllTasks)
router.put("/update-position/:boardId", authUser, updatePosition);

export default router;
