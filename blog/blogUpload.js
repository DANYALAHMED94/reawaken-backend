import path from "path";
import express from "express";
import multer from "multer";
import fs from "fs";
import Blog from "./blogModel.js";
const blogUpload = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "blogs/");
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`);
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png|jfif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Your allowed to uopload images only", false);
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
  limits: {
    fileSize: 5 * 1024 * 1024, // limit to 2MB
  },
});

blogUpload.post("/blog", upload.single("filename"), async (req, res) => {
  const { title, description } = req.body;
  const filename = req?.file?.filename;

  if (title && description && filename) {
    try {
      if (filename?.length) {
        removeImage(filename);
      }

      const newBlog = new Blog({
        title: title,
        description: description,
        filename: filename,
      });

      const saveBlog = await newBlog.save();
      if (saveBlog) {
        res.status(200).json({
          success: true,
          message: "Blog created successfully",
          task: {
            title: saveBlog?.title,
            fileOriginalName: saveBlog?.description,
            filename: saveBlog?.filename,
          },
        });
      } else {
        res.status(400).json({
          success: false,
          message: "something wents wrong",
        });
      }
    } catch (error) {
      console.log(error, "error");
      res.status(400).json({
        success: false,
        message: "something wents wrong",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "something wents wrong",
    });
  }
});

export default blogUpload;

const removeImage = (file) => {
  fs.unlink("./blogs/" + file, function (err) {
    if (err && err.code == "ENOENT") {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.info(`removed`);
    }
  });
};
