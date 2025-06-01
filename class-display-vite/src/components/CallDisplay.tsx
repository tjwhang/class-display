import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function CallDisplay() {
  const [name, setName] = useState("");
  const [caller, setCaller] = useState("");
  const [targetClass, setTargetClass] = useState("");
  const { classId } = useParams();

  useEffect(() => {
    const ws = new WebSocket(`ws://${window.location.host}`);

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === "CALL_STUDENT") {
        setName(message.payload.name);
        setCaller(message.payload.caller || "");
        setTargetClass(message.payload.classId || "");
      } else if (message.type === "CLEAR_CALL") {
        setName("");
        setCaller("");
        setTargetClass("");
      }
    };

    return () => ws.close();
  }, []);

  // 관리자 호출(classId: 'ALL')이면 모든 반에서 표시, 아니면 해당 반에서만 표시
  if (
    name &&
    targetClass &&
    targetClass !== "ALL" &&
    classId &&
    classId !== targetClass
  ) {
    return null;
  }

  return (
    <div className={"call-text" + (!name ? " hidden" : "")}>
      {name && (
        <>
          <div>{name} 학생</div>
          <div>{caller ? caller + " 선생님 호출" : "선생님 호출"}</div>
        </>
      )}
    </div>
  );
}
