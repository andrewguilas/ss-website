import type { Route } from "./Routes"

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
        {isEditing ? (
          <>
            <button
              className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
              onClick={() => saveEdit(route.id)}
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
              onClick={() => startEdit(route)}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 bg-red-600 text-white rounded"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete route ${route.id}?`)) {
                  deleteRoute(route.id)
                }
              }}
            >
              Delete
            </button>
          </>
        )}
      </td>
    </tr>
  )
}