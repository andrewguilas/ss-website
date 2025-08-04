import React, { useEffect, useState } from 'react'

interface Order {
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

  useEffect(() => {
    fetch('http://localhost:8000/orders')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch orders')
        return res.json()
      })
      .then((data) => {
        setOrders(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="p-4">Loading orders...</div>
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found.</div>
      ) : (
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2 text-left">id</th>
              <th className="border border-gray-300 p-2 text-left">campus</th>
              <th className="border border-gray-300 p-2 text-left">name</th>
              <th className="border border-gray-300 p-2 text-left">phone</th>
              <th className="border border-gray-300 p-2 text-left">pronunciation</th>
              <th className="border border-gray-300 p-2 text-left">comments</th>
              <th className="border border-gray-300 p-2 text-left">pickup_date</th>
              <th className="border border-gray-300 p-2 text-left">pickup_location</th>
              <th className="border border-gray-300 p-2 text-left">pickup_proxy_name</th>
              <th className="border border-gray-300 p-2 text-left">pickup_proxy_phone</th>
              <th className="border border-gray-300 p-2 text-left">dropoff_date</th>
              <th className="border border-gray-300 p-2 text-left">dropoff_location</th>
              <th className="border border-gray-300 p-2 text-left">dropoff_proxy_name</th>
              <th className="border border-gray-300 p-2 text-left">dropoff_proxy_phone</th>
              <th className="border border-gray-300 p-2 text-left">item_count</th>
              <th className="border border-gray-300 p-2 text-left">items</th>
              <th className="border border-gray-300 p-2 text-left">route_id</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="border border-gray-300 p-2">{order.id}</td>
                <td className="border border-gray-300 p-2">{order.campus}</td>
                <td className="border border-gray-300 p-2">{order.name}</td>
                <td className="border border-gray-300 p-2">{order.phone}</td>
                <td className="border border-gray-300 p-2">{order.pronunciation}</td>
                <td className="border border-gray-300 p-2">{order.comments}</td>
                <td className="border border-gray-300 p-2">{order.pickup_date}</td>
                <td className="border border-gray-300 p-2">{order.pickup_location}</td>
                <td className="border border-gray-300 p-2">{order.pickup_proxy_name}</td>
                <td className="border border-gray-300 p-2">{order.pickup_proxy_phone}</td>
                <td className="border border-gray-300 p-2">{order.dropoff_date}</td>
                <td className="border border-gray-300 p-2">{order.dropoff_location}</td>
                <td className="border border-gray-300 p-2">{order.dropoff_proxy_name}</td>
                <td className="border border-gray-300 p-2">{order.dropoff_proxy_phone}</td>
                <td className="border border-gray-300 p-2">{order.item_count}</td>
                <td className="border border-gray-300 p-2">{order.items}</td>
                <td className="border border-gray-300 p-2">{order.route_id}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
