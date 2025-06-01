import DDayDisplay from "../components/DDayDisplay";
import ListGroup from "../components/ListGroup";
import CallDisplay from "../components/CallDisplay.tsx";
import { useMealData } from "../hooks/useMealData";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import "../App.css";
import TempDisplay from "../components/TempDisplay";

function getCurrentYMD() {
	const now = new Date();
	const yyyy = now.getFullYear();
	const mm = String(now.getMonth() + 1).padStart(2, "0");
	const dd = String(now.getDate()).padStart(2, "0");
	return `${yyyy}${mm}${dd}`;
}

function Home() {
	const items = useMealData(getCurrentYMD(), 2);

	return (
		<>
			<div className="bg-blur" />
			<CallDisplay />
			<div className="card-transparent food-div">
				<ListGroup items={items} heading="중식" />
			</div>
			<br />
			<div className="card-transparent d-counter-div">
				<DDayDisplay />
				<TempDisplay />
			</div>

			<div className="footer-text">
				<Footer />
			</div>
		</>
	);
}

export default Home;
