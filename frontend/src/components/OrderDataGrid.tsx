import { DataGrid } from "@mui/x-data-grid"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import type { GridColDef } from "@mui/x-data-grid"
import { useNavigate } from "react-router-dom"
import type { Order } from "../schemas"

interface OrderDataGridProps {
  orders: Order[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
}

export default function OrderDataGrid({ orders, onEditRow, onDelete, setSnackbar }: OrderDataGridProps) {
  const navigate = useNavigate()

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    // { field: "campus", headerName: "Campus", editable: true},
    { field: "name", headerName: "Name", editable: true},
    { field: "phone", headerName: "Phone", editable: true},
    { field: "pronunciation", headerName: "Pronunciation", editable: true},
    { field: "comments", headerName: "Comments", editable: true},
    { field: "pickup_date", headerName: "Pickup Date", editable: true},
    { field: "pickup_location", headerName: "Pickup Location", editable: true},
    // { field: "pickup_proxy_name", headerName: "Pickup Proxy Name", editable: true},
    // { field: "pickup_proxy_phone", headerName: "Pickup Proxy Phone", editable: true},
    { field: "dropoff_date", headerName: "Dropoff Date", editable: true},
    { field: "dropoff_location", headerName: "Dropoff Location", editable: true},
    // { field: "dropoff_proxy_name", headerName: "Dropoff Proxy Name", editable: true},
    // { field: "dropoff_proxy_phone", headerName: "Dropoff Proxy Phone", editable: true},
    { field: "item_count", headerName: "Item Count", editable: true},
    { field: "items", headerName: "Items", editable: true},
    { field: "route_id", headerName: "RouteId", editable: true},

    {
      field: "actions",
      headerName: "Actions",
      width: 140,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => navigate(`/orders/${params.row.id}`)}
            title="Open"
          ><OpenInNewIcon /></IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(params.row.id)}
            title="Delete"
          ><DeleteIcon /></IconButton>
        </Box>
      ),
    },
  ]

  return (
    <DataGrid
      rows={orders}
      columns={columns}
      checkboxSelection
      disableRowSelectionOnClick
      editMode="row"
      processRowUpdate={async (newRow) => {
        await onEditRow(newRow)
        return newRow
      }}
      onProcessRowUpdateError={(err) =>
        setSnackbar({ open: true, message: `Edit failed: ${err}`, severity: "error" })
      }
      showToolbar
    />
  )
}