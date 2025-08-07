import { useEffect, useState } from "react"
import { Box, CircularProgress, Alert, Button, Snackbar } from "@mui/material"
import OrderDataGrid from "../components/OrderDataGrid"
import OrderCreateDialog from "../components/OrderCreateDialog"
import type { Order, Route } from "../schemas"

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [routes, setRoutes] = useState<Route[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [createOpen, setCreateOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  
  const [newId, setNewId] = useState<number | null>(null)
  const [newCampus, setNewCampus] = useState("")
  const [newName, setNewName] = useState("")
  const [newPhone, setNewPhone] = useState("")
  const [newPronunciation, setNewPronunciation] = useState("")
  const [newComments, setNewComments] = useState("")
  const [newPickupDate, setNewPickupDate] = useState("")
  const [newPickupLocation, setNewPickupLocation] = useState("")
  const [newPickupProxyName, setNewPickupProxyName] = useState("")
  const [newPickupProxyPhone, setNewPickupProxyPhone] = useState("")
  const [newDropoffDate, setNewDropoffDate] = useState("")
  const [newDropoffLocation, setNewDropoffLocation] = useState("")
  const [newDropoffProxyName, setNewDropoffProxyName] = useState("")
  const [newDropoffProxyPhone, setNewDropoffProxyPhone] = useState("")
  const [newItemCount, setNewItemCount] = useState<number | null>(null)
  const [newItems, setNewItems] = useState("")
  const [newRouteId, setNewRouteId] = useState<number | null>(null)
  const [newOrderInRoute, setNewOrderInRoute] = useState<number | null>(null)

  const [editOrder, setEditOrder] = useState<Order | null>(null)
  const [editId, setEditId] = useState<number | null>(null)
  const [editCampus, setEditCampus] = useState("")
  const [editName, setEditName] = useState("")
  const [editPhone, setEditPhone] = useState("")
  const [editPronunciation, setEditPronunciation] = useState("")
  const [editComments, setEditComments] = useState("")
  const [editPickupDate, setEditPickupDate] = useState("")
  const [editPickupLocation, setEditPickupLocation] = useState("")
  const [editPickupProxyName, setEditPickupProxyName] = useState("")
  const [editPickupProxyPhone, setEditPickupProxyPhone] = useState("")
  const [editDropoffDate, setEditDropoffDate] = useState("")
  const [editDropoffLocation, setEditDropoffLocation] = useState("")
  const [editDropoffProxyName, setEditDropoffProxyName] = useState("")
  const [editDropoffProxyPhone, setEditDropoffProxyPhone] = useState("")
  const [editItemCount, setEditItemCount] = useState<number | null>(null)
  const [editItems, setEditItems] = useState("")
  const [editRouteId, setEditRouteId] = useState<number | null>(null)
  const [editOrderInRoute, setEditOrderInRoute] = useState<number | null>(null)

  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: "success" | "error" }>({ open: false, message: "", severity: "success" })

  useEffect(() => {
    fetch("http://localhost:8000/orders")
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => {
        setError("Failed to fetch orders.")
        console.log(`Failed to fetch order: ${err}`)
      })
      .finally(() => setLoading(false))

    fetch("http://localhost:8000/routes")
      .then(res => res.json())
      .then(data => setRoutes(data))
      .catch(err => {
        setError("Failed to fetch routes.")
        console.log(`Failed to fetch route: ${err}`)
      })
  }, [])

  const handleEditRow = async (params: any) => {
    const { id, campus, name, phone, pronunciation, comments, pickup_date, pickup_location, pickup_proxy_name, pickup_proxy_phone, dropoff_date, dropoff_location, dropoff_proxy_name, dropoff_proxy_phone, item_count, items, route_id } = params
    try {
      const res = await fetch(`http://localhost:8000/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, campus, name, phone, pronunciation, comments, pickup_date, pickup_location, pickup_proxy_name, pickup_proxy_phone, dropoff_date, dropoff_location, dropoff_proxy_name, dropoff_proxy_phone, item_count, items, route_id }),
      })
      if (!res.ok) throw new Error("Failed to update order")
      const updated = await res.json()
      setOrders(orders => orders.map(t => (t.id === id ? updated : t)))
      setSnackbar({ open: true, message: "Order updated!", severity: "success" })
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" })
      console.log(`Failed to edit row: ${err}`)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm(`Are you sure you want to delete order ${id}?`)) return
    try {
      const res = await fetch(`http://localhost:8000/orders/${id}`, { method: "DELETE" })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || "Delete failed")
      }
      setOrders(orders => orders.filter(t => t.id !== id))
      setSnackbar({ open: true, message: "Order deleted!", severity: "success" })
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Delete failed", severity: "error" })
      console.log(`Failed to delete row: ${err}`)
    }
  }

  const handleCreate = async () => {
    try {
      const res = await fetch("http://localhost:8000/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          id: newId,
          campus: newCampus,
          name: newName,
          phone: newPhone,
          pronunciation: newPronunciation,
          comments: newComments,
          pickup_date: newPickupDate || null,
          pickup_location: newPickupLocation,
          pickup_proxy_name: newPickupProxyName,
          pickup_proxy_phone: newPickupProxyPhone,
          dropoff_date: newDropoffDate || null,
          dropoff_location: newDropoffLocation,
          dropoff_proxy_name: newDropoffProxyName,
          dropoff_proxy_phone: newDropoffProxyPhone,
          item_count: newItemCount,
          items: newItems,
          route_id: newRouteId,
          order_in_route: newOrderInRoute
        })
      })
      if (!res.ok) {
        const err = await res.json()
        if (err.detail) {
          if (Array.isArray(err.detail)) {
            throw new Error(`"Failed to create order: ${err.detail.map((d: any) => d.msg || JSON.stringify(d)).join("; ")}`)
          } else if (typeof err.detail === "string") {
            throw new Error(`"Failed to create order: ${err.detail}`)
          } else if (typeof err.detail === "object") {
            throw new Error(`"Failed to create order: ${JSON.stringify(err.detail)}`)
          }
        }
        throw new Error("Failed to create order")
      }
      const created = await res.json()
      setOrders(orders => [...orders, created])
      setSnackbar({ open: true, message: "Order created!", severity: "success" })
      setCreateOpen(false)

      setNewId(null)
      setNewCampus("")
      setNewName("")
      setNewPhone("")
      setNewPronunciation("")
      setNewComments("")
      setNewPickupDate("")
      setNewPickupLocation("")
      setNewPickupProxyName("")
      setNewPickupProxyPhone("")
      setNewDropoffDate("")
      setNewDropoffLocation("")
      setNewDropoffProxyName("")
      setNewDropoffProxyPhone("")
      setNewItemCount(null)
      setNewItems("")
      setNewRouteId(null)
      setNewOrderInRoute(null)
    } catch (err: any) {
      setSnackbar({ open: true, message: err.message || "Create failed", severity: "error" })
      console.log(`Failed to create row: ${err}`)
    }
  }

  const openEditDialog = (order: Order) => {
    setEditOrder(order)
    setEditId(order.id ?? null)
    setEditCampus(order.campus ?? "")
    setEditName(order.name ?? "")
    setEditPhone(order.phone ?? "")
    setEditPronunciation(order.pronunciation ?? "")
    setEditComments(order.comments ?? "")
    setEditPickupDate(order.pickup_date ?? "")
    setEditPickupLocation(order.pickup_location ?? "")
    setEditPickupProxyName(order.pickup_proxy_name ?? "")
    setEditPickupProxyPhone(order.pickup_proxy_phone ?? "")
    setEditDropoffDate(order.dropoff_date ?? "")
    setEditDropoffLocation(order.dropoff_location ?? "")
    setEditDropoffProxyName(order.dropoff_proxy_name ?? "")
    setEditDropoffProxyPhone(order.dropoff_proxy_phone ?? "")
    setEditItemCount(order.item_count ?? null)
    setEditItems(order.items ?? "")
    setEditRouteId(order.route_id ?? null)
    setEditOrderInRoute(order.order_in_route ?? null)
    setEditOpen(true)
  }

  const handleEditDialogSave = async () => {
    if (!editOrder) return
    try {
      const res = await fetch(`http://localhost:8000/orders`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editId,
          campus: editCampus,
          name: editName,
          phone: editPhone,
          pronunciation: editPronunciation,
          comments: editComments,
          pickup_date: editPickupDate || null,
          pickup_location: editPickupLocation,
          pickup_proxy_name: editPickupProxyName,
          pickup_proxy_phone: editPickupProxyPhone,
          dropoff_date: editDropoffDate || null,
          dropoff_location: editDropoffLocation,
          dropoff_proxy_name: editDropoffProxyName,
          dropoff_proxy_phone: editDropoffProxyPhone,
          item_count: editItemCount,
          items: editItems,
          route_id: editRouteId,
          order_in_route: editOrderInRoute
        }),
      })
      if (!res.ok) throw new Error("Failed to update order")
      const updated = await res.json()
      setOrders(orders => orders.map(t => (t.id === editOrder.id ? updated : t)))
      setSnackbar({ open: true, message: "Order updated!", severity: "success" })
      setEditOpen(false)
      setEditOrder(null)
    } catch (err) {
      setSnackbar({ open: true, message: "Update failed", severity: "error" })
    }
  }

  return (
    <Box sx={{ height: 600, width: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <h1 className="text-2xl font-semibold">Orders</h1>
        <Button variant="contained" color="success" onClick={() => setCreateOpen(true)}>Create Order</Button>
      </Box>
      {error && <Alert severity="error">{error}</Alert>}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <OrderDataGrid
          orders={orders}
          onEditRow={handleEditRow}
          onDelete={handleDelete}
          setSnackbar={setSnackbar}
          onEditDialog={openEditDialog}
          routes={routes}
        />
      )}

      <OrderCreateDialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
        
        newId={newId} setNewId={setNewId}
        newCampus={newCampus} setNewCampus={setNewCampus}
        newName={newName} setNewName={setNewName}
        newPhone={newPhone} setNewPhone={setNewPhone}
        newPronunciation={newPronunciation} setNewPronunciation={setNewPronunciation}
        newComments={newComments} setNewComments={setNewComments}
        newPickupDate={newPickupDate} setNewPickupDate={setNewPickupDate}
        newPickupLocation={newPickupLocation} setNewPickupLocation={setNewPickupLocation}
        newPickupProxyName={newPickupProxyName} setNewPickupProxyName={setNewPickupProxyName}
        newPickupProxyPhone={newPickupProxyPhone} setNewPickupProxyPhone={setNewPickupProxyPhone}
        newDropoffDate={newDropoffDate} setNewDropoffDate={setNewDropoffDate}
        newDropoffLocation={newDropoffLocation} setNewDropoffLocation={setNewDropoffLocation}
        newDropoffProxyName={newDropoffProxyName} setNewDropoffProxyName={setNewDropoffProxyName}
        newDropoffProxyPhone={newDropoffProxyPhone} setNewDropoffProxyPhone={setNewDropoffProxyPhone}
        newItemCount={newItemCount} setNewItemCount={setNewItemCount}
        newItems={newItems} setNewItems={setNewItems}
        newRouteId={newRouteId} setNewRouteId={setNewRouteId}
        newOrderInRoute={newOrderInRoute} setNewOrderInRoute={setNewOrderInRoute}

        routes={routes}
        mode="create"
      />

      {/* Edit Dialog */}
      <OrderCreateDialog
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onCreate={handleEditDialogSave}
        
        newId={editId} setNewId={setEditId}
        newCampus={editCampus} setNewCampus={setEditCampus}
        newName={editName} setNewName={setEditName}
        newPhone={editPhone} setNewPhone={setEditPhone}
        newPronunciation={editPronunciation} setNewPronunciation={setEditPronunciation}
        newComments={editComments} setNewComments={setEditComments}
        newPickupDate={editPickupDate} setNewPickupDate={setEditPickupDate}
        newPickupLocation={editPickupLocation} setNewPickupLocation={setEditPickupLocation}
        newPickupProxyName={editPickupProxyName} setNewPickupProxyName={setEditPickupProxyName}
        newPickupProxyPhone={editPickupProxyPhone} setNewPickupProxyPhone={setEditPickupProxyPhone}
        newDropoffDate={editDropoffDate} setNewDropoffDate={setEditDropoffDate}
        newDropoffLocation={editDropoffLocation} setNewDropoffLocation={setEditDropoffLocation}
        newDropoffProxyName={editDropoffProxyName} setNewDropoffProxyName={setEditDropoffProxyName}
        newDropoffProxyPhone={editDropoffProxyPhone} setNewDropoffProxyPhone={setEditDropoffProxyPhone}
        newItemCount={editItemCount} setNewItemCount={setEditItemCount}
        newItems={editItems} setNewItems={setEditItems}
        newRouteId={editRouteId} setNewRouteId={setEditRouteId}
        newOrderInRoute={editOrderInRoute} setNewOrderInRoute={setEditOrderInRoute}

        routes={routes}
        mode="edit"
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