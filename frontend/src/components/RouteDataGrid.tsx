import { DataGrid } from "@mui/x-data-grid"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import type { GridColDef } from "@mui/x-data-grid"
import type { Route } from "../schemas"

interface RouteDataGridProps {
  routes: Route[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
  onEditDialog: (route: Route) => void // <-- Add this prop
}

export default function RouteDataGrid({ routes, onEditRow, onDelete, setSnackbar, onEditDialog }: RouteDataGridProps) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Date", flex: 1},
    { field: "driver_name", headerName: "Driver Name", flex: 1, editable: true },
    { field: "comments", headerName: "Comments", flex: 2, editable: true },
    { field: "truck_id", headerName: "Truck ID", flex: 1, editable: true },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
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
    <DataGrid
      rows={routes}
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