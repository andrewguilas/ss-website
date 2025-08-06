import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataGrid } from "@mui/x-data-grid"
import type { GridColDef } from "@mui/x-data-grid"
import { IconButton, Box, CircularProgress, Alert } from "@mui/material"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"

interface Truck {
  id: number
  model: string | null
  comments: string | null
}

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [editRowsModel, setEditRowsModel] = useState({})
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:8000/trucks")
      .then(res => res.json())
      .then(data => setTrucks(data))
      .catch(err => {
        setError("Failed to fetch trucks.")
        console.error(err)
      })
      .finally(() => setLoading(false))
  }, [])

  const handleEditRow = async (params: any) => {
    const { id, model, comments } = params
    try {
      const res = await fetch(`http://localhost:8000/trucks`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, model, comments }),
      })
      if (!res.ok) throw new Error("Failed to update truck")
      const updated = await res.json()
      setTrucks(trucks => trucks.map(t => (t.id === id ? updated : t)))
    } catch (err) {
      alert(`Update failed: ${err}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete truck ${id}?`)) return
    try {
      const res = await fetch(`http://localhost:8000/trucks/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Delete failed")
      }
      setTrucks(trucks => trucks.filter(t => t.id !== id))
    } catch (err: any) {
      alert(`Delete failed: ${err.message || err.toString()}`)
    }
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "model", headerName: "Model", flex: 1, editable: true },
    { field: "comments", headerName: "Comments", flex: 2, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/trucks/${params.row.id}`)}
            title="Open"
          >
            <OpenInNewIcon />
          </IconButton>
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/trucks/create?id=${params.row.id}`)}
            title="Edit"
          >
            <EditIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ]

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h1 className="text-2xl font-semibold">Trucks</h1>
        <button
          className="px-4 py-2 bg-green-600 text-white rounded"
          onClick={() => navigate("/trucks/create")}
        >
          Create Truck
        </button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <DataGrid
          rows={trucks}
          columns={columns}
          checkboxSelection
          disableRowSelectionOnClick
          editMode="row"
          processRowUpdate={async (newRow) => {
            await handleEditRow(newRow)
            return newRow
          }}
          onProcessRowUpdateError={(err) => alert(`Edit failed: ${err}`)}
          showToolbar
        />
      )}
    </Box>
  )
}
