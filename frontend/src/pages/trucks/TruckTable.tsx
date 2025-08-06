import type { Truck } from "./Trucks"
import TruckRow from "./TruckRow"

interface Props {
  trucks: Truck[]
  editingId: number | null
  editModel: string
  editComments: string
  setEditModel: (val: string) => void
  setEditComments: (val: string) => void
  startEdit: (truck: Truck) => void
  cancelEdit: () => void
  saveEdit: (id: number) => void
  deleteTruck: (id: number) => void
}

export default function TruckTable({
  trucks,
  editingId,
  editModel,
  editComments,
  setEditModel,
  setEditComments,
  startEdit,
  cancelEdit,
  saveEdit,
  deleteTruck,
}: Props) {
  return (
    <table className="table-auto border border-gray-300">
      <thead>
        <tr className="bg-gray-200">
          <th className="border px-4 py-2">id</th>
          <th className="border px-4 py-2">model</th>
          <th className="border px-4 py-2">comments</th>
          <th className="border px-4 py-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {trucks.map(truck => (
          <TruckRow
            key={truck.id}
            truck={truck}
            isEditing={editingId === truck.id}
            editModel={editModel}
            editComments={editComments}
            setEditModel={setEditModel}
            setEditComments={setEditComments}
            startEdit={startEdit}
            cancelEdit={cancelEdit}
            saveEdit={saveEdit}
            deleteTruck={deleteTruck}
          />
        ))}
      </tbody>
    </table>
  )
}