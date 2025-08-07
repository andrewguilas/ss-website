import { DataGrid } from "@mui/x-data-grid"
import { Box, IconButton, MenuItem, Select } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import type { GridColDef } from "@mui/x-data-grid"
import type { Order, Route } from "../schemas"

interface OrderDataGridProps {
  orders: Order[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
  onEditDialog: (order: Order) => void
  routes?: Route[]
}

function renderWrappedCell(params: any) {
  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.4,
        minHeight: 40,
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      {params.value}
    </div>
  )
}

export default function OrderDataGrid({ orders, onEditRow, onDelete, setSnackbar, onEditDialog, routes = [] }: OrderDataGridProps) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 60, flex: 0 },
    { field: "name", headerName: "Name", minWidth: 180, flex: 1, editable: true },
    { field: "phone", headerName: "Phone", minWidth: 120, flex: 1, editable: true },
    { field: "pronunciation", headerName: "Pronunciation", minWidth: 180, flex: 1, editable: true },
    { field: "comments", headerName: "Comments", minWidth: 180, flex: 2, editable: true, renderCell: renderWrappedCell, cellClassName: "wrap-cell"},
    // { field: "pickup_date", headerName: "Pickup Date", minWidth: 120, flex: 1, editable: true },
    // { field: "pickup_location", headerName: "Pickup Location", minWidth: 180, flex: 1, editable: true },
    { field: "dropoff_date", headerName: "Dropoff Date", minWidth: 120, flex: 1, editable: true },
    { field: "dropoff_location", headerName: "Dropoff Location", minWidth: 180, flex: 1, editable: true },
    { field: "item_count", headerName: "Item Count", minWidth: 60, flex: 0, editable: true, type: "number"},
    { field: "items", headerName: "Items", minWidth: 180, flex: 2, editable: true, renderCell: renderWrappedCell, cellClassName: "wrap-cell"},
    {
      field: "route_id",
      headerName: "Route ID",
      minWidth: 180,
      flex: 0,
      editable: true,
      type: "singleSelect",
      valueOptions: routes.map(route => ({
        value: route.id,
        label: `${route.id} - ${route.date} - Driver ${route.driver_name || "TBD"}`,
      })),
      renderEditCell: (params) => (
        <Select
          value={params.value ?? ""}
          onChange={e => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value === "" ? null : Number(e.target.value) })}
          fullWidth
          displayEmpty
        >
          <MenuItem value="">None</MenuItem>
          {routes.map(route => (
            <MenuItem key={route.id} value={route.id}>
              {`Route ${route.id} - ${route.date}${route.driver_name ? ` - ${route.driver_name}` : ""}`}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 180,
      flex: 0,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            size="small"
            onClick={() => onEditDialog(params.row)}
            title="Edit"
          ><EditIcon /></IconButton>
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
    <div style={{ width: "100%" }}>
      <style>
        {`
          .wrap-cell {
            white-space: pre-wrap !important;
            word-break: break-word !important;
            line-height: 1.4;
            align-items: flex-start !important;
            display: flex;
            min-height: 40px;
            padding-top: 4px;
            padding-bottom: 4px;
          }
        `}
      </style>
      <DataGrid
        rows={orders}
        columns={columns}
        autoHeight
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
        getRowHeight={() => "auto"}
      />
    </div>
  )
}