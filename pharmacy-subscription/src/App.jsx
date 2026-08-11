import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import OrdersPage from "./pages/Orders";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<OrdersPage />} />
        <Route path="/orders" element={<OrdersPage />} />
      </Routes>
    </Router>
  );
}
