import express from "express";
import { createSection, deleteSection, getSection, updateSection } from "../Controllers/sectionController.js";
import { authUser } from "../Middleware/authMiddleware.js";

const router=express.Router();

router.post('/create-section/:boardId',authUser,createSection)
router.put('/edit-section/:sectionId',authUser,updateSection)
router.get('/get-section/:boardId',authUser,getSection)
router.delete('/delete-section/:sectionId',authUser,deleteSection)

export default router;