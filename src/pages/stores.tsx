import React, { useState, useEffect } from "react";
import { 
  Container, 
  Typography, 
  Button, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  TextField, 
  DialogActions,
  Paper,
  Box,
  IconButton,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Grid,
  Breadcrumbs,
  Link,
  Backdrop,
  CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StoreIcon from "@mui/icons-material/Storefront";
import HomeIcon from "@mui/icons-material/Home";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import StoreTable from "../components/StoreTable";

interface Store {
  id: string;
  label: string;
  city: string;
  state: string;
}

const StoresPage: React.FC = () => {
  const [rowData, setRowData] = useState<Store[]>([]);
  const [open, setOpen] = useState<boolean>(false);
  const [formData, setFormData] = useState({ id: "", label: "", city: "", state: "" });
  const [loading, setLoading] = useState<boolean>(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    fetchStores();
  }, []);

  const fetchStores = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/stores");
      if (!res.ok) throw new Error("Failed to fetch stores");
      const data = await res.json();
      setRowData(data);
    } catch (err) {
      console.error("Error fetching stores:", err);
      showSnackbar("Failed to load stores", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ""});
    }
  };

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    if (!formData.id.trim()) errors.id = "Store ID is required";
    if (!formData.label.trim()) errors.label = "Store name is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddStore = async () => {
    if (!validateForm()) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/stores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to add store");

      const newStore = await response.json();
      setRowData([...rowData, newStore.store]);
      setOpen(false);
      setFormData({ id: "", label: "", city: "", state: "" });
      showSnackbar("Store added successfully", "success");
      window.location.reload(false);
    } catch (error) {
      console.error("Error adding store:", error);
      showSnackbar("Failed to add store", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error" | "info" | "warning") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      
      <Container maxWidth="lg" sx={{ mt: 4, mb: 8 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            borderRadius: 2, 
            mb: 4, 
            background: 'linear-gradient(to right, #1976d2, #2196f3)',
            color: 'white' 
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box>
              <Breadcrumbs 
                separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255,255,255,0.7)' }} />}
                aria-label="breadcrumb"
                sx={{ mb: 1, '& .MuiBreadcrumbs-li': { color: 'rgba(255,255,255,0.7)' } }}
              >
                <Link 
                  underline="hover" 
                  color="inherit" 
                  href="/" 
                  sx={{ display: 'flex', alignItems: 'center' }}
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Home
                </Link>
                <Typography color="white" sx={{ display: 'flex', alignItems: 'center' }}>
                  <StoreIcon sx={{ mr: 0.5 }} fontSize="small" />
                  Stores
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                Store Management
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                Manage all your retail locations in one place
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setOpen(true)}
              sx={{ 
                bgcolor: 'white', 
                color: '#1976d2', 
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.9)',
                }
              }}
            >
              Add Store
            </Button>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#424242' }}>
              Store Locations
            </Typography>
          </Box>
          <StoreTable rowData={rowData} setRowData={setRowData} onStoreDeleted={() => showSnackbar("Store deleted successfully", "success")} />
        </Paper>

        {/* Popup Form */}
        <Dialog 
          open={open} 
          onClose={() => setOpen(false)}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: { borderRadius: 2 }
          }}
        >
          <DialogTitle sx={{ bgcolor: '#f8f9fa', pb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StoreIcon sx={{ mr: 1, color: '#1976d2' }} />
                <Typography variant="h6" component="div">
                  Add New Store
                </Typography>
              </Box>
              <IconButton edge="end" color="inherit" onClick={() => setOpen(false)} aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
          </DialogTitle>
          <Divider />
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Store ID"
                  name="id"
                  value={formData.id}
                  onChange={handleInputChange}
                  error={!!formErrors.id}
                  helperText={formErrors.id}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Store Name"
                  name="label"
                  value={formData.label}
                  onChange={handleInputChange}
                  error={!!formErrors.label}
                  helperText={formErrors.label}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  error={!!formErrors.city}
                  helperText={formErrors.city}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  error={!!formErrors.state}
                  helperText={formErrors.state}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ px: 3, py: 2, bgcolor: '#f8f9fa' }}>
            <Button 
              onClick={() => setOpen(false)} 
              variant="outlined"
              color="inherit"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleAddStore} 
              color="primary" 
              variant="contained"
              startIcon={<AddIcon />}
            >
              Add Store
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity as "success" | "error" | "info" | "warning"} 
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
};

export default StoresPage;