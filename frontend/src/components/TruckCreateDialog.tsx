import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material"

interface RouteCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: () => void
  newModel: string
  setNewModel: (v: string) => void
  newComments: string
  setNewComments: (v: string) => void
}

export default function RouteCreateDialog({
  open,
  onClose,
  onCreate,
  newModel,
  setNewModel,
  newComments,
  setNewComments,
}: RouteCreateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Route</DialogTitle>
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
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} variant="contained" disabled={!newModel}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  )
}