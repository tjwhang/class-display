import DDayDisplay from "./components/DDayDisplay";
import ListGroup from "./components/ListGroup";
import { useMealData } from "./hooks/useMealData";
import { useState } from "react";
import "./App.css";

function getCurrentYMD() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function App() {
  const items = useMealData(getCurrentYMD());
  return (
    <>
      <div className="card-transparent food-div">
        <ListGroup items={items} heading="급식표" />
      </div>
      <br />
      <div className="card-transparent d-counter-div">
        <DDayDisplay />
      </div>
    </>
  );
}

export default App;
