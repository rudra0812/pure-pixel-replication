import { createRoot } from "react-dom/client";

// Initialize theme from localStorage before render to prevent flash
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  document.documentElement.classList.add("dark");
}
import App from "./App.tsx";
import "./index.css";

const root = document.getElementById("root")!;
createRoot(root).render(<App />);
