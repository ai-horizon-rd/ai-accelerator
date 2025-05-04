import { BrowserRouter, Route, Routes } from "react-router-dom";
import Footer from "./components/Footer";
import MainPage from "./pages/MainPage";

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
