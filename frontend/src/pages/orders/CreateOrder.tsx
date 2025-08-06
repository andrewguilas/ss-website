import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormField from "../../components/FormField"

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
        <FormField
          label="Order ID"
          value={id}
          onChange={e => setId(e.target.value ? Number(e.target.value) : "")}
          type="number"
          required
        />
        <FormField
          label="Campus"
          value={campus}
          onChange={e => setCampus(e.target.value)}
          required
        />
        <FormField
          label="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <FormField
          label="Phone"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />
        <FormField
          label="Pronunciation"
          value={pronunciation}
          onChange={e => setPronunciation(e.target.value)}
        />
        <FormField
          label="Comments"
          value={comments}
          onChange={e => setComments(e.target.value)}
        />
        <FormField
          label="Pickup Date"
          value={pickupDate}
          onChange={e => setPickupDate(e.target.value)}
          type="date"
        />
        <FormField
          label="Pickup Location"
          value={pickupLocation}
          onChange={e => setPickupLocation(e.target.value)}
        />
        <FormField
          label="Pickup Proxy Name"
          value={pickupProxyName}
          onChange={e => setPickupProxyName(e.target.value)}
        />
        <FormField
          label="Pickup Proxy Phone"
          value={pickupProxyPhone}
          onChange={e => setPickupProxyPhone(e.target.value)}
        />
        <FormField
          label="Dropoff Date"
          value={dropoffDate}
          onChange={e => setDropoffDate(e.target.value)}
          type="date"
        />
        <FormField
          label="Dropoff Location"
          value={dropoffLocation}
          onChange={e => setDropoffLocation(e.target.value)}
        />
        <FormField
          label="Dropoff Proxy Name"
          value={dropoffProxyName}
          onChange={e => setDropoffProxyName(e.target.value)}
        />
        <FormField
          label="Dropoff Proxy Phone"
          value={dropoffProxyPhone}
          onChange={e => setDropoffProxyPhone(e.target.value)}
        />
        <FormField
          label="Item Count"
          value={itemCount}
          onChange={e => setItemCount(e.target.value ? Number(e.target.value) : "")}
          type="number"
        />
        <FormField
          label="Items"
          value={items}
          onChange={e => setItems(e.target.value)}
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