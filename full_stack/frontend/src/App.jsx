import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import "./styles/app.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/products/:slug" element={<ProductPage />} />
      </Routes>
    </>
  );
}

export default App;
