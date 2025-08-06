import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import type { Order } from "../schemas"

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const [editingId, setEditingId] = useState<number | null>(null)
  const [editCampus, setEditCampus] = useState("")
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editPronunciation, setEditPronunciation] = useState("")
  const [editComments, setEditComments] = useState("")
  const [editPickupDate, setEditPickupDate] = useState("")
  const [editPickupLocation, setEditPickupLocation] = useState("")
  const [editPickupProxyName, setEditPickupProxyName] = useState("")
  const [editPickupProxyPhone, setEditPickupProxyPhone] = useState("")
  const [editDropoffDate, setEditDropoffDate] = useState("")
  const [editDropoffLocation, setEditDropoffLocation] = useState("")
  const [editDropoffProxyName, setEditDropoffProxyName] = useState("")
  const [editDropoffProxyPhone, setEditDropoffProxyPhone] = useState("")
  const [editItemCount, setEditItemCount] = useState<number | null>(null)
  const [editItems, setEditItems] = useState("")
  const [editRouteId, setEditRouteId] = useState<number | null>(null)

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
    setEditCampus(order.campus ?? "")
    setEditName(order.name ?? "")
    setEditPhone(order.phone ?? "")
    setEditPronunciation(order.pronunciation ?? "")
    setEditComments(order.comments ?? "")
    setEditPickupDate(order.pickup_date ?? "")
    setEditPickupLocation(order.pickup_location ?? "")
    setEditPickupProxyName(order.pickup_proxy_name ?? "")
    setEditPickupProxyPhone(order.pickup_proxy_phone ?? "")
    setEditDropoffDate(order.dropoff_date ?? "")
    setEditDropoffLocation(order.dropoff_location ?? "")
    setEditDropoffProxyName(order.dropoff_proxy_name ?? "")
    setEditDropoffProxyPhone(order.dropoff_proxy_phone ?? "")
    setEditItemCount(order.item_count)
    setEditItems(order.items ?? "")
    setEditRouteId(order.route_id)
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditCampus("")
    setEditName("")
    setEditPhone("")
    setEditPronunciation("")
    setEditComments("")
    setEditPickupDate("")
    setEditPickupLocation("")
    setEditPickupProxyName("")
    setEditPickupProxyPhone("")
    setEditDropoffDate("")
    setEditDropoffLocation("")
    setEditDropoffProxyName("")
    setEditDropoffProxyPhone("")
    setEditItemCount(null)
    setEditItems("")
    setEditRouteId(null)
  }

  const saveEdit = async (id: number) => {
    try {
      const body: any = { id }

      body.id = editingId
      body.campus = editCampus
      body.name = editName
      body.phone = editPhone
      body.pronunciation = editPronunciation
      body.comments = editComments
      body.pickup_date = editPickupDate
      body.pickup_location = editPickupLocation
      body.pickup_proxy_name = editPickupProxyName
      body.pickup_proxy_phone = editPickupProxyPhone
      body.dropoff_date = editDropoffDate
      body.dropoff_location = editDropoffLocation
      body.dropoff_proxy_name = editDropoffProxyName
      body.dropoff_proxy_phone = editDropoffProxyPhone
      body.item_count = editItemCount
      body.items = editItems
      body.route_id = editRouteId

      if (editItemCount !== null && editItemCount !== undefined) body.item_count = editItemCount
      if (editRouteId !== null && editRouteId !== undefined) body.route_id = editRouteId

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
      setOrders(orders =>
        orders.map(o => (o.id === id ? updated : o))
      )
      cancelEdit()
    } catch (err: any) {
      alert(`Update failed: ${err.message || err}`)
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

      {loading && <p>Loading orders...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && orders.length === 0 && <p>No orders found.</p>}

      {orders.length > 0 && (
        <table className="table-auto border border-gray-300">

          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">id</th>
              <th className="border px-4 py-2">campus</th>
              <th className="border px-4 py-2">name</th>
              <th className="border px-4 py-2">phone</th>
              <th className="border px-4 py-2">pronunciation</th>
              <th className="border px-4 py-2">comments</th>
              <th className="border px-4 py-2">pickup_date</th>
              <th className="border px-4 py-2">pickup_location</th>
              <th className="border px-4 py-2">pickup_proxy_name</th>
              <th className="border px-4 py-2">pickup_proxy_phone</th>
              <th className="border px-4 py-2">dropoff_date</th>
              <th className="border px-4 py-2">dropoff_location</th>
              <th className="border px-4 py-2">dropoff_proxy_name</th>
              <th className="border px-4 py-2">dropoff_proxy_phone</th>
              <th className="border px-4 py-2">item_count</th>
              <th className="border px-4 py-2">items</th>
              <th className="border px-4 py-2">route_id</th>

              <th className="border px-4 py-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(order => (
              <tr key={order.id}>
                <td className="border px-4 py-2">{order.id}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editCampus} onChange={e => setEditCampus(e.target.value)}/>) : (order.campus)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editName} onChange={e => setEditName(e.target.value)}/>) : (order.name)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editPhone} onChange={e => setEditPhone(e.target.value)}/>) : (order.phone)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editPronunciation} onChange={e => setEditPronunciation(e.target.value)}/>) : (order.pronunciation)}</td>
                <td className="border px-4 py-2 whitespace-pre-wrap">{editingId === order.id ? (<input className="border px-1" value={editComments} onChange={e => setEditComments(e.target.value)}/>) : (order.comments)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editPickupDate} onChange={e => setEditPickupDate(e.target.value)}/>) : (order.pickup_date)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editPickupLocation} onChange={e => setEditPickupLocation(e.target.value)}/>) : (order.pickup_location)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editPickupProxyName} onChange={e => setEditPickupProxyName(e.target.value)}/>) : (order.pickup_proxy_name)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editPickupProxyPhone} onChange={e => setEditPickupProxyPhone(e.target.value)}/>) : (order.pickup_proxy_phone)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editDropoffDate} onChange={e => setEditDropoffDate(e.target.value)}/>) : (order.dropoff_date)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editDropoffLocation} onChange={e => setEditDropoffLocation(e.target.value)}/>) : (order.dropoff_location)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editDropoffProxyName} onChange={e => setEditDropoffProxyName(e.target.value)}/>) : (order.dropoff_proxy_name)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input className="border px-1" value={editDropoffProxyPhone} onChange={e => setEditDropoffProxyPhone(e.target.value)}/>) : (order.dropoff_proxy_phone)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input type="number" className="border px-1 w-20" value={editItemCount ?? ""} onChange={e => setEditItemCount(e.target.value ? Number(e.target.value) : null)}/>) : (order.item_count)}</td>
                <td className="border px-4 py-2 whitespace-pre-wrap">{editingId === order.id ? (<input className="border px-1" value={editItems} onChange={e => setEditItems(e.target.value)}/>) : (order.items)}</td>
                <td className="border px-4 py-2">{editingId === order.id ? (<input type="number" className="border px-1 w-20" value={editRouteId ?? ""} onChange={e => setEditRouteId(e.target.value ? Number(e.target.value) : null)}/>) : (order.route_id)}</td>

                <td className="border px-4 py-2">
                  {editingId === order.id ? (
                    <>
                      <button
                        className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
                        onClick={() => saveEdit(order.id)}
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
                        onClick={() => startEdit(order)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-1 bg-red-600 text-white rounded"
                        onClick={async () => {
                          if (
                            window.confirm(
                              `Are you sure you want to delete order ${order.id}?`
                            )
                          ) {
                            try {
                              const res = await fetch(
                                `http://localhost:8000/orders/${order.id}`,
                                { method: "DELETE" }
                              )
                              if (!res.ok) {
                                const err = await res.json()
                                throw new Error(err.detail || "Delete failed")
                              }
                              setOrders(orders =>
                                orders.filter(o => o.id !== order.id)
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