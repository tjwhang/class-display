import React from "react";
import { useState } from "react";
import Footer from "../components/Footer";
import StudentSelector from "../components/StudentSelector";
import "../App.css";

const Admin: React.FC = () => {
	const [classId, setClassId] = useState("");
	const [studentId, setStudentId] = useState("");
	const [status, setStatus] = useState("");
	const [callSuccess, setCallSuccess] = useState(false);
	const [clearSuccess, setClearSuccess] = useState(false);

	const handleClear = async () => {
		try {
			const response = await fetch("/api/call", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ classId: "", studentId: "" }),
			});
			const data = await response.json();
			if (data.success) {
				setStatus("Clear Success");
				setClearSuccess(true);
				setTimeout(() => setClearSuccess(false), 800);
			} else {
				setStatus(`Clear Error: ${data.error}`);
			}
		} catch (e) {
			setStatus(`Server error: ${e}`);
		}
	};

	const handleCall = async () => {
		try {
			const response = await fetch("/api/call", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ classId, studentId }),
			});

			const data = await response.json();
			if (data.success) {
				setStatus("Call Success");
				setCallSuccess(true);
				setTimeout(() => setCallSuccess(false), 800);
			} else {
				setStatus(`Call Error: ${data.error}`);
			}
		} catch (e) {
			setStatus(`Server error: ${e}`);
		}
	};

	return (
		<>
			<div>
				<div className="bg-admin" />
				<h1 className="admin-title">관리</h1>
				<div className="admin-flex-row">
					<div className="call-manager">
						<h2 className="submenu-title">학생 호출</h2>
						<div className="input-format">
							<label>반</label>
							<input
								type="text"
								value={classId}
								onChange={(e) => setClassId(e.target.value)}
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
							className={
								callSuccess ? "call-btn success" : "call-btn"
							}
							onClick={handleCall}
						>
							호출
						</button>
						<button
							className={
								clearSuccess ? "clear-btn success" : "clear-btn"
							}
							onClick={handleClear}
						>
							호출 해제
						</button>
					</div>
					<div className="student-list-panel">
						<StudentSelector
							onSelect={(cls, sid) => {
								setClassId(cls);
								setStudentId(sid);
							}}
						/>
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
