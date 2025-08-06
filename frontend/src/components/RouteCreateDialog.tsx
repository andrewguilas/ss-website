import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"

interface RouteCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: () => void

  newDate: string
  setNewDate: (v: string) => void
  
  newDriverName: string
  setNewDriverName: (v: string) => void
  
  newComments: string
  setNewComments: (v: string) => void
  
  newTruckId: number | null;
  setNewTruckId: (id: number | null) => void; 
}

export default function RouteCreateDialog({
  open,
  onClose,
  onCreate,
  
  newDate,
  setNewDate,

  newDriverName,
  setNewDriverName,

  newComments,
  setNewComments,

  newTruckId,
  setNewTruckId,
}: RouteCreateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Route</DialogTitle>
      <DialogContent>

      <TextField
        autoFocus
        margin="dense"
        label="Date"
        type="date"
        fullWidth
        value={newDate}
        onChange={e => setNewDate(e.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
      />
      
        <TextField
          margin="dense"
          label="DriverName"
          fullWidth
          value={newDriverName}
          onChange={e => setNewDriverName(e.target.value)}
        />
      
        <TextField
          margin="dense"
          label="Comments"
          fullWidth
          value={newComments}
          onChange={e => setNewComments(e.target.value)}
        />
      
        <TextField
          margin="dense"
          label="TruckId"
          type="number"
          fullWidth
          value={newTruckId ?? ""}
          onChange={e => setNewTruckId(e.target.value ? Number(e.target.value) : null)}
        />

      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}