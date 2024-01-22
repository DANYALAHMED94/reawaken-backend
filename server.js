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

const PORT = process.env.PORT || 5050;
app.listen(PORT, (req, res) => {
  console.log(`server is running on port ${PORT}`);
});
