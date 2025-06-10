import { useParams } from "react-router-dom";
import DDayDisplay from "../components/DDayDisplay";
import ListGroup from "../components/ListGroup";
import { useMealData } from "../hooks/useMealData";
import Footer from "../components/Footer";
import React, { lazy, Suspense } from "react";
import "../App.css";

const CallDisplay = lazy(() => import("../components/CallDisplay"));
const TempDisplay = lazy(() => import("../components/TempDisplay"));

function getCurrentYMD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

export default function ClassMainPage() {
  const { classId } = useParams();
  const items = useMealData(getCurrentYMD(), 2);

  return (
    <>
      <div className="bg-blur" />
      <div className="card-transparent food-div">
        <ListGroup items={items} heading="중식" />
      </div>
      <div className="card-transparent d-counter-div">
        <DDayDisplay />
        <Suspense fallback={<div>Loading components...</div>}>
          <TempDisplay />
        </Suspense>
      </div>
      <div className="footer-text">
        <Footer />
      </div>
      <div className="class-name-display">{classId}반</div>
      <Suspense fallback={<div>Loading components...</div>}>
        <CallDisplay />
      </Suspense>
    </>
  );
}
