import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "./components/Layout"

import Orders from "./pages/orders/Orders"
import CreateOrder from "./pages/orders/CreateOrder"

import RoutesPage from "./pages/routes/Routes"
import CreateRoute from "./pages/routes/CreateRoute"

import Trucks from "./pages/trucks/Trucks"
import CreateTruck from "./pages/trucks/CreateTruck"

import CsvUploadPage from "./pages/upload/CsvUploadPage"

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<CsvUploadPage />} />

        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/create" element={<CreateOrder />} />

        <Route path="/routes" element={<RoutesPage />} />
        <Route path="/routes/create" element={<CreateRoute />} />

        <Route path="/trucks" element={<Trucks />} />
        <Route path="/trucks/create" element={<CreateTruck />} />

        <Route path="/upload" element={<CsvUploadPage />} />
      </Route>
    </Routes>
  )
}

export default App
