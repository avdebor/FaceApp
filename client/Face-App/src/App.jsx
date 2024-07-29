import "./App.css";
import Mainpage from "./components/MainPage/Mainpage";
import NotFound from "./pages/404/404";
import LandingPage from "./pages/Landing/LandingPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="app" element={<Mainpage />} />
          <Route path="*" element={<NotFound />} />
          <Route index element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
