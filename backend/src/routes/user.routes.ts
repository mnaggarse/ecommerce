import express from "express";
import {
  deleteUser,
  getAllUsers,
  getUserById,
} from "../controllers/user.controller.js";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", verifyToken, getAllUsers);
router.get("/:id", getUserById);
router.delete("/:id", deleteUser);

export default router;
