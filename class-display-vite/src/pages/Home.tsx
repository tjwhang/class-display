import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../App.css";
import Footer from "../components/Footer";
import cahsLogo from "../assets/cahs.svg";

function Home() {
  const [classes, setClasses] = useState<string[]>([]);
  const [selectedClass, setSelectedClass] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/classes")
      .then((res) => res.json())
      .then((data) => setClasses(data.classes));
  }, []);

  const handleGo = () => {
    if (selectedClass) navigate(`/class/${selectedClass}`);
  };

  return (
    <div className="class-select-page">
      <div className="bg-blur" />
      <img src={cahsLogo} alt="CAHS Logo" className="home-logo" />
      <h2 className="class-select-title">반을 선택하세요</h2>
      <div className="class-select-dropdown-wrap">
        <select
          className="class-select-dropdown"
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
          aria-label="반 선택"
        >
          <option value="">반 선택</option>
          {classes.map((cls) => (
            <option key={cls} value={cls}>
              {cls}반
            </option>
          ))}
        </select>
        <button
          className="class-select-btn"
          onClick={handleGo}
          disabled={!selectedClass}
        >
          이동
        </button>
      </div>
      <div className="footer-text">
        <Footer />
      </div>
    </div>
  );
}

export default Home;
