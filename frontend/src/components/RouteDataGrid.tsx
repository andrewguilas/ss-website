import { DataGrid } from "@mui/x-data-grid"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import type { GridColDef } from "@mui/x-data-grid"
import { useNavigate } from "react-router-dom"
import type { Route } from "../schemas"

interface RouteDataGridProps {
  routes: Route[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
}

export default function RouteDataGrid({ routes, onEditRow, onDelete, setSnackbar }: RouteDataGridProps) {
  const navigate = useNavigate()

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "date", headerName: "Date", flex: 1 },
    { field: "driver_name", headerName: "DriverName", flex: 1, editable: true },
    { field: "comments", headerName: "Comments", flex: 2, editable: true },
    { field: "truck_id", headerName: "TruckId", flex: 1, editable: true },
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
            onClick={() => navigate(`/routes/${params.row.id}`)}
            title="Open"
          >
            <OpenInNewIcon />
          </IconButton>
          <IconButton
            color="error"
            size="small"
            onClick={() => onDelete(params.row.id)}
            title="Delete"
          >
            <DeleteIcon />
          </IconButton>
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