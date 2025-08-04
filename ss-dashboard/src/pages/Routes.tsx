import { useEffect, useState } from "react"

interface Route {
  id: number
  date: string
  driver_name: string | null
  comments: string | null
  truck_id: number | null
}

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch("http://localhost:8000/routes")
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => {
        setError("Failed to fetch routes.")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Routes</h1>
      {loading && <p>Loading routes...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && routes.length === 0 && <p>No routes found.</p>}
      {routes.length > 0 && (
        <table className="table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">id</th>
              <th className="border px-4 py-2">date</th>
              <th className="border px-4 py-2">driver_name</th>
              <th className="border px-4 py-2">comments</th>
              <th className="border px-4 py-2">truck_id</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td className="border px-4 py-2">{route.id}</td>
                <td className="border px-4 py-2">{route.date}</td>
                <td className="border px-4 py-2">{route.driver_name}</td>
                <td className="border px-4 py-2">{route.comments}</td>
                <td className="border px-4 py-2">{route.truck_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
