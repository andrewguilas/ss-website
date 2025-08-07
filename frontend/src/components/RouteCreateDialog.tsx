import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"

interface RouteCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: () => void

  newDate: string; setNewDate: (v: string) => void
  newDriverName: string; setNewDriverName: (v: string) => void
  newComments: string; setNewComments: (v: string) => void
  newTruckId: number | null; setNewTruckId: (id: number | null) => void
  mode?: "create" | "edit"
}
export default function RouteCreateDialog({
  open,
  onClose,
  onCreate,
  newDate, setNewDate,
  newDriverName, setNewDriverName,
  newComments, setNewComments,
  newTruckId, setNewTruckId,
  mode = "create",
}: RouteCreateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === "edit" ? "Edit Route" : "Create Route"}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Date" type="date" required disabled={mode === "edit"} fullWidth value={newDate} onChange={e => setNewDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField margin="dense" label="Driver Name" fullWidth value={newDriverName} onChange={e => setNewDriverName(e.target.value)} />
        <TextField margin="dense" label="Comments" multiline fullWidth value={newComments} onChange={e => setNewComments(e.target.value)} />
        <TextField margin="dense" label="Truck ID" type="number" fullWidth value={newTruckId ?? ""} onChange={e => setNewTruckId(e.target.value ? Number(e.target.value) : null)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} variant="contained">{mode === "edit" ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  )
}