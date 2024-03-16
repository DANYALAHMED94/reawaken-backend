import Blog from "./blogModel.js";

const getAllBlog = async (req, res) => {
  try {
    const blog = await Blog.find();

    res.status(200).json({
      success: true,
      message: "User Details",
      blog,
    });
  } catch (error) {
    res.status(500).json(error.message);
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const blog = await Blog.findById(id);
      if (blog) {
        res.status(200).json({
          success: true,
          message: "Blog Details",
          blog,
        });
      } else {
        res.status(400).json({
          success: false,
          message: "Blog not found",
        });
      }
    } else {
      res.status(400).json({
        success: false,
        message: "Blog id not found",
      });
    }
  } catch (error) {
    res.status(500).json(error.message);
  }
};

export { getAllBlog, getBlogById };
