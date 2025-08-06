import type { Truck } from "./Trucks"

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
        {isEditing ? (
          <>
            <button
              className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
              onClick={() => saveEdit(truck.id)}
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
              onClick={() => startEdit(truck)}
            >
              Edit
            </button>
            <button
              className="px-2 py-1 bg-red-600 text-white rounded"
              onClick={() => {
                if (window.confirm(`Are you sure you want to delete truck ${truck.id}?`)) {
                  deleteTruck(truck.id)
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