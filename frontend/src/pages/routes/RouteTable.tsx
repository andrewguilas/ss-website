import type { Route } from "../../types"
import RouteRow from "./RouteRow"

interface Props {
  routes: Route[]
  editingId: number | null
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

export default function RouteTable({
  routes,
  editingId,
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
    <table className="table-auto border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">id</th>
          <th className="border px-4 py-2">date</th>
          <th className="border px-4 py-2">driver_name</th>
          <th className="border px-4 py-2">comments</th>
          <th className="border px-4 py-2">truck_id</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {routes.map(route => (
          <RouteRow
            key={route.id}
            route={route}
            isEditing={editingId === route.id}
            editDriverName={editDriverName}
            editComments={editComments}
            editTruckId={editTruckId}
            setEditDriverName={setEditDriverName}
            setEditComments={setEditComments}
            setEditTruckId={setEditTruckId}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            deleteRoute={deleteRoute}
          />
        ))}
      </tbody>
    </table>
  )
}