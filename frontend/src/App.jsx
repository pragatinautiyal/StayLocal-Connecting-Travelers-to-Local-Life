import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeProvider";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import ComponentsDemo from "./pages/ComponentsDemo";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import AiScreen from "./pages/AiScreen";

function App() {
  return (
    <ThemeProvider>
      <div className="w-full min-h-screen overflow-x-hidden bg-white dark:bg-slate-900 transition-colors duration-300">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/ai" element={<AiScreen />} />
            <Route path="/components" element={<ComponentsDemo />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
