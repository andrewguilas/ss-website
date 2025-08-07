import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"

interface TruckCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: () => void

  newModel: string; setNewModel: (v: string) => void
  newComments: string; setNewComments: (v: string) => void

  mode?: "create" | "edit"
}

export default function TruckCreateDialog({
  open,
  onClose,
  onCreate,
  newModel, setNewModel,
  newComments, setNewComments,
  mode = "create",
}: TruckCreateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === "edit" ? "Edit Truck" : "Create Truck"}</DialogTitle>
      <DialogContent>
        <TextField autoFocus margin="dense" label="Model" fullWidth value={newModel} onChange={e => setNewModel(e.target.value)} />
        <TextField margin="dense" label="Comments" multiline fullWidth value={newComments} onChange={e => setNewComments(e.target.value)} />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} variant="contained">
          {mode === "edit" ? "Save" : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  )
}