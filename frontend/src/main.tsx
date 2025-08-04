import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import App from './App'
import Home from './pages/Home'
import Orders from './pages/Orders'
import RoutesPage from './pages/Routes'
import Trucks from './pages/Trucks'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App>
        <nav className="p-4 bg-gray-100 flex gap-4">
          <Link to="/" className="text-blue-600 hover:underline">Home</Link>
          <Link to="/orders" className="text-blue-600 hover:underline">Orders</Link>
          <Link to="/routes" className="text-blue-600 hover:underline">Routes</Link>
          <Link to="/trucks" className="text-blue-600 hover:underline">Trucks</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/routes" element={<RoutesPage />} />
          <Route path="/trucks" element={<Trucks />} />
        </Routes>
      </App>
    </BrowserRouter>
  </React.StrictMode>
)
