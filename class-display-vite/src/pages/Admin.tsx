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
  } | null>(null);  // Message states
  const [messageClass, setMessageClass] = useState<string>("");
  const [messageText, setMessageText] = useState("");
  const [messageSuccess, setMessageSuccess] = useState(false);
  const [messageClearSuccess, setMessageClearSuccess] = useState(false);
  const [showMessageWarning, setShowMessageWarning] = useState(false);
  const [pendingMessage, setPendingMessage] = useState<{
    classId: string;
    messageText: string;
  } | null>(null);
  
  // Long message states
  const [longMessageClass, setLongMessageClass] = useState<string>("");
  const [longMessageText, setLongMessageText] = useState("");
  const [longMessageSuccess, setLongMessageSuccess] = useState(false);
  const [longMessageClearSuccess, setLongMessageClearSuccess] = useState(false);
  const [showLongMessageWarning, setShowLongMessageWarning] = useState(false);
  const [pendingLongMessage, setPendingLongMessage] = useState<{
    classId: string;
    messageText: string;
  } | null>(null);
  
  // Classes list for dropdown
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);  useEffect(() => {
    fetch("/api/check-auth")
      .then((res) => res.json())
      .then((data) => {
        setAuthenticated(data.authenticated);
        if (data.authenticated && data.class) {
          setUserClass(data.class);
          setMessageClass(data.class); // 메시지 클래스도 사용자 클래스로 초기화
          setLongMessageClass(data.class); // 긴 메시지 클래스도 사용자 클래스로 초기화
        }
        if (data.authenticated && data.name) {
          setUserName(data.name);
        }
      });
    
    // 반 목록 가져오기
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => {
        setAvailableClasses(data.classes || []);
      });
  }, []);

  // userClass가 변경될 때 messageClass를 동기화
  useEffect(() => {
    if (userClass && !messageClass) {
      setMessageClass(userClass);
    }
  }, [userClass, messageClass]);

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

  // Message handling functions
  const handleMessageClear = async () => {
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: "", messageText: "" }),
      });
      const data = await response.json();
      if (data.success) {
        setMessageClearSuccess(true);
        setTimeout(() => setMessageClearSuccess(false), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const doMessage = async (classId: string, messageText: string, force = false) => {
    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, messageText, force }),
      });
      const data = await response.json();
      if (data.warning && !force) {
        setShowMessageWarning(true);
        setPendingMessage({ classId, messageText });
      } else if (data.success) {
        setMessageSuccess(true);
        setTimeout(() => setMessageSuccess(false), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };  const handleMessage = async () => {
    if (messageText.trim()) {
      const targetClass = messageClass || userClass;
      doMessage(targetClass, messageText);
    }
  };

  const handleMessageWarningConfirm = async () => {
    if (pendingMessage) {
      await doMessage(pendingMessage.classId, pendingMessage.messageText, true);
      setShowMessageWarning(false);
      setPendingMessage(null);
    }
  };

  // Long message handling functions
  const handleLongMessageClear = async () => {
    try {
      const response = await fetch("/api/long-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: "", messageText: "" }),
      });
      const data = await response.json();
      if (data.success) {
        setLongMessageClearSuccess(true);
        setTimeout(() => setLongMessageClearSuccess(false), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const doLongMessage = async (classId: string, messageText: string, force = false) => {
    try {
      const response = await fetch("/api/long-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId, messageText, force }),
      });
      const data = await response.json();
      if (data.warning && !force) {
        setShowLongMessageWarning(true);
        setPendingLongMessage({ classId, messageText });
      } else if (data.success) {
        setLongMessageSuccess(true);
        setTimeout(() => setLongMessageSuccess(false), 800);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleLongMessage = async () => {
    if (longMessageText.trim()) {
      const targetClass = longMessageClass || userClass;
      doLongMessage(targetClass, longMessageText);
    }
  };

  const handleLongMessageWarningConfirm = async () => {
    if (pendingLongMessage) {
      await doLongMessage(pendingLongMessage.classId, pendingLongMessage.messageText, true);
      setShowLongMessageWarning(false);
      setPendingLongMessage(null);
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
        </div>        <div className="admin-flex-row">
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
          </div>

          <div className="call-manager">
            <h2 className="submenu-title">짧은 메시지 전송</h2>
            <div className="input-format">
              <label>반</label>
              <select
                value={messageClass}
                onChange={(e) => setMessageClass(e.target.value)}
                aria-label="반 선택"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}반
                  </option>
                ))}
              </select>
            </div>
            <div className="input-format">
              <label>내용</label>
              <input
                type="text"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="메시지 입력"
              />
            </div>

            <button
              className={messageSuccess ? "call-btn success" : "call-btn"}
              onClick={handleMessage}
            >
              전송
            </button>
            <button
              className={messageClearSuccess ? "clear-btn success" : "clear-btn"}
              onClick={handleMessageClear}
            >
              메시지 해제
            </button>
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

        {/* 긴 메시지 전송 섹션을 별도 행으로 분리 */}
        <div className="admin-flex-row">
          <div className="call-manager">
            <h2 className="submenu-title">중요 공지 표시</h2>
            <div className="input-format">
              <label>반</label>
              <select
                value={longMessageClass}
                onChange={(e) => setLongMessageClass(e.target.value)}
                aria-label="반 선택"
              >
                {availableClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    {cls}반
                  </option>
                ))}
              </select>
            </div>
            <div className="input-format">
              <label>내용</label>
              <textarea
                value={longMessageText}
                onChange={(e) => setLongMessageText(e.target.value)}
                placeholder="긴 메시지 입력 (여러 줄 가능)"
                rows={4}
                className="long-message-textarea"
              />
            </div>

            <button
              className={longMessageSuccess ? "call-btn success" : "call-btn"}
              onClick={handleLongMessage}
            >
              메시지 전송
            </button>
            <button
              className={longMessageClearSuccess ? "clear-btn success" : "clear-btn"}
              onClick={handleLongMessageClear}
            >
              해제
            </button>
          </div>
        </div>
        
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

        {showMessageWarning && (
          <div className="call-warning-modal">
            <div className="call-warning-content">
              <p>경고: 본인 반이 아닙니다. 그래도 메시지를 전송하시겠습니까?</p>
              <div className="call-warning-btn-row">
                <button className="call-btn" onClick={handleMessageWarningConfirm}>
                  확인
                </button>
                <button
                  className="clear-btn"
                  onClick={() => {
                    setShowMessageWarning(false);
                    setPendingMessage(null);
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        {showLongMessageWarning && (
          <div className="call-warning-modal">
            <div className="call-warning-content">
              <p>경고: 본인 반이 아닙니다. 그래도 긴 메시지를 전송하시겠습니까?</p>
              <div className="call-warning-btn-row">
                <button className="call-btn" onClick={handleLongMessageWarningConfirm}>
                  확인
                </button>
                <button
                  className="clear-btn"
                  onClick={() => {
                    setShowLongMessageWarning(false);
                    setPendingLongMessage(null);
                  }}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="footer-text">
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Admin;
