import { Link, Outlet } from "react-router-dom"
import AppBar from "@mui/material/AppBar"
import Toolbar from "@mui/material/Toolbar"
import Button from "@mui/material/Button"
import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"

export default function Header() {
  return (
    <div>
      <AppBar position="static" color="primary" elevation={1}>
        <Toolbar>
            <Typography variant="h6" sx={{ flexShrink: 0, mr: 4, fontStyle: "italic" }}>
            SS Website
            </Typography>
          <Box sx={{ flexGrow: 1, display: "flex", gap: 2 }}>
            <Button
              component={Link}
              to="/orders"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Orders
            </Button>
            <Button
              component={Link}
              to="/routes"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Routes
            </Button>
            <Button
              component={Link}
              to="/trucks"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Trucks
            </Button>
            <Button
              component={Link}
              to="/upload"
              color="inherit"
              sx={{ textTransform: "none" }}
            >
              Upload
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  )
}
