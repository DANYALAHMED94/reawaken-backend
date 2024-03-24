import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import router from "./user/userRoute.js";
import taskRouter from "./task/taskRoute.js";
import dotenv from "dotenv";
import profileRoute from "./user/userProfileUpload.js";
import taskRoute from "./task/taskUpload.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cron from "node-cron";
import Task from "./task/taskModel.js";
import twilio from "twilio";
import User from "./user/userModel.js";
import blogUpload from "./blog/blogUpload.js";
import updateBlog from "./blog/updateBlog.js";
import blogRouter from "./blog/blogRoutes.js";
import hostedRoute from "./routes/stripe/hostedroute.js";
import bodyParser from "body-parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.json());
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || process.env.BASE_URL_FRONTEND.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
dotenv.config();
const MONGO_DB = process.env.MONGO_DB;
connectDb(MONGO_DB);
app.use("/api", router);
app.use("/api", taskRouter);
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/api", profileRoute);
app.use("/api", blogUpload);
app.use("/api", updateBlog);
app.use("/api", taskRoute);
app.use("/api", blogRouter);
app.use("/api", hostedRoute);

app.use("/attchments", express.static(path.join(__dirname, "/attchments")));
app.use("/blogs", express.static(path.join(__dirname, "/blogs")));

app.get("/api/pdf/:id", async (req, res) => {
  const { id } = req.params;
  const task = await Task.findById(id);
  if (task) {
    if (task?.filename) {
      const filePath = path?.join(__dirname, "attchments", task?.filename);
      res.status(200).json({
        success: true,
        file: filePath,
        comment: task?.comment,
        fileOriginalName: task?.fileOriginalName,
      });
    } else {
      res.status(200).json({
        success: true,
        comment: task?.comment,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Comments and attachments not found",
    });
  }
});

if (process.env.NODE_ENV === "PRODUCTION") {
  app.use(express.static(path.join(__dirname, "./build")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "./build/index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running...");
  });
}

// cron.schedule("*/1 * * * *", async () => {
//   const accountSid = process.env.TWILIO_ACCOUNT_SID;
//   const authToken = process.env.TWILIO_AUTH_TOKEN;
//   const client = new twilio(accountSid, authToken);
//   const today = new Date();
//   const formattedToday = today.toISOString().split("T")[0];

//   const reminders = await Task.find({
//     "reminder.date": { $eq: formattedToday },
//   });
//   reminders.forEach(async (reminder) => {
//     console.log(reminder.reminder, "iuytre");
//     // const user = await User.findById({ _id: reminder.userId });
//     // Use Twilio API to send SMS
//     // client.messages
//     //   .create({
//     //     body: `Reminder for the task name ${reminder.taskName} whose status is ${reminder.taskStatus}`,
//     //     to: process.env.TO_NUMBER, // Text this number
//     //     from: process.env.TWILIO_FROM_NUMBER, // From a valid Twilio number
//     //   })
//     //   .then((message) => console.log(message.body));

//     const scheduleDate = new Date(reminder?.reminder.date); // Assuming date is stored separately
//     const scheduleTime = reminder?.reminder.time.split(":"); // Assuming time is stored as HH:MM string
//     // console.log(scheduleTime, "time");
//     scheduleDate.setHours(scheduleTime[0]);
//     scheduleDate.setMinutes(scheduleTime[1]);
//     // console.log(scheduleDate);
//     schedule.scheduleJob(scheduleDate, () => {
//       sendMessage(reminder.userId, reminder.comment);
//     });
//     // console.log(`Message scheduled for ${scheduleDate}`);
//   });
// });

cron.schedule("* * * * *", async () => {
  // Run the task every minute
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new twilio(accountSid, authToken);
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];

  const reminders = await Task.find({
    "reminder.date": { $eq: formattedToday },
  });
  // Get the current date and time
  const currentTime = new Date();
  reminders.forEach(async (reminder) => {
    const reminderDate = new Date(reminder.reminder.date);
    const reminderTime = reminder.reminder.time.split(":");
    reminderDate.setHours(reminderTime[0]);
    reminderDate.setMinutes(reminderTime[1]);
    const currentHours = currentTime.getHours();
    const currentMinutes = currentTime.getMinutes();
    const reminderHours = reminderDate.getHours();
    const reminderMinutes = reminderDate.getMinutes();
    // Check if the current time matches the reminder time
    if (currentHours === reminderHours && currentMinutes === reminderMinutes) {
      const user = await User.findById({ _id: reminder.userId });
      // Use Twilio API to send SMS
      if (user?.phoneNumber) {
        client.messages
          .create({
            body: `Reminder for the task name ${reminder.taskName} whose status is ${reminder.taskStatus}`,
            // to: `${user.phoneNumber}`, // Text this number
            to: process.env.TO_NUMBER, // Text this number
            from: process.env.TWILIO_FROM_NUMBER, // From a valid Twilio number
          })
          .then((message) => console.log(message.body));
      }
    }
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});
