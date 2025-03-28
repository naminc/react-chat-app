
const express = require("express");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();
const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST,
  user: process.env.MYSQLUSER,
  password: process.env.MYSQLPASSWORD,
  database: process.env.MYSQLDATABASE,
  port: process.env.MYSQLPORT,
});


app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  db.query("SELECT * FROM users WHERE username = ?", [username], async (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length === 0) return res.status(401).send("Sai tên đăng nhập");
    const valid = await bcrypt.compare(password, results[0].password);
    if (!valid) return res.status(401).send("Sai mật khẩu");
    res.json({
      id: results[0].id,
      username: results[0].username,
      avatar: results[0].avatar,
      role: results[0].role // 👈 BẮT BUỘC PHẢI CÓ
    });
  });
});

app.get("/api/messages/:senderId/:receiverId", (req, res) => {
  const { senderId, receiverId } = req.params;
  db.query(
    "SELECT * FROM messages WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?) ORDER BY created_at ASC",
    [senderId, receiverId, receiverId, senderId],
    (err, results) => {
      if (err) return res.status(500).send(err);
      res.json(results);
    }
  );
});

app.get("/api/users", (req, res) => {
  db.query("SELECT id, username, avatar FROM users", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});
app.post("/api/users", async (req, res) => {
  const { username, password, avatar, role = "user" } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  db.query(
    "INSERT INTO users (username, password, avatar, role) VALUES (?, ?, ?, ?)",
    [username, hashed, avatar, role],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.sendStatus(200);
    }
  );
});


io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("send_message", (data) => {
    const { sender_id, receiver_id, message } = data;
    db.query("INSERT INTO messages (sender_id, receiver_id, message) VALUES (?, ?, ?)", 
      [sender_id, receiver_id, message]);
    io.emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 3002;

server.listen(PORT, () => {
  console.log(`✅ Server đang chạy tại PORT ${PORT}`);
});