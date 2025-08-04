import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"
import Orders from "./pages/Orders"
import RoutesPage from "./pages/Routes"
import Trucks from "./pages/Trucks"
import CsvUploadPage from "./pages/CsvUploadPage"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/trucks" element={<Trucks />} />
        <Route path="/upload" element={<CsvUploadPage />} />
      </Route>
    </Routes>
  )
}

export default App
