const express = require("express");
const connDB = require("./lib/db");
const authRoute = require("./routes/auth");
const msgRoute = require("./routes/msgRoute");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const path = require("path");
// const __dirname = path.resolve();
const { app, server } = require("./lib/socket");
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//db
connDB();

app.use("/api/auth", authRoute);
app.use("/api/message", msgRoute);
const laca = "production";
if (process.env.NODE_ENV == "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`server running at port ${PORT}`);
});
