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
      <DialogContent>
        <TextField
          margin="dense"
          label="ID"
          fullWidth
          value={truck?.id ?? ""}
          InputProps={{ readOnly: true }}
          variant="filled"
        />
        <TextField
          margin="dense"
          label="Model"
          fullWidth
          value={truck?.model ?? ""}
          InputProps={{ readOnly: true }}
          variant="filled"
        />
        <TextField
          margin="dense"
          label="Comments"
          fullWidth
          value={truck?.comments ?? ""}
          InputProps={{ readOnly: true }}
          variant="filled"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">Close</Button>
      </DialogActions>
    </Dialog>
  )
}