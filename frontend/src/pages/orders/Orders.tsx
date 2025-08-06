import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import OrderTable from "./OrderTable"
import LoadingIndicator from "../../components/LoadingIndicator"
import ErrorMessage from "../../components/ErrorMessage"

export interface Order {
  id: number
  campus: string
  name: string
  phone: string | null
  pronunciation: string | null
  comments: string | null
  pickup_date: string | null
  pickup_location: string | null
  pickup_proxy_name: string | null
  pickup_proxy_phone: string | null
  dropoff_date: string | null
  dropoff_location: string | null
  dropoff_proxy_name: string | null
  dropoff_proxy_phone: string | null
  item_count: number | null
  items: string | null
  route_id: number | null
}

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editFields, setEditFields] = useState<Partial<Order>>({})

  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8000/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => {
        setError("Failed to fetch orders.")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  const startEdit = (order: Order) => {
    setEditingId(order.id)
    setEditFields({ ...order })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditFields({})
  }

  const saveEdit = async (id: number) => {
    try {
      const body = { ...editFields, id }
      const res = await fetch("http://localhost:8000/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}))
        throw new Error(errJson.detail || "Failed to update order")
      }
      const updated = await res.json()
      setOrders(orders => orders.map(o => (o.id === id ? updated : o)))
      cancelEdit()
    } catch (err: any) {
      alert(`Update failed: ${err.message || err}`)
    }
  }

  const deleteOrder = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:8000/orders/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Delete failed")
      }
      setOrders(orders => orders.filter(o => o.id !== id))
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err.toString()}`)
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Orders</h1>
      <button
        className="mb-4 px-4 py-2 bg-green-600 text-white rounded"
        onClick={() => navigate("/orders/create")}
      >
        Create Order
      </button>
      {loading && <LoadingIndicator message="Loading orders..." />}
      <ErrorMessage error={error || ""} />
      {!loading && orders.length === 0 && <p>No orders found.</p>}
      {orders.length > 0 && (
        <OrderTable
          orders={orders}
          editingId={editingId}
          editFields={editFields}
          setEditFields={setEditFields}
          startEdit={startEdit}
          cancelEdit={cancelEdit}
          saveEdit={saveEdit}
          deleteOrder={deleteOrder}
        />
      )}
    </div>
  )
}