import Task from "./taskModel.js";

const AddTask = async (req, res) => {
  const { taskName, taskStatus, dueDate, reminder, userId } = req.body;

  if (taskName && taskStatus && reminder && userId && dueDate) {
    try {
      const newTask = new Task({
        taskName: taskName,
        reminder: reminder,
        userId: userId,
        taskStatus: taskStatus,
        dueDate: dueDate,
      });
      await newTask.save();

      res.status(200).json({
        success: true,
        message: "Task added successfully",
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        mesaage: "Something wents wrong",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Please fill empty fields",
    });
  }
};

const getTask = async (req, res) => {
  const { userId } = req.params;

  if (userId) {
    try {
      const values = await Task.find({ userId: userId }).populate(
        "userId",
        "-password"
      );
      res.status(200).json({
        success: true,
        message: "All tasks",
        data: values,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User Id does not exist",
    });
  }
};

const getTodoTask = async (req, res) => {
  const { userId } = req.params;

  if (userId) {
    try {
      const values = await Task.find({
        userId: userId,
        taskStatus: "Todo",
      }).populate("userId", "-password");
      res.status(200).json({
        success: true,
        message: "All tasks",
        data: values,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User Id does not exist",
    });
  }
};

const getInProgressTask = async (req, res) => {
  const { userId } = req.params;

  if (userId) {
    try {
      const values = await Task.find({
        userId: userId,
        taskStatus: "In Progress",
      }).populate("userId", "-password");
      res.status(200).json({
        success: true,
        message: "All tasks",
        data: values,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User Id does not exist",
    });
  }
};

const getCompletedTask = async (req, res) => {
  const { userId } = req.params;

  if (userId) {
    try {
      const values = await Task.find({
        userId: userId,
        taskStatus: "Completed",
      }).populate("userId", "-password");
      res.status(200).json({
        success: true,
        message: "All tasks",
        data: values,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "User Id does not exist",
    });
  }
};

const updateTask = async (req, res) => {
  const { taskId, taskStatus } = req.body;

  try {
    const values = await Task.findByIdAndUpdate(
      { _id: taskId },
      { $set: { taskStatus: taskStatus } }
    );
    res.status(200).json({
      success: true,
      message: "Task Updated",
    });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export {
  AddTask,
  getTask,
  getTodoTask,
  getCompletedTask,
  getInProgressTask,
  updateTask,
};

const sendForgetPasswordLink = (user, token) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to: `${user?.email}`,
    from: {
      name: "guddge",
      email: "testuser@guddge.com",
    }, // Use the email address or domain you verified above
    subject: "Password Reset Request.",
    text: `Reset your password?`,
    html: `<p>If you requested a password reset for ${user?.email}, click the button below. This link will expire in 1 hour. If you didn’t make this request, please ignore and contact your administrator.</p> 
    <a href=http://timesheet.guddge.com/forget-password/${token} style="text-decoration: none;">
    <button style="background-color: blue; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer;">
        Click here
    </button>
</a>`,
  };
  try {
    sgMail.send(msg);
  } catch (error) {
    console.log(error);
    return error;
  }
};
