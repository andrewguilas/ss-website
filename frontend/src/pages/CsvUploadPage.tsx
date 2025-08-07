import { useState } from "react"
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Paper,
  Typography,
  Alert,
  Stack,
} from "@mui/material"
import UploadFileIcon from "@mui/icons-material/UploadFile"

export default function CsvUploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [clearDB, setClearDB] = useState(false)
  const [alert, setAlert] = useState<{ type: "success" | "error" | "info"; message: string } | null>(null)
  const [uploading, setUploading] = useState(false)

  const handleUpload = async () => {
    setAlert(null)
    if (!file) {
      setAlert({ type: "error", message: "Please select a file." })
      return
    }

    if (clearDB) {
      try {
        await fetch("http://localhost:8000/clear-database", {
          method: "DELETE",
        })
        setAlert({ type: "info", message: "Database cleared. Uploading..." })
      } catch (err) {
        setAlert({ type: "error", message: "Failed to clear database." })
        return
      }
    } else {
      setAlert({ type: "info", message: "Uploading..." })
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const res = await fetch("http://localhost:8000/upload-orders", {
        method: "POST",
        body: formData,
      })

      const json = await res.json()
      setAlert({
        type: "success",
        message: `Inserted ${json.inserted} orders. Skipped ${json.skipped}.`,
      })
    } catch (err) {
      setAlert({ type: "error", message: "Upload failed." })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            Upload CSV
          </Typography>

          {alert && (
            <Alert severity={alert.type === "info" ? "info" : alert.type} onClose={() => setAlert(null)}>
              {alert.message}
            </Alert>
          )}

          <FormControlLabel
            control={
              <Checkbox
                checked={clearDB}
                onChange={(e) => setClearDB(e.target.checked)}
                color="primary"
              />
            }
            label="Clear database before upload"
          />

          <Button
            variant="outlined"
            component="label"
            startIcon={<UploadFileIcon />}
          >
            {file ? file.name : "Select CSV File"}
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </Button>

          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={!file || uploading}
          >
            Upload
          </Button>
        </Stack>
      </Paper>
    </Box>
  )
}
