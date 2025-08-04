import { useEffect, useState } from "react"

interface Truck {
  id: number
  model: string | null
  comments: string | null
}

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

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

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Trucks</h1>
      {loading && <p>Loading trucks...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && trucks.length === 0 && <p>No trucks found.</p>}
      {trucks.length > 0 && (
        <table className="table-auto border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">ID</th>
              <th className="border px-4 py-2">Model</th>
              <th className="border px-4 py-2">Comments</th>
            </tr>
          </thead>
          <tbody>
            {trucks.map(truck => (
              <tr key={truck.id}>
                <td className="border px-4 py-2">{truck.id}</td>
                <td className="border px-4 py-2">{truck.model}</td>
                <td className="border px-4 py-2 whitespace-pre-wrap">{truck.comments}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
