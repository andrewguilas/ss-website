import { useState } from "react"
import { useNavigate } from "react-router-dom"

export default function CreateOrder() {
  const [id, setId] = useState<number | "">("")
  const [campus, setCampus] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [pronunciation, setPronunciation] = useState("")
  const [comments, setComments] = useState("")
  const [pickupDate, setPickupDate] = useState("")
  const [pickupLocation, setPickupLocation] = useState("")
  const [pickupProxyName, setPickupProxyName] = useState("")
  const [pickupProxyPhone, setPickupProxyPhone] = useState("")
  const [dropoffDate, setDropoffDate] = useState("")
  const [dropoffLocation, setDropoffLocation] = useState("")
  const [dropoffProxyName, setDropoffProxyName] = useState("")
  const [dropoffProxyPhone, setDropoffProxyPhone] = useState("")
  const [itemCount, setItemCount] = useState<number | "">("")
  const [items, setItems] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const res = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: id === "" ? undefined : Number(id),
          campus,
          name,
          phone: phone || undefined,
          pronunciation: pronunciation || undefined,
          comments: comments || undefined,
          pickup_date: pickupDate || undefined,
          pickup_location: pickupLocation || undefined,
          pickup_proxy_name: pickupProxyName || undefined,
          pickup_proxy_phone: pickupProxyPhone || undefined,
          dropoff_date: dropoffDate || undefined,
          dropoff_location: dropoffLocation || undefined,
          dropoff_proxy_name: dropoffProxyName || undefined,
          dropoff_proxy_phone: dropoffProxyPhone || undefined,
          item_count: itemCount === "" ? undefined : Number(itemCount),
          items: items || undefined,
        }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Failed to create order")
      }
      navigate("/orders")
    } catch (err: any) {
      setError(err.message || "Failed to create order")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Order ID</label>
          <input
            type="number"
            className="border px-2 py-1 rounded w-full"
            value={id}
            onChange={e => setId(e.target.value ? Number(e.target.value) : "")}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Campus</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={campus}
            onChange={e => setCampus(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Phone</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pronunciation</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={pronunciation}
            onChange={e => setPronunciation(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Comments</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={comments}
            onChange={e => setComments(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pickup Date</label>
          <input
            type="date"
            className="border px-2 py-1 rounded w-full"
            value={pickupDate}
            onChange={e => setPickupDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pickup Location</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={pickupLocation}
            onChange={e => setPickupLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pickup Proxy Name</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={pickupProxyName}
            onChange={e => setPickupProxyName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Pickup Proxy Phone</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={pickupProxyPhone}
            onChange={e => setPickupProxyPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Dropoff Date</label>
          <input
            type="date"
            className="border px-2 py-1 rounded w-full"
            value={dropoffDate}
            onChange={e => setDropoffDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Dropoff Location</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={dropoffLocation}
            onChange={e => setDropoffLocation(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Dropoff Proxy Name</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={dropoffProxyName}
            onChange={e => setDropoffProxyName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Dropoff Proxy Phone</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={dropoffProxyPhone}
            onChange={e => setDropoffProxyPhone(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Item Count</label>
          <input
            type="number"
            className="border px-2 py-1 rounded w-full"
            value={itemCount}
            onChange={e => setItemCount(e.target.value ? Number(e.target.value) : "")}
            min={0}
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Items</label>
          <input
            className="border px-2 py-1 rounded w-full"
            value={items}
            onChange={e => setItems(e.target.value)}
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
            onClick={() => navigate("/orders")}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}