import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

export default function LongMessageDisplay() {
  const [messageText, setMessageText] = useState("");
  const [sender, setSender] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const { classId } = useParams();

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      setMessageText("");
      setSender("");
      setTargetClass("");
    }, 300);
  }, []);

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "SEND_LONG_MESSAGE") {
        setMessageText(message.payload.messageText);
        setSender(message.payload.sender || "");
        setTargetClass(message.payload.classId || "");
        setIsVisible(true);
      } else if (message.type === "CLEAR_LONG_MESSAGE") {
        setIsVisible(false);
        setTimeout(() => {
          setMessageText("");
          setSender("");
          setTargetClass("");
        }, 300);
      }
    };

    return () => ws.close();
  }, []);

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isVisible) {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, handleClose]);

  // 메시지가 있고, 타겟이 'ALL'이거나 현재 클래스와 일치할 때만 표시
  if (messageText && targetClass && targetClass !== "ALL" && targetClass !== classId) {
    return null;
  }

  if (!messageText) return null;
  return (
    <div className={`long-message-overlay${!isVisible ? " hidden" : ""}`}>
      <div className="long-message-container">
        {sender && <div className="long-message-sender">{sender} 선생님</div>}
        <div className="long-message-content">{messageText}</div>
      </div>
    </div>
  );
}
