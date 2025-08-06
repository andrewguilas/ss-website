import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormField from "../../components/FormField"

export default function CreateRoute() {
  const [date, setDate] = useState("")
  const [driverName, setDriverName] = useState("")
  const [comments, setComments] = useState("")
  const [truckId, setTruckId] = useState<number | "">("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:8000/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date,
          driver_name: driverName,
          comments,
          truck_id: truckId === "" ? null : Number(truckId),
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Failed to create route")
      }
      navigate("/routes")
    } catch (err: any) {
      setError(err.message || "Failed to create route")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Route</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormField
          label="Date"
          value={date}
          onChange={e => setDate(e.target.value)}
          type="date"
          required
        />
        <FormField
          label="Driver Name"
          value={driverName}
          onChange={e => setDriverName(e.target.value)}
        />
        <FormField
          label="Comments"
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
        <FormField
          label="Truck ID"
          value={truckId}
          onChange={e => setTruckId(e.target.value ? Number(e.target.value) : "")}
          type="number"
        />
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
            onClick={() => navigate("/routes")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}