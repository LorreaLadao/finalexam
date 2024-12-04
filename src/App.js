import './App.css';
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LevelSelectPage from './pages/LevelSelectPage';
import WelcomePage from './pages/WelcomePage';
import ErrorPage from './pages/ErrorPage';


import AOS from 'aos';
import 'aos/dist/aos.css'; 
import Game from './pages/Game';




function App() {
  AOS.init();
  return (
    <>
    <BrowserRouter>
      <Routes>
          <Route path='/' index element={<WelcomePage />} />
          <Route path='/select-level' element={<LevelSelectPage />} />
          <Route path='*' element={<ErrorPage />} />
          <Route path='/start' element={<Game />} />
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;