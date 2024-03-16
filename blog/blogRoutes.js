import { getBlogById, getAllBlog } from "./userController.js ";
import express from "express";

const blogRouter = express.Router();

blogRouter.get("/get-blog-by-id/:id", getBlogById);
blogRouter.get("/get-all-blog/:id", getAllBlog);

export default blogRouter;
    