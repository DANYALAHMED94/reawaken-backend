import {
  AddTask,
  getCompletedTask,
  getInProgressTask,
  getTask,
  getTodoTask,
} from "./taskController.js";
import express from "express";

const taskRouter = express.Router();

taskRouter.post("/add-task", AddTask);
taskRouter.get("/get-task/:userId", getTask);
taskRouter.get("/get-todo-task/:userId", getTodoTask);
taskRouter.get("/get-in-progress-task/:userId", getInProgressTask);
taskRouter.get("/get-completed-task/:userId", getCompletedTask);

export default taskRouter;
