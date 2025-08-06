import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import TruckTable from "./TruckTable"
import LoadingIndicator from "../../components/LoadingIndicator"
import ErrorMessage from "../../components/ErrorMessage"
import type { Truck } from "../../types"

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editModel, setEditModel] = useState("")
  const [editComments, setEditComments] = useState("")

  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8000/trucks")
      .then(res => res.json())
      .then(data => setTrucks(data))
      .catch(err => {
        setError("Failed to fetch trucks.")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  const startEdit = (truck: Truck) => {
    setEditingId(truck.id)
    setEditModel(truck.model ?? "")
    setEditComments(truck.comments ?? "")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditModel("")
    setEditComments("")
  }

  const saveEdit = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/trucks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, model: editModel, comments: editComments }),
      })
      if (!res.ok) throw new Error("Failed to update truck")
      const updated = await res.json()
      setTrucks(trucks =>
        trucks.map(t => (t.id === id ? updated : t))
      )
      cancelEdit()
    } catch (err) {
      alert(`Update failed: ${err}`)
    }
  }

  const deleteTruck = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/trucks/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Delete failed")
      }
      setTrucks(trucks => trucks.filter(t => t.id !== id))
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err.toString()}`)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trucks</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => navigate("/trucks/create")}
      >
        Create Truck
      </button>
      {loading && <LoadingIndicator message="Loading trucks..." />}
      <ErrorMessage error={error} />
      {!loading && trucks.length === 0 && <p>No trucks found.</p>}
      {trucks.length > 0 && (
        <TruckTable
          trucks={trucks}
          editingId={editingId}
          editModel={editModel}
          editComments={editComments}
          setEditModel={setEditModel}
          setEditComments={setEditComments}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          deleteTruck={deleteTruck}
        />
      )}
    </div>
  )
}
