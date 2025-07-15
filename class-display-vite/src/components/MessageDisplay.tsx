import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function MessageDisplay() {
  const [messageText, setMessageText] = useState("");
  const [sender, setSender] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const { classId } = useParams();

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "SEND_MESSAGE") {
        setMessageText(message.payload.messageText);
        setSender(message.payload.sender || "");
        setTargetClass(message.payload.classId || "");
      } else if (message.type === "CLEAR_MESSAGE") {
        setMessageText("");
        setSender("");
        setTargetClass("");
      }
    };

    return () => ws.close();
  }, []);
  // 메시지가 있고, 타겟이 'ALL'이거나 현재 클래스와 일치할 때만 표시
  if (messageText && targetClass && targetClass !== "ALL" && targetClass !== classId) {
    return null;
  }
  return (
    <div className={"message-text" + (!messageText ? " hidden" : "")}>
      {messageText && (
        <>
          <div className="message-content">{messageText}</div>
          {sender && <div className="message-sender">{sender} 선생님</div>}
        </>
      )}
    </div>
  );
}