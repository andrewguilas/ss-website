import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Route } from "../schemas"

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editDriverName, setEditDriverName] = useState("")
  const [editComments, setEditComments] = useState("")
  const [editTruckId, setEditTruckId] = useState<number | null>(null)
  
  const navigate = useNavigate()

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

  const startEdit = (route: Route) => {
    setEditingId(route.id)
    setEditDriverName(route.driver_name ?? "")
    setEditComments(route.comments ?? "")
    setEditTruckId(route.truck_id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditDriverName("")
    setEditComments("")
    setEditTruckId(null)
  }

  const saveEdit = async (id: number) => {
    try {
      const body: any = { id }

      body.driver_name = editDriverName
      body.comments = editComments
      
      if (editTruckId !== null && editTruckId !== undefined) body.truck_id = editTruckId

      const res = await fetch("http://localhost:8000/routes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.detail || "Failed to update route")
      }
      
      const updated = await res.json()
      setRoutes(routes =>
        routes.map(r => (r.id === id ? updated : r))
      )
      cancelEdit()
    } catch (err: any) {
      alert(`Update failed: ${err.message || err}`)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Routes</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => navigate("/routes/create")}
      >
        Create Route
      </button>
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
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {routes.map(route => (
              <tr key={route.id}>
                <td className="border px-4 py-2">{route.id}</td>
                <td className="border px-4 py-2">
                  {route.date}
                </td>
                <td className="border px-4 py-2">
                  {editingId === route.id ? (
                    <input
                      className="border px-1"
                      value={editDriverName}
                      onChange={e => setEditDriverName(e.target.value)}
                    />
                  ) : (
                    route.driver_name
                  )}
                </td>
                <td className="border px-4 py-2 whitespace-pre-wrap">
                  {editingId === route.id ? (
                    <input
                      className="border px-1 w-full"
                      value={editComments}
                      onChange={e => setEditComments(e.target.value)}
                    />
                  ) : (
                    route.comments
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingId === route.id ? (
                    <input
                      type="number"
                      className="border px-1 w-20"
                      value={editTruckId ?? ""}
                      onChange={e => setEditTruckId(e.target.value ? Number(e.target.value) : null)}
                    />
                  ) : (
                    route.truck_id
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingId === route.id ? (
                    <>
                      <button
                        className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                        onClick={() => saveEdit(route.id)}
                      >
                        Save
                      </button>
                      <button
                        className="px-2 py-1 bg-gray-400 text-white rounded"
                        onClick={cancelEdit}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-2 py-1 bg-blue-600 text-white rounded mr-2"
                        onClick={() => startEdit(route)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete route ${route.id}?`
                            )
                          ) {
                            try {
                              const res = await fetch(
                                `http://localhost:8000/routes/${route.id}`,
                                { method: "DELETE" }
                              )
                              if (!res.ok) {
                                const err = await res.json()
                                throw new Error(err.detail || "Delete failed")
                              }
                              setRoutes(routes =>
                                routes.filter(r => r.id !== route.id)
                              )
                            } catch (err: any) {
                              alert(
                                `Delete failed: ${err.message || err.toString()}`
                              )
                            }
                          }
                        }}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
