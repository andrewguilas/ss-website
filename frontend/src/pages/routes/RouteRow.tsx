import TableActions from "../../components/TableActions"
import type { Route } from "../../types"

interface Props {
  route: Route
  isEditing: boolean
  editDriverName: string
  editComments: string
  editTruckId: number | null
  setEditDriverName: (val: string) => void
  setEditComments: (val: string) => void
  setEditTruckId: (val: number | null) => void
  startEdit: (route: Route) => void
  cancelEdit: () => void
  saveEdit: (id: number) => void
  deleteRoute: (id: number) => void
}

export default function RouteRow({
  route,
  isEditing,
  editDriverName,
  editComments,
  editTruckId,
  setEditDriverName,
  setEditComments,
  setEditTruckId,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteRoute,
}: Props) {
  return (
    <tr>
      <td className="border px-4 py-2">{route.id}</td>
      <td className="border px-4 py-2">{route.date}</td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input
            className="border px-1"
            value={editDriverName}
            onChange={e => setEditDriverName(e.target.value)}
          />
        ) : (
          route.driver_name
        )}
      </td>
      <td className="border px-4 py-2 whitespace-pre-wrap">
        {isEditing ? (
          <input
            className="border px-1 w-full"
            value={editComments}
            onChange={e => setEditComments(e.target.value)}
          />
        ) : (
          route.comments
        )}
      </td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input
            type="number"
            className="border px-1 w-20"
            value={editTruckId ?? ""}
            onChange={e => setEditTruckId(e.target.value ? Number(e.target.value) : null)}
          />
        ) : (
          route.truck_id
        )}
      </td>
      <td className="border px-4 py-2">
        <TableActions
          isEditing={isEditing}
          onEdit={() => startEdit(route)}
          onDelete={() => {
            if (window.confirm(`Are you sure you want to delete route ${route.id}?`)) {
              deleteRoute(route.id)
            }
          }}
          onSave={() => saveEdit(route.id)}
          onCancel={cancelEdit}
        />
      </td>
    </tr>
  )
}