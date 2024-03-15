import {
  Signup,
  Login,
  forgetPassword,
  updateForgetPassword,
  getUserById,
} from "./userController.js ";
import express from "express";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forget-password", forgetPassword);
router.post("/forget-password/:token", updateForgetPassword);
router.get("/get-user-by-id/:id", getUserById);

export default router;
