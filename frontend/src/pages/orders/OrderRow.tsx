import TableActions from "../../components/TableActions"
import type { Order } from "../../types"

interface Props {
  order: Order
  isEditing: boolean
  editFields: Partial<Order>
  setEditFields: (fields: Partial<Order>) => void
  startEdit: (order: Order) => void
  cancelEdit: () => void
  saveEdit: (id: number) => void
  deleteOrder: (id: number) => void
}

export default function OrderRow({
  order,
  isEditing,
  editFields,
  setEditFields,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteOrder,
}: Props) {
  const handleChange = (field: keyof Order, value: any) => {
    setEditFields({ ...editFields, [field]: value })
  }

  return (
    <tr>
      <td className="border px-4 py-2">{order.id}</td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.campus ?? ""} onChange={e => handleChange("campus", e.target.value)} />
        ) : order.campus}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.name ?? ""} onChange={e => handleChange("name", e.target.value)} />
        ) : order.name}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.phone ?? ""} onChange={e => handleChange("phone", e.target.value)} />
        ) : order.phone}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.pronunciation ?? ""} onChange={e => handleChange("pronunciation", e.target.value)} />
        ) : order.pronunciation}
      </td>
      <td className="border px-4 py-2 whitespace-pre-wrap">
        {isEditing ? (
          <input className="border px-1" value={editFields.comments ?? ""} onChange={e => handleChange("comments", e.target.value)} />
        ) : order.comments}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.pickup_date ?? ""} onChange={e => handleChange("pickup_date", e.target.value)} />
        ) : order.pickup_date}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.pickup_location ?? ""} onChange={e => handleChange("pickup_location", e.target.value)} />
        ) : order.pickup_location}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.pickup_proxy_name ?? ""} onChange={e => handleChange("pickup_proxy_name", e.target.value)} />
        ) : order.pickup_proxy_name}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.pickup_proxy_phone ?? ""} onChange={e => handleChange("pickup_proxy_phone", e.target.value)} />
        ) : order.pickup_proxy_phone}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.dropoff_date ?? ""} onChange={e => handleChange("dropoff_date", e.target.value)} />
        ) : order.dropoff_date}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.dropoff_location ?? ""} onChange={e => handleChange("dropoff_location", e.target.value)} />
        ) : order.dropoff_location}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.dropoff_proxy_name ?? ""} onChange={e => handleChange("dropoff_proxy_name", e.target.value)} />
        ) : order.dropoff_proxy_name}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input className="border px-1" value={editFields.dropoff_proxy_phone ?? ""} onChange={e => handleChange("dropoff_proxy_phone", e.target.value)} />
        ) : order.dropoff_proxy_phone}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input type="number" className="border px-1 w-20" value={editFields.item_count ?? ""} onChange={e => handleChange("item_count", e.target.value ? Number(e.target.value) : null)} />
        ) : order.item_count}
      </td>
      <td className="border px-4 py-2 whitespace-pre-wrap">
        {isEditing ? (
          <input className="border px-1" value={editFields.items ?? ""} onChange={e => handleChange("items", e.target.value)} />
        ) : order.items}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input type="number" className="border px-1 w-20" value={editFields.route_id ?? ""} onChange={e => handleChange("route_id", e.target.value ? Number(e.target.value) : null)} />
        ) : order.route_id}
      </td>
      <td className="border px-4 py-2">
        <TableActions
          isEditing={isEditing}
          onEdit={() => startEdit(order)}
          onDelete={() => {
            if (window.confirm(`Are you sure you want to delete order ${order.id}?`)) {
              deleteOrder(order.id)
            }
          }}
          onSave={() => saveEdit(order.id)}
          onCancel={cancelEdit}
        />
      </td>
    </tr>
  )
}