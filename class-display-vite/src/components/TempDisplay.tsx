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
    const interval = setInterval(fetchTemp, 60 * 1000); // 1분마다 갱신

    return () => clearInterval(interval);
  }, []);

  return temp;
}

function TempDisplay() {
  const temp = useTemp();

  let tempText;
  if (temp !== null) {
    tempText = <p className="temp-counter">{temp.toFixed(0)}°C</p>;
  } else {
    tempText = <p className="temp-counter"> - °C</p>;
  }

  return (
    <>
      <p className="temp-text">현재 기온</p>
      {tempText}
    </>
  );
}

export default TempDisplay;
