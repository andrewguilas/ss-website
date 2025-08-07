import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, MenuItem } from "@mui/material"
import type { Route } from "../schemas"

interface OrderCreateDialogProps {
  open: boolean
  onClose: () => void
  onCreate: () => void

  newId: number | null; setNewId: (id: number | null) => void; 
  newCampus: string; setNewCampus: (v: string) => void
  newName: string; setNewName: (v: string) => void
  newPhone: string; setNewPhone: (v: string) => void
  newPronunciation: string; setNewPronunciation: (v: string) => void
  newComments: string; setNewComments: (v: string) => void
  newPickupDate: string; setNewPickupDate: (v: string) => void
  newPickupLocation: string; setNewPickupLocation: (v: string) => void
  newPickupProxyName: string; setNewPickupProxyName: (v: string) => void
  newPickupProxyPhone: string; setNewPickupProxyPhone: (v: string) => void
  newDropoffDate: string; setNewDropoffDate: (v: string) => void
  newDropoffLocation: string; setNewDropoffLocation: (v: string) => void
  newDropoffProxyName: string; setNewDropoffProxyName: (v: string) => void
  newDropoffProxyPhone: string; setNewDropoffProxyPhone: (v: string) => void
  newItemCount: number | null; setNewItemCount: (id: number | null) => void; 
  newItems: string; setNewItems: (v: string) => void
  newRouteId: number | null; setNewRouteId: (id: number | null) => void; 
  routes?: Route[] // <-- Add this prop
  mode?: "create" | "edit"
}

export default function OrderCreateDialog({
  open,
  onClose,
  onCreate,
  newId, setNewId,
  newCampus, setNewCampus,
  newName, setNewName,
  newPhone, setNewPhone,
  newPronunciation, setNewPronunciation,
  newComments, setNewComments,
  newPickupDate, setNewPickupDate,
  newPickupLocation, setNewPickupLocation,
  newPickupProxyName, setNewPickupProxyName,
  newPickupProxyPhone, setNewPickupProxyPhone,
  newDropoffDate, setNewDropoffDate,
  newDropoffLocation, setNewDropoffLocation,
  newDropoffProxyName, setNewDropoffProxyName,
  newDropoffProxyPhone, setNewDropoffProxyPhone,
  newItemCount, setNewItemCount,
  newItems, setNewItems,
  newRouteId, setNewRouteId,
  routes = [],
  mode = "create",
}: OrderCreateDialogProps) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{mode === "edit" ? "Edit Order" : "Create Order"}</DialogTitle>
      <DialogContent>
        <TextField margin="dense" label="ID" type="number" fullWidth value={newId ?? ""} onChange={e => setNewId(e.target.value ? Number(e.target.value) : null)} />
        <TextField autoFocus margin="dense" label="Campus" fullWidth value={newCampus} onChange={e => setNewCampus(e.target.value)} />
        <TextField margin="dense" label="Name" fullWidth value={newName} onChange={e => setNewName(e.target.value)} />
        <TextField margin="dense" label="Phone" fullWidth value={newPhone} onChange={e => setNewPhone(e.target.value)} />
        <TextField margin="dense" label="Pronunciation" fullWidth value={newPronunciation} onChange={e => setNewPronunciation(e.target.value)} />
        <TextField margin="dense" label="Comments" fullWidth value={newComments} onChange={e => setNewComments(e.target.value)} />
        <TextField margin="dense" label="Pickup Date" type="date" fullWidth value={newPickupDate} onChange={e => setNewPickupDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField margin="dense" label="Pickup Location" fullWidth value={newPickupLocation} onChange={e => setNewPickupLocation(e.target.value)} />
        <TextField margin="dense" label="Pickup Proxy Name" fullWidth value={newPickupProxyName} onChange={e => setNewPickupProxyName(e.target.value)} />
        <TextField margin="dense" label="Pickup Proxy Phone" fullWidth value={newPickupProxyPhone} onChange={e => setNewPickupProxyPhone(e.target.value)} />
        <TextField margin="dense" label="Dropoff Date" type="date" fullWidth value={newDropoffDate} onChange={e => setNewDropoffDate(e.target.value)} slotProps={{ inputLabel: { shrink: true } }} />
        <TextField margin="dense" label="Dropoff Location" fullWidth value={newDropoffLocation} onChange={e => setNewDropoffLocation(e.target.value)} />
        <TextField margin="dense" label="Dropoff Proxy Name" fullWidth value={newDropoffProxyName} onChange={e => setNewDropoffProxyName(e.target.value)} />
        <TextField margin="dense" label="Dropoff Proxy Phone" fullWidth value={newDropoffProxyPhone} onChange={e => setNewDropoffProxyPhone(e.target.value)} />
        <TextField margin="dense" label="Item Count" type="number" fullWidth value={newItemCount ?? ""} onChange={e => setNewItemCount(e.target.value ? Number(e.target.value) : null)} />
        <TextField margin="dense" label="Items" fullWidth value={newItems} onChange={e => setNewItems(e.target.value)} />
        <TextField
          margin="dense"
          label="Route"
          select
          fullWidth
          value={newRouteId ?? ""}
          onChange={e => setNewRouteId(e.target.value ? Number(e.target.value) : null)}
        >
          <MenuItem value="">None</MenuItem>
          {routes.map(route => (
            <MenuItem key={route.id} value={route.id}>
              {`Route ${route.id} - ${route.date} - Driver ${route.driver_name || "TBD"}`}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} variant="contained">{mode === "edit" ? "Save" : "Create"}</Button>
      </DialogActions>
    </Dialog>
  )
}