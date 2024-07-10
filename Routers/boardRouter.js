import express from "express";
import { createBoard, deleteBoard, getBoards, getOneBoard, updateBoard } from "../Controllers/boardController.js";
import { authUser } from "../Middleware/authMiddleware.js";

const router = express.Router();

router.post('/create-board',authUser,createBoard)
router.get('/get-boards',authUser,getBoards)
router.get('/get-board/:boardId',authUser,getOneBoard)
router.put('/edit-board/:boardId',authUser,updateBoard)
router.delete('/delete-board/:boardId',authUser,deleteBoard)

export default router;
    