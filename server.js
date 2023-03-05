const express = require("express");
const dbUrl = require("./config/db");
const cors = require("cors");
const http = require("http");
const conversationRoute = require("./routes/conversationRoute");
const messagesRoute = require("./routes/messagesRoute");
const userRoute = require("./routes/authRoute");
const app = express();
const server = http.createServer(app);
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
dbUrl();

app.use("/api/conversation", conversationRoute);
app.use("/api/message", messagesRoute);
app.use("/api/user", userRoute);
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/client/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("chat app");
  });
}
const PORT = process.env.PORT || 6000;
server.listen(PORT, () => {
  console.log("server running");
});
