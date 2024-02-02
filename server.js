import express from "express";
import cors from "cors";
import connectDb from "./config/db.js";
import router from "./user/userRoute.js";
import taskRouter from "./task/taskRoute.js";
import dotenv from "dotenv";
import profileRoute from "./user/userProfileUpload.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import cron from "node-cron";
import Task from "./task/taskModel.js";
import twilio from "twilio";
import User from "./user/userModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();
const MONGO_DB = process.env.MONGO_DB;
// mongoose.set("strictQuery", true);
connectDb(MONGO_DB);
app.use("/api", router);
app.use("/api", taskRouter);
app.use(express.urlencoded({ extended: true, limit: "500mb" }));
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));
app.use("/api", profileRoute);

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

cron.schedule("0 0 * * * *", async () => {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const client = new twilio(accountSid, authToken);
  const today = new Date();
  const formattedToday = today.toISOString().split("T")[0];
  const reminders = await Task.find({
    "reminder.date": { $eq: formattedToday },
  });

  reminders.forEach(async (reminder) => {
    // const user = await User.findById({ _id: reminder.userId });

    // Use Twilio API to send SMS
    client.messages
      .create({
        body: `Reminder for the task name ${reminder.taskName} whose status is ${reminder.taskStatus}`,
        to: process.env.TO_NUMBER, // Text this number
        from: process.env.TWILIO_FROM_NUMBER, // From a valid Twilio number
      })
      .then((message) => console.log(message.body));
  });
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});
