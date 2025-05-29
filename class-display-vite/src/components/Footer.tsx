import React from "react";
import cahsSvg from "../assets/cahs.svg";

const Footer: React.FC = () => (
  <footer>
    <img
      className="logo"
      src={cahsSvg}
      alt="중앙고등학교 SVG 로고"
      style={{ height: 27, verticalAlign: "middle" }}
    />
    <br /> 교실 전광판 프로토타입
    <br />
    총괄, 지원: 정새온 선생님
    <br />
    소프트웨어: 황태준 | 하드웨어: 정현찬
    <br />
    교실 전광판 용도 이외 사용 금지
    <br />© {new Date().getFullYear()}{" "}
    <a
      href="https://github.com/tjwhang/class-display"
      target="_blank"
      rel="noopener noreferrer"
    >
      tjwhang
    </a>{" "}
    | NEIS OpenAPI 사용
  </footer>
);

export default Footer;
