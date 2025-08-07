import { useEffect, useState } from "react"
import { Box, CircularProgress, Alert, Button, Snackbar } from "@mui/material"
import RouteDataGrid from "../components/RouteDataGrid"
import RouteCreateDialog from "../components/RouteCreateDialog"
import type { Route, Truck } from "../schemas"

export default function Routes() {
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [editRoute, setEditRoute] = useState<Route | null>(null)
  const [editDate, setEditDate] = useState("")
  const [editDriverName, setEditDriverName] = useState("")
  const [editComments, setEditComments] = useState("")
  const [editTruckId, setEditTruckId] = useState<number | null>(null)

  const [newDate, setNewDate] = useState("")
  const [newDriverName, setNewDriverName] = useState("")
  const [newComments, setNewComments] = useState("")
  const [newTruckId, setNewTruckId] = useState<number | null>(null)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" })
  const [trucks, setTrucks] = useState<Truck[]>([])

  useEffect(() => {
    fetch("http://localhost:8000/routes")
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => {
        setError("Failed to fetch routes.")
        console.log(`Failed to fetch route: ${err}`)
      })
      .finally(() => setLoading(false))

    // Fetch trucks for the select field
    fetch("http://localhost:8000/trucks")
      .then(res => res.json())
      .then(data => setTrucks(data))
      .catch(err => {
        // Optionally handle truck fetch error
      })
  }, [])

  const handleEditRow = async (params: any) => {
    const { id, date, driver_name, comments, truck_id } = params
    try {
      const res = await fetch(`http://localhost:8000/routes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, date, driver_name, comments, truck_id }),
      })
      if (!res.ok) throw new Error("Failed to update route")
      const updated = await res.json()
      setRoutes(routes => routes.map(t => (t.id === id ? updated : t)))
      setSnackbar({ open: true, message: "Route updated!", severity: "success" })
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" })
      console.log(`Failed to edit row: ${err}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete route ${id}?`)) return
    try {
      const res = await fetch(`http://localhost:8000/routes/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Delete failed")
      }
      setRoutes(routes => routes.filter(t => t.id !== id))
      setSnackbar({ open: true, message: "Route deleted!", severity: "success" })
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Delete failed", severity: "error" })
      console.log(`Failed to delete row: ${err}`)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:8000/routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newDate, driver_name: newDriverName, comments: newComments, truck_id: newTruckId }),
      })
      if (!res.ok) {
        const err = await res.json()
        if (err.detail) {
          if (Array.isArray(err.detail)) {
            throw new Error(`"Failed to create route: ${err.detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ")}`)
          } else if (typeof err.detail === "string") {
            throw new Error(`"Failed to create route: ${err.detail}`)
          } else if (typeof err.detail === "object") {
            throw new Error(`"Failed to create route: ${JSON.stringify(err.detail)}`)
          }
        }
        throw new Error("Failed to create route")
      }
      const created = await res.json()
      setRoutes(routes => [...routes, created])
      setSnackbar({ open: true, message: "Route created!", severity: "success" })
      setCreateOpen(false)

      setNewDate("")
      setNewDriverName("")
      setNewComments("")
      setNewTruckId(null)
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Create failed", severity: "error" })
      console.log(`Failed to create row: ${err}`)
    }
  }

  // --- Add these for edit dialog ---
  const openEditDialog = (route: Route) => {
    setEditRoute(route)
    setEditDate(route.date || "")
    setEditDriverName(route.driver_name || "")
    setEditComments(route.comments || "")
    setEditTruckId(route.truck_id ?? null)
    setEditOpen(true)
  }

  const handleEditDialogSave = async () => {
    if (!editRoute) return
    try {
      const res = await fetch(`http://localhost:8000/routes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editRoute.id,
          date: editDate,
          driver_name: editDriverName,
          comments: editComments,
          truck_id: editTruckId,
        }),
      })
      if (!res.ok) throw new Error("Failed to update route")
      const updated = await res.json()
      setRoutes(routes => routes.map(t => (t.id === editRoute.id ? updated : t)))
      setSnackbar({ open: true, message: "Route updated!", severity: "success" })
      setEditOpen(false)
      setEditRoute(null)
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" })
    }
  }
  // --- end edit dialog logic ---

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h1 className="text-2xl font-semibold">Routes</h1>
        <Button variant="contained" color="success" onClick={() => setCreateOpen(true)}>Create Route</Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <RouteDataGrid
          routes={routes}
          onEditRow={handleEditRow}
          onDelete={handleDelete}
          setSnackbar={setSnackbar}
          onEditDialog={openEditDialog} // <-- pass this prop
        />
      )}

      <RouteCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        newDate={newDate} setNewDate={setNewDate}
        newDriverName={newDriverName} setNewDriverName={setNewDriverName}
        newComments={newComments} setNewComments={setNewComments}
        newTruckId={newTruckId} setNewTruckId={setNewTruckId}
        trucks={trucks} // <-- Pass trucks here
        mode="create" // <-- add this line
      />

      {/* Edit Dialog */}
      <RouteCreateDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onCreate={handleEditDialogSave}
        newDate={editDate} setNewDate={setEditDate}
        newDriverName={editDriverName} setNewDriverName={setEditDriverName}
        newComments={editComments} setNewComments={setEditComments}
        newTruckId={editTruckId} setNewTruckId={setEditTruckId}
        trucks={trucks} // <-- Pass trucks here
        mode="edit" // <-- add this line
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