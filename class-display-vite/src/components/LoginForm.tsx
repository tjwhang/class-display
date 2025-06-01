import { useState } from "react";
import "../LoginForm.css";
import "../App.css";
import cahsLogo from "../assets/cahs.svg";

import Footer from "./Footer";

export default function LoginForm({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      onLogin();
    } else {
      setError("로그인 실패: 아이디 또는 비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <>
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="bg-blur" />
        <img src={cahsLogo} alt="CAHS Logo" className="login-form-logo" />
        <h2 className="login-form-title">관리자 로그인</h2>
        <input
          type="text"
          placeholder="ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="login-form-input"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="login-form-input"
        />
        <button type="submit" className="login-form-btn">
          로그인
        </button>
        {error && <div className="login-form-error">{error}</div>}
      </form>
      <div className="footer-text">
        <Footer />
      </div>
    </>
  );
}
