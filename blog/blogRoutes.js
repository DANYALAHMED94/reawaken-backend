import { getBlogById, getAllBlog } from "./blogController.js";
import express from "express";

const blogRouter = express.Router();

blogRouter.get("/get-blog-by-id/:id", getBlogById);
blogRouter.get("/get-all-blog", getAllBlog);

export default blogRouter;
