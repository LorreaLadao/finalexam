import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LevelSelectPage from './pages/LevelSelectPage';
import WelcomePage from './pages/WelcomePage';
import ErrorPage from './pages/ErrorPage';
import AOS from 'aos';
import 'aos/dist/aos.css'; 
import EasyMode from './pages/EasyMode';
import MediumMode from './pages/MediumMode';
import HardMode from './pages/HardMode';

function App() {
  AOS.init();
  return (
    <BrowserRouter>
      <Routes>
          <Route path="" element={<WelcomePage />} />
          <Route path="/select-level" element={<LevelSelectPage />} />
          <Route path="/easy" element={<EasyMode />} />
          <Route path="/medium" element={<MediumMode />} />
          <Route path="/hard" element={<HardMode />} />
          <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
