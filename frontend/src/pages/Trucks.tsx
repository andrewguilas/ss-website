import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { DataGrid } from "@mui/x-data-grid"
import type { GridColDef } from "@mui/x-data-grid"
import { IconButton, Box, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Snackbar } from "@mui/material"
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
  const [createOpen, setCreateOpen] = useState(false)
  const [newModel, setNewModel] = useState("")
  const [newComments, setNewComments] = useState("")
  const [snackbar, setSnackbar] = useState<{open: boolean, message: string, severity: "success"|"error"}>({open: false, message: "", severity: "success"})
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
      setSnackbar({open: true, message: "Truck updated!", severity: "success"})
    } catch (err) {
      setSnackbar({open: true, message: "Update failed", severity: "error"})
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
      setSnackbar({open: true, message: "Truck deleted!", severity: "success"})
    } catch (err: any) {
      setSnackbar({open: true, message: err.message || "Delete failed", severity: "error"})
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:8000/trucks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: newModel, comments: newComments }),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Failed to create truck")
      }
      const created = await res.json()
      setTrucks(trucks => [...trucks, created])
      setSnackbar({open: true, message: "Truck created!", severity: "success"})
      setCreateOpen(false)
      setNewModel("")
      setNewComments("")
    } catch (err: any) {
      setSnackbar({open: true, message: err.message || "Create failed", severity: "error"})
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
        <Button
          variant="contained"
          color="success"
          onClick={() => setCreateOpen(true)}
        >
          Create Truck
        </Button>
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
          onProcessRowUpdateError={(err) => setSnackbar({open: true, message: `Edit failed: ${err}`, severity: "error"})}
          showToolbar
        />
      )}

      {/* Create Truck Dialog */}
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>Create Truck</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Model"
            fullWidth
            value={newModel}
            onChange={e => setNewModel(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Comments"
            fullWidth
            value={newComments}
            onChange={e => setNewComments(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateOpen(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained" disabled={!newModel}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar(s => ({ ...s, open: false }))}
        message={snackbar.message}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </Box>
  )
}