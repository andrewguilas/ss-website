import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"
import type { Truck } from "../schemas"

interface TruckViewDialogProps {
  open: boolean
  onClose: () => void
  truck: Truck | null
}

export default function TruckViewDialog({ open, onClose, truck }: TruckViewDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Truck Info</DialogTitle>
      <DialogContent dividers>
        <TextField
          margin="dense"
          label="ID"
          fullWidth
          value={truck?.id ?? ""}
        />
        <TextField
          margin="dense"
          label="Model"
          fullWidth
          value={truck?.model ?? ""}
        />
        <TextField
          margin="dense"
          label="Comments"
          fullWidth
          value={truck?.comments ?? ""}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  )
}