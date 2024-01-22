import {
  Signup,
  Login,
  forgetPassword,
  updateForgetPassword,
} from "./userController.js ";
import express from "express";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forget-password", forgetPassword);
router.post("/forget-password/:token", updateForgetPassword);

export default router;
