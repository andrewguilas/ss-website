import { useEffect, useState } from "react"
import { Box, CircularProgress, Alert, Button, Snackbar } from "@mui/material"
import TruckDataGrid from "../components/TruckDataGrid"
import TruckCreateDialog from "../components/TruckCreateDialog"
import type { Truck } from "../schemas"

export default function Trucks() {
  const [trucks, setTrucks] = useState<Truck[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  
  const [newModel, setNewModel] = useState("")
  const [newComments, setNewComments] = useState("")

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" })

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
      setSnackbar({ open: true, message: "Truck updated!", severity: "success" })
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" })
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
      setSnackbar({ open: true, message: "Truck deleted!", severity: "success" })
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Delete failed", severity: "error" })
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
      setSnackbar({ open: true, message: "Truck created!", severity: "success" })
      setCreateOpen(false)
      setNewModel("")
      setNewComments("")
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Create failed", severity: "error" })
    }
  }

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
        <TruckDataGrid
          trucks={trucks}
          onEditRow={handleEditRow}
          onDelete={handleDelete}
          setSnackbar={setSnackbar}
        />
      )}

      <TruckCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        newModel={newModel}
        setNewModel={setNewModel}
        newComments={newComments}
        setNewComments={setNewComments}
      />

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