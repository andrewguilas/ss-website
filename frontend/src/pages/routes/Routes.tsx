import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import RouteTable from "./RouteTable"

export interface Route {
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

  const deleteRoute = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/routes/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Delete failed")
      }
      setRoutes(routes => routes.filter(r => r.id !== id))
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err.toString()}`)
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
        <RouteTable
          routes={routes}
          editingId={editingId}
          editDriverName={editDriverName}
          editComments={editComments}
          editTruckId={editTruckId}
          setEditDriverName={setEditDriverName}
          setEditComments={setEditComments}
          setEditTruckId={setEditTruckId}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          deleteRoute={deleteRoute}
        />
      )}
    </div>
  )
}
