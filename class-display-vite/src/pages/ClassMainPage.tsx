import { useParams } from "react-router-dom";
import DDayDisplay from "../components/DDayDisplay";
import ListGroup from "../components/ListGroup";
import { useMealData } from "../hooks/useMealData";
import Footer from "../components/Footer";
import React, { lazy, Suspense } from "react";
import "../App.css";

const CallDisplay = lazy(() => import("../components/CallDisplay"));
const MessageDisplay = lazy(() => import("../components/MessageDisplay"));
const TempDisplay = lazy(() => import("../components/TempDisplay"));

function getCurrentYMD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function getMealTypeByTime() {
  const now = new Date();
  return now.getHours() >= 13 ? 3 : 2;
}
function getMealTypeName(mealCode: number) {
  return mealCode === 3 ? "석식" : "중식";
}

export default function ClassMainPage() {
  const { classId } = useParams();
  const [mealType, setMealType] = React.useState(getMealTypeByTime());
  const {
    meals: items,
    isLoading,
    error,
  } = useMealData(getCurrentYMD(), mealType);

  // 1분마다 급식 종류 자동 전환
  React.useEffect(() => {
    const interval = setInterval(() => {
      const newType = getMealTypeByTime();
      if (newType !== mealType) setMealType(newType);
    }, 60000);
    return () => clearInterval(interval);
  }, [mealType]);

  return (
    <>
      <div className="bg-blur" />
      <div className="card-transparent food-div">
        <ListGroup
          items={items}
          heading={getMealTypeName(mealType)}
          isLoading={isLoading}
          error={error}
        />
      </div>
      <div className="card-transparent d-counter-div">
        <DDayDisplay />
        <Suspense fallback={<div>Loading components...</div>}>
          <TempDisplay />
        </Suspense>
      </div>
      <div className="footer-text">
        <Footer />
      </div>      <div className="class-name-display">{classId}반</div>
      <Suspense fallback={<div>Loading components...</div>}>
        <CallDisplay />
        <MessageDisplay />
      </Suspense>
    </>
  );
}
