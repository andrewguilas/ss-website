interface TableActionsProps {
    isEditing: boolean
    onEdit?: () => void
    onDelete?: () => void
    onSave?: () => void
    onCancel?: () => void
  }
  
  export default function TableActions({
    isEditing,
    onEdit,
    onDelete,
    onSave,
    onCancel,
  }: TableActionsProps) {
    return isEditing ? (
      <>
        <button
          className="mr-2 px-2 py-1 bg-green-600 text-white rounded"
          onClick={onSave}
        >
          Save
        </button>
        <button
          className="px-2 py-1 bg-gray-400 text-white rounded"
          onClick={onCancel}
        >
          Cancel
        </button>
      </>
    ) : (
      <>
        <button
          className="px-2 py-1 bg-blue-600 text-white rounded mr-2"
          onClick={onEdit}
        >
          Edit
        </button>
        <button
          className="px-2 py-1 bg-red-600 text-white rounded"
          onClick={onDelete}
        >
          Delete
        </button>
      </>
    )
}