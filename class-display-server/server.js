const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const path = require("path");
const fs = require("fs");
const session = require("express-session");

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(
  session({
    secret: "class-display-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  })
);

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
  const callerName = req.session?.name || "";
  const callerUser = req.session?.user || "";

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

  // 관리자(admin)는 모든 반 호출 가능, 경고 없음, 전체 broadcast
  if (req.session.class === "admin") {
    const message = JSON.stringify({
      type: "CALL_STUDENT",
      payload: { name, caller: callerName, classId: "ALL" }
    });
    sockets.forEach((ws) => ws.send(message));
    return res.json({ success: true, warning: false });
  }

  // 세션의 class와 요청 classId가 다르면 경고 플래그 포함
  let warning = false;
  if (req.session.class !== classId) {
    warning = true;
  }

  const message = JSON.stringify({
    type: "CALL_STUDENT",
    payload: { name, caller: callerName, classId }
  });
  sockets.forEach((ws) => ws.send(message));
  res.json({ success: true, warning });
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

// 로그인 API
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const accounts = JSON.parse(fs.readFileSync("./data/accounts.json", "utf8"));
  const account = accounts[username];
  if (account && account.pw === password) {
    req.session.user = username;
    req.session.class = account.class;
    req.session.name = account.name;
    return res.json({ success: true, class: account.class, name: account.name });
  }
  res.status(401).json({ success: false, error: "Invalid credentials" });
});

// 로그아웃 API
app.post("/api/logout", (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});

// 인증 체크 API
app.get("/api/check-auth", (req, res) => {
  if (req.session.user) {
    return res.json({ authenticated: true, user: req.session.user, class: req.session.class, name: req.session.name });
  }
  res.json({ authenticated: false });
});

// 반 목록 API
app.get("/api/classes", (req, res) => {
  const accounts = JSON.parse(fs.readFileSync("./data/accounts.json", "utf8"));
  // admin 반은 목록에서 제외
  const classList = [...new Set(Object.values(accounts)
    .map(acc => acc.class)
    .filter(cls => cls !== "admin"))];
  res.json({ classes: classList });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

server.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});

