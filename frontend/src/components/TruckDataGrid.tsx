import { DataGrid } from "@mui/x-data-grid"
import { Box, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import type { GridColDef } from "@mui/x-data-grid"
import type { Truck } from "../schemas"

interface TruckDataGridProps {
  trucks: Truck[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
  onEditDialog: (truck: Truck) => void
}

function renderWrappedCell(params: any) {
  return (
    <div
      style={{
        whiteSpace: "pre-wrap",
        wordBreak: "break-word",
        lineHeight: 1.4,
        minHeight: 40,
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        paddingTop: 4,
        paddingBottom: 4,
      }}
    >
      {params.value}
    </div>
  )
}

export default function TruckDataGrid({ trucks, onEditRow, onDelete, setSnackbar, onEditDialog }: TruckDataGridProps) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 60, flex: 0 },
    { field: "model", headerName: "Model", minWidth: 120, flex: 1, editable: true },
    { field: "comments", headerName: "Comments", minWidth: 180, flex: 2, editable: true, renderCell: renderWrappedCell, cellClassName: "wrap-cell"},
    {
      field: "actions",
      headerName: "Actions",
      minWidth: 120,
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
            width: 100%;
            height: 100%;
          }
        `}
      </style>
      <DataGrid
        rows={trucks}
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