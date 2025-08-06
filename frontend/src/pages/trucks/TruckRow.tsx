import type { Truck } from "./Trucks"
import TableActions from "../../components/TableActions"

interface Props {
  truck: Truck
  isEditing: boolean
  editModel: string
  editComments: string
  setEditModel: (val: string) => void
  setEditComments: (val: string) => void
  startEdit: (truck: Truck) => void
  cancelEdit: () => void
  saveEdit: (id: number) => void
  deleteTruck: (id: number) => void
}

export default function TruckRow({
  truck,
  isEditing,
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
    <tr>
      <td className="border px-4 py-2">{truck.id}</td>
      <td className="border px-4 py-2">
        {isEditing ? (
          <input
            className="border px-1"
            value={editModel}
            onChange={e => setEditModel(e.target.value)}
          />
        ) : (
          truck.model
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
          truck.comments
        )}
      </td>
      <td className="border px-4 py-2">
        <TableActions
          isEditing={isEditing}
          onEdit={() => startEdit(truck)}
          onDelete={() => {
            if (window.confirm(`Are you sure you want to delete truck ${truck.id}?`)) {
              deleteTruck(truck.id)
            }
          }}
          onSave={() => saveEdit(truck.id)}
          onCancel={cancelEdit}
        />
      </td>
    </tr>
  )
}