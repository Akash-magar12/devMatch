const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth.Route");
const profileRouter = require("./routes/profile.Route");
const connectionRouter = require("./routes/Connection.Route");
const userRouter = require("./routes/user.Route");
require("dotenv").config();
const cors = require("cors");
const http = require("http");
const razorpayRouter = require("./routes/razorpay.Route");
const initializeSocket = require("./utils/socket");
const chatRouter = require("./routes/chat.Route");
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());

app.use("/api/auth", authRouter);
app.use("/api/profile", profileRouter);
app.use("/api/request", connectionRouter);
app.use("/api/user", userRouter);
app.use("/api/payment", razorpayRouter);
app.use("/api/chat", chatRouter);

const server = http.createServer(app);
initializeSocket(server);
server.listen(7000, () => {
  console.log(`server is running on ${process.env.PORT}`);
  connectDB();
});
