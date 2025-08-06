import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

interface Truck {
  id: number
  model: string | null
  comments: string | null
}

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trucks</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => navigate("/trucks/create")}
      >
        Create Truck
      </button>
      {loading && <p>Loading trucks...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && trucks.length === 0 && <p>No trucks found.</p>}
      {trucks.length > 0 && (
        <table className="table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">id</th>
              <th className="border px-4 py-2">model</th>
              <th className="border px-4 py-2">comments</th>
              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map(truck => (
              <tr key={truck.id}>
                <td className="border px-4 py-2">{truck.id}</td>
                <td className="border px-4 py-2">
                  {editingId === truck.id ? (
                    <input
                      className="border px-1"
                      value={editModel}
                      onChange={e => setEditModel(e.target.value)}
                    />
                  ) : (
                    truck.model
                  )}
                </td>
                <td className="border px-4 py-2 whitespace-pre-wrap">
                  {editingId === truck.id ? (
                    <input
                      className="border px-1 w-full"
                      value={editComments}
                      onChange={e => setEditComments(e.target.value)}
                    />
                  ) : (
                    truck.comments
                  )}
                </td>
                <td className="border px-4 py-2">
                  {editingId === truck.id ? (
                    <>
                      <button
                        className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                        onClick={() => saveEdit(truck.id)}
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
                        onClick={() => startEdit(truck)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete truck ${truck.id}?`
                            )
                          ) {
                            try {
                              const res = await fetch(
                                `http://localhost:8000/trucks/${truck.id}`,
                                { method: "DELETE" }
                              )
                              if (!res.ok) {
                                const err = await res.json()
                                throw new Error(err.detail || "Delete failed")
                              }
                              setTrucks(trucks =>
                                trucks.filter(t => t.id !== truck.id)
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
