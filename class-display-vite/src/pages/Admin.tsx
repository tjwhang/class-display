import React, { useEffect, useState, lazy, Suspense } from "react";
import Footer from "../components/Footer";
import LoginForm from "../components/LoginForm";
import "../App.css";

const StudentSelector = lazy(() => import("../components/StudentSelector"));

const Admin: React.FC = () => {
  const [studentId, setStudentId] = useState("");
  const [callSuccess, setCallSuccess] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userClass, setUserClass] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [showWarning, setShowWarning] = useState(false);
  const [pendingCall, setPendingCall] = useState<{
    classId: string;
    studentId: string;
  } | null>(null);

  useEffect(() => {
    fetch("/api/check-auth")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated && data.class) {
          setUserClass(data.class);
        }
        if (data.authenticated && data.name) {
          setUserName(data.name);
        }
      });
  }, []);

  if (authenticated === null)
    return <div className="admin-loading">로딩 중...</div>;
  if (!authenticated)
    return <LoginForm onLogin={() => window.location.reload()} />;

  const handleClear = async () => {
    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: "", studentId: "" }),
      });
      const data = await response.json();
      if (data.success) {
        setClearSuccess(true);
        setTimeout(() => setClearSuccess(false), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const doCall = async (classId: string, studentId: string, force = false) => {
    try {
      const response = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, studentId, force }),
      });
      const data = await response.json();
      if (data.warning && !force) {
        setShowWarning(true);
        setPendingCall({ classId, studentId });
      } else if (data.success) {
        setCallSuccess(true);
        setTimeout(() => setCallSuccess(false), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCall = async () => {
    doCall(userClass, studentId);
  };

  const handleWarningConfirm = async () => {
    if (pendingCall) {
      await doCall(pendingCall.classId, pendingCall.studentId, true);
      setShowWarning(false);
      setPendingCall(null);
    }
  };

  return (
    <>
      <div>
        <div className="bg-admin" />
        <div className="admin-header">
          <h1 className="admin-title">관리</h1>
          <div className="admin-user-info right">
            {userName} 선생님
            <button
              className="admin-logout-btn"
              onClick={async () => {
                await fetch("/api/logout", { method: "POST" });
                window.location.reload();
              }}
            >
              로그아웃
            </button>
          </div>
        </div>
        <div className="admin-flex-row">
          <div className="call-manager">
            <h2 className="submenu-title">학생 호출</h2>
            <div className="input-format">
              <label>반</label>
              <input
                type="text"
                value={userClass}
                onChange={(e) => setUserClass(e.target.value)}
                placeholder="0-0"
              />
            </div>
            <div className="input-format">
              <label>학번</label>
              <input
                type="text"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="00"
              />
            </div>

            <button
              className={callSuccess ? "call-btn success" : "call-btn"}
              onClick={handleCall}
            >
              호출
            </button>
            <button
              className={clearSuccess ? "clear-btn success" : "clear-btn"}
              onClick={handleClear}
            >
              호출 해제
            </button>
            {showWarning && (
              <div className="call-warning-modal">
                <div className="call-warning-content">
                  <p>경고: 본인 반 학생이 아닙니다. 그래도 호출하시겠습니까?</p>
                  <div className="call-warning-btn-row">
                    <button className="call-btn" onClick={handleWarningConfirm}>
                      확인
                    </button>
                    <button
                      className="clear-btn"
                      onClick={() => {
                        setShowWarning(false);
                        setPendingCall(null);
                      }}
                    >
                      취소
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="student-list-panel">
            <Suspense fallback={<div>Loading...</div>}>
              <StudentSelector
                onSelect={(cls, sid) => {
                  setUserClass(cls);
                  setStudentId(sid);
                }}
              />
            </Suspense>
          </div>
        </div>
        <div className="footer-text">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Admin;
