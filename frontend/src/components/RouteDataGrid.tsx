import { DataGrid } from "@mui/x-data-grid"
import { Box, IconButton, MenuItem, Select } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import EditIcon from "@mui/icons-material/Edit"
import type { GridColDef } from "@mui/x-data-grid"
import type { Route, Truck } from "../schemas"

interface RouteDataGridProps {
  routes: Route[]
  onEditRow: (params: any) => Promise<void>
  onDelete: (id: number) => void
  setSnackbar: (snackbar: { open: boolean; message: string; severity: "success" | "error" }) => void
  onEditDialog: (route: Route) => void
  trucks?: Truck[] // <-- Add this prop
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

export default function RouteDataGrid({ routes, onEditRow, onDelete, setSnackbar, onEditDialog, trucks = [] }: RouteDataGridProps) {
  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", minWidth: 60, flex: 0 },
    { field: "date", headerName: "Date", minWidth: 120, flex: 1 },
    { field: "driver_name", headerName: "Driver Name", minWidth: 180, flex: 1, editable: true },
    {
      field: "comments",
      headerName: "Comments",
      minWidth: 120,
      flex: 2,
      editable: true,
      renderCell: renderWrappedCell,
      cellClassName: "wrap-cell",
    },
    {
      field: "truck_id",
      headerName: "Truck ID",
      minWidth: 180,
      flex: 1,
      editable: true,
      type: "singleSelect",
      valueOptions: trucks.map(truck => ({
        value: truck.id,
        label: `Truck ${truck.id} - Model ${truck.model || "TBD"}`,
      })),
      renderEditCell: (params) => (
        <Select
          value={params.value ?? ""}
          onChange={e => params.api.setEditCellValue({ id: params.id, field: params.field, value: e.target.value === "" ? null : Number(e.target.value) })}
          fullWidth
          displayEmpty
        >
          <MenuItem value="">None</MenuItem>
          {trucks.map(truck => (
            <MenuItem key={truck.id} value={truck.id}>
              {`Truck ${truck.id} - ${truck.model || "TBD"}`}
            </MenuItem>
          ))}
        </Select>
      ),
    },
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
          }
        `}
      </style>
      <DataGrid
        rows={routes}
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
        getRowHeight={() => 'auto'}
      />
    </div>
  )
}