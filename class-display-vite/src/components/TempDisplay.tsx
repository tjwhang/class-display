import { useEffect, useState } from "react";

// 서울 위도/경도
const LAT = 37.583538;
const LON = 126.986696;

function useTemp() {
	const [temp, setTemp] = useState<number | null>(null);

	useEffect(() => {
		const fetchTemp = () => {
			fetch(
				`https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current_weather=true`
			)
				.then((res) => res.json())
				.then((data) => {
					setTemp(data.current_weather?.temperature ?? null);
				});
		};

		fetchTemp(); // 최초 1회 호출
		const interval = setInterval(fetchTemp, 600 * 1000); // 10분마다 갱신

		return () => clearInterval(interval);
	}, []);

	return temp;
}

function useClock() {
	const [now, setNow] = useState(new Date());
	useEffect(() => {
		const timer = setInterval(() => setNow(new Date()), 1000);
		return () => clearInterval(timer);
	}, []);
	return now;
}

function TempDisplay() {
	const temp = useTemp();
	const now = useClock();

	let tempText;
	if (temp !== null) {
		tempText = <p className="temp-counter">{temp.toFixed(0)}°C</p>;
	} else {
		tempText = <p className="temp-counter"> - °C</p>;
	}

	// 시계 표시 (HH:MM:SS)
	const timeString = now
		.toLocaleTimeString("ko-KR", { hour12: false })
		.padStart(8, "0");

	return (
		<>
			<p className="temp-text">현재 기온</p>
			{tempText}
			<p
				className="clock-text"
				style={{
					fontSize: "4vh",
					marginTop: "-2vh",
					color: "#fff",
					textShadow: "0 2px 8px #222a",
				}}
			>
				{timeString}
			</p>
		</>
	);
}

export default TempDisplay;
