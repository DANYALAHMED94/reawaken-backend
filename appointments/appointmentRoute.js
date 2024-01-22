import { Appointment, ContactUs } from "./appointmentController.js";
import express from "express";

const appointmentRouter = express.Router();

appointmentRouter.post("/appointment/:id", Appointment);
appointmentRouter.post("/contact-us", ContactUs);

export default appointmentRouter;
