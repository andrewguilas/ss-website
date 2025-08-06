import type { Order } from "../../types"
import OrderRow from "./OrderRow"

interface Props {
  orders: Order[]
  editingId: number | null
  editFields: Partial<Order>
  setEditFields: (fields: Partial<Order>) => void
  startEdit: (order: Order) => void
  cancelEdit: () => void
  saveEdit: (id: number) => void
  deleteOrder: (id: number) => void
}

export default function OrderTable({
  orders,
  editingId,
  editFields,
  setEditFields,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteOrder,
}: Props) {
  return (
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
          <OrderRow
            key={order.id}
            order={order}
            isEditing={editingId === order.id}
            editFields={editFields}
            setEditFields={setEditFields}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            deleteOrder={deleteOrder}
          />
        ))}
      </tbody>
    </table>
  )
}