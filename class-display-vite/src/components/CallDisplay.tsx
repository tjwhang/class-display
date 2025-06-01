import { useEffect, useState } from "react";

export default function CallDisplay() {
	const [name, setName] = useState("");

	useEffect(() => {
		const ws = new WebSocket(`ws://${window.location.host}`);

		ws.onmessage = (event) => {
			const message = JSON.parse(event.data);
			if (message.type === "CALL_STUDENT") {
				setName(message.payload.name);
			} else if (message.type === "CLEAR_CALL") {
				setName("");
			}
		};

		return () => ws.close();
	}, []);

	return (
		<div className={"call-text" + (!name ? " hidden" : "")}>
			{name ? `${name} 학생, 선생님 호출` : ""}
		</div>
	);
}
