const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());

// 정적 파일 서빙
app.use(express.static(path.join(__dirname, "./dist")));

// WebSocket 관리
const sockets = new Set();
wss.on("connection", (ws) => {
  sockets.add(ws);
  ws.on("close", () => sockets.delete(ws));
});

// 호출 API
app.post("/api/call", (req, res) => {
  const { classId, studentId } = req.body;

  // 호출 해제: 빈 값이면 모든 클라이언트에 CLEAR_CALL 전송
  if (!classId && !studentId) {
    const message = JSON.stringify({ type: "CLEAR_CALL" });
    sockets.forEach((ws) => ws.send(message));
    return res.json({ success: true });
  }

  // 학생 데이터 로드
  const students = JSON.parse(fs.readFileSync("./data/students.json", "utf8"));
  const name = students[classId]?.[studentId];

  if (!name) {
    return res.status(404).json({ error: "학생을 찾을 수 없음" });
  }

  const message = JSON.stringify({
    type: "CALL_STUDENT",
    payload: { name }
  });

  sockets.forEach((ws) => ws.send(message));

  res.json({ success: true });
});

// 학생 전체 목록 반환
app.get("/api/students/all", (req, res) => {
  const students = JSON.parse(fs.readFileSync("./data/students.json", "utf8"));
  res.json(students);
});

// 학생 개별 반 목록 반환
app.get("/api/students/:classId", (req, res) => {
  const students = JSON.parse(fs.readFileSync("./data/students.json", "utf8"));
  const classId = req.params.classId;
  res.json(students[classId] || {});
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

server.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});

