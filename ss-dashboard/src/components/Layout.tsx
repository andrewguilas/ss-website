import { Link, Outlet } from "react-router-dom"

export default function Layout() {
  return (
    <div>
      <nav className="bg-gray-800 text-white px-6 py-3 flex gap-4">
        <Link to="/orders" className="hover:underline">Orders</Link>
        <Link to="/routes" className="hover:underline">Routes</Link>
        <Link to="/trucks" className="hover:underline">Trucks</Link>
      </nav>
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  )
}
