import { Signup, Login, forgetPassword } from "./userController.js ";
import express from "express";

const router = express.Router();

router.post("/signup", Signup);
router.post("/login", Login);
router.post("/forget-password", forgetPassword);

export default router;
