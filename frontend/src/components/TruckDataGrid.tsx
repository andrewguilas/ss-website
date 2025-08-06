import { DataGrid, GridToolbar } from "@mui/x-data-grid"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import OpenInNewIcon from "@mui/icons-material/OpenInNew"
import type { GridColDef } from "@mui/x-data-grid"
import { useNavigate } from "react-router-dom"

interface Truck {
  id: number
  model: string | null
  comments: string | null
}

interface TruckDataGridProps {
  trucks: Truck[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
}

export default function TruckDataGrid({ trucks, onEditRow, onDelete, setSnackbar }: TruckDataGridProps) {
  const navigate = useNavigate()

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "model", headerName: "Model", flex: 1, editable: true },
    { field: "comments", headerName: "Comments", flex: 2, editable: true },
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
            onClick={() => navigate(`/trucks/${params.row.id}`)}
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
      rows={trucks}
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
      slots={{ toolbar: GridToolbar }}
    />
  )
}