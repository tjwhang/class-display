import { useEffect, useState } from "react";

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
    fetchTemp();
    const interval = setInterval(fetchTemp, 60 * 1000);
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

function pad2(n: number) {
  return n.toString().padStart(2, "0");
}

function TempDisplay() {
  const temp = useTemp();
  const now = useClock();
  const timeString = `${pad2(now.getHours())}:${pad2(now.getMinutes())}:${pad2(
    now.getSeconds()
  )}`;

  return (
    <>
      <p className="temp-text">현재 기온</p>
      <p className="temp-counter">
        {temp !== null ? `${temp.toFixed(0)}°C` : "- °C"}
      </p>
      <p className="clock-text">{timeString}</p>
    </>
  );
}

export default TempDisplay;
