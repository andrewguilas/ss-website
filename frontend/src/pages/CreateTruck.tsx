import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateTruck() {
  const [model, setModel] = useState("")
  const [comments, setComments] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:8000/trucks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, comments }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Failed to create truck")
      }
      navigate("/trucks")
    } catch (err: any) {
      setError(err.message || "Failed to create truck")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Truck</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Model</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={model}
            onChange={e => setModel(e.target.value)}
            placeholder="Model"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Comments</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={comments}
            onChange={e => setComments(e.target.value)}
            placeholder="Comments"
          />
        </div>
        {error && <p className="text-red-600">{error}</p>}
        <div className="flex gap-2">
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create"}
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-gray-400 text-white rounded"
            onClick={() => navigate("/trucks")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}