import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./index.css";

import Admin from "./pages/Admin.tsx";
import Home from "./pages/Home.tsx";

createRoot(document.getElementById("root")!).render(
	<Router>
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/admin" element={<Admin />} />
		</Routes>
	</Router>
);
