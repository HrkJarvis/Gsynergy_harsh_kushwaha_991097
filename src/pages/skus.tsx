import { useState, useEffect } from "react";
import SKUTable from "@/components/SKUTable";
import { 
  Box, 
  Button, 
  Modal, 
  TextField, 
  Typography,
  Paper,
  Container,
  IconButton,
  Grid,
  Divider,
  Breadcrumbs,
  Link,
  Alert,
  Snackbar,
  Backdrop,
  CircularProgress
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import HomeIcon from "@mui/icons-material/Home";
import InventoryIcon from "@mui/icons-material/Inventory";
import CloseIcon from "@mui/icons-material/Close";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

interface SKUData {
  ID: string;
  Label: string;
  Class: string;
  Department: string;
  Price: string;
  Cost: string;
}

export default function SKUPage() {
  const [open, setOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [skuData, setSkuData] = useState<SKUData>({
    ID: "",
    Label: "",
    Class: "",
    Department: "",
    Price: "",
    Cost: "",
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [tableKey, setTableKey] = useState(Date.now()); // Used to force table refresh

  const handleOpen = async (update = false) => {
    if (update) {
      promptForUpdate();
    } else {
      resetForm(false);
      setOpen(true);
    }
  };
  
  const promptForUpdate = () => {
    // Create a more styled prompt for SKU lookup
    setLoading(true);
    
    const dialog = document.createElement('dialog');
    dialog.classList.add('sku-lookup-dialog');
    dialog.style.cssText = `
      padding: 24px;
      border-radius: 8px;
      border: none;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      width: 300px;
      background: white;
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 10000;
    `;
    
    const heading = document.createElement('h3');
    heading.textContent = 'Enter SKU ID to Update';
    heading.style.cssText = `
      margin-top: 0;
      color: #1976d2;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'SKU ID';
    input.style.cssText = `
      width: 100%;
      padding: 10px;
      margin: 16px 0;
      border-radius: 4px;
      border: 1px solid #ddd;
      font-size: 16px;
      box-sizing: border-box;
    `;
    
    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = `
      display: flex;
      justify-content: flex-end;
      gap: 8px;
      margin-top: 16px;
    `;
    
    const cancelBtn = document.createElement('button');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.style.cssText = `
      padding: 8px 16px;
      border-radius: 4px;
      border: 1px solid #ddd;
      background: white;
      cursor: pointer;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    const lookupBtn = document.createElement('button');
    lookupBtn.textContent = 'Look Up';
    lookupBtn.style.cssText = `
      padding: 8px 16px;
      border-radius: 4px;
      border: none;
      background: #1976d2;
      color: white;
      cursor: pointer;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    buttonContainer.appendChild(cancelBtn);
    buttonContainer.appendChild(lookupBtn);
    
    dialog.appendChild(heading);
    dialog.appendChild(input);
    dialog.appendChild(buttonContainer);
    
    document.body.appendChild(dialog);
    dialog.showModal();
    
    cancelBtn.onclick = () => {
      dialog.close();
      document.body.removeChild(dialog);
      setLoading(false);
    };
    
    lookupBtn.onclick = async () => {
      const skuId = input.value.trim();
      dialog.close();
      document.body.removeChild(dialog);
      
      if (!skuId) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch(`/api/skus?${skuId}`);
        if (!response.ok) throw new Error("SKU not found");
    
        const data = await response.json();
        resetForm(true, { ...data, ID: skuId });
        setOpen(true);
      } catch (error) {
        showSnackbar("SKU ID not found!", "error");
      } finally {
        setLoading(false);
      }
    };
  };
  
  const resetForm = (updating: boolean, data?: SKUData) => {
    setIsUpdating(updating);
    setFormErrors({});
    
    if (data) {
      setSkuData(data);
    } else {
      setSkuData({
        ID: "",
        Label: "",
        Class: "",
        Department: "",
        Price: "",
        Cost: ""
      });
    }
  };
  
  const handleClose = () => {
    setOpen(false);
    resetForm(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
  
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({...formErrors, [name]: ""});
    }
    
    // Convert Price and Cost to numbers if applicable
    if (name === "Price" || name === "Cost") {
      value = value.replace(/[^0-9.]/g, "");
    }
  
    setSkuData({ ...skuData, [name]: value });
  };
  
  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!skuData.ID.trim()) errors.ID = "SKU ID is required";
    if (!skuData.Label.trim()) errors.Label = "Label is required";
    if (!skuData.Class.trim()) errors.Class = "Class is required";
    if (!skuData.Department.trim()) errors.Department = "Department is required";
    
    // Validate price and cost are valid numbers
    if (!skuData.Price || isNaN(parseFloat(skuData.Price))) {
      errors.Price = "Price must be a valid number";
    }
    
    if (!skuData.Cost || isNaN(parseFloat(skuData.Cost))) {
      errors.Cost = "Cost must be a valid number";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSKU = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await fetch("/api/skus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID: skuData.ID,
          Label: skuData.Label,
          Class: skuData.Class,
          Department: skuData.Department,
          Price: parseFloat(skuData.Price) || 0,
          Cost: parseFloat(skuData.Cost) || 0,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to add SKU");
  
      handleClose();
      showSnackbar("SKU added successfully", "success");
      refreshTable();
    } catch (error) {
      console.error("Error adding SKU:", error);
      showSnackbar("Error adding SKU. Please check the input values.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSKU = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/skus?${skuData.ID}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ID: skuData.ID,
          Label: skuData.Label,
          Class: skuData.Class,
          Department: skuData.Department,
          Price: parseFloat(skuData.Price) || 0,
          Cost: parseFloat(skuData.Cost) || 0,
        }),
      });
  
      if (!response.ok) throw new Error("Failed to update SKU");
  
      handleClose();
      showSnackbar("SKU updated successfully", "success");
      refreshTable();
    } catch (error) {
      console.error("Error updating SKU:", error);
      showSnackbar("Error updating SKU. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };
  
  const refreshTable = () => {
    // Force table refresh by changing the key
    setTableKey(Date.now());
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
            background: 'linear-gradient(to right, #5c6bc0, #3949ab)',
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
                  <InventoryIcon sx={{ mr: 0.5 }} fontSize="small" />
                  SKU Management
                </Typography>
              </Breadcrumbs>
              <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
                SKU Management
              </Typography>
              <Typography variant="body1" sx={{ mt: 1, opacity: 0.8 }}>
                Manage your product SKUs, pricing, and inventory classifications
              </Typography>
            </Box>
            <Box>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => handleOpen(false)}
                sx={{ 
                  bgcolor: 'white', 
                  color: '#3949ab', 
                  fontWeight: 'bold',
                  mr: 2,
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.9)',
                  }
                }}
              >
                Add SKU
              </Button>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => handleOpen(true)}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    borderColor: 'white',
                  }
                }}
              >
                Update SKU
              </Button>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={2} sx={{ borderRadius: 2, overflow: 'hidden' }}>
          <Box sx={{ p: 2, bgcolor: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
            <Typography variant="h6" sx={{ fontWeight: 500, color: '#424242', display: 'flex', alignItems: 'center' }}>
              <InventoryIcon sx={{ mr: 1, color: '#3949ab' }} />
              SKU Database
            </Typography>
          </Box>
          <Box sx={{ p: 0 }}>
            <SKUTable key={tableKey} />
          </Box>
        </Paper>

        {/* Modal for Add/Update SKU */}
        <Modal 
          open={open} 
          onClose={handleClose}
          aria-labelledby="sku-modal"
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 500,
              maxWidth: "90%",
              outline: "none",
              borderRadius: 2,
              overflow: "hidden",
            }}
          >
            <Box sx={{ p: 2, bgcolor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {isUpdating ? (
                  <EditIcon sx={{ mr: 1, color: '#673ab7' }} />
                ) : (
                  <AddIcon sx={{ mr: 1, color: '#3949ab' }} />
                )}
                <Typography variant="h6" id="sku-modal-title">
                  {isUpdating ? "Update SKU" : "Add New SKU"}
                </Typography>
              </Box>
              <IconButton size="small" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Divider />
            
            <Box sx={{ p: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="SKU ID"
                    name="ID"
                    value={skuData.ID}
                    onChange={handleChange}
                    disabled={isUpdating}
                    error={!!formErrors.ID}
                    helperText={formErrors.ID}
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Label"
                    name="Label"
                    value={skuData.Label}
                    onChange={handleChange}
                    error={!!formErrors.Label}
                    helperText={formErrors.Label}
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Class"
                    name="Class"
                    value={skuData.Class}
                    onChange={handleChange}
                    error={!!formErrors.Class}
                    helperText={formErrors.Class}
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Department"
                    name="Department"
                    value={skuData.Department}
                    onChange={handleChange}
                    error={!!formErrors.Department}
                    helperText={formErrors.Department}
                    InputProps={{
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Price ($)"
                    name="Price"
                    type="text"
                    value={skuData.Price}
                    onChange={handleChange}
                    error={!!formErrors.Price}
                    helperText={formErrors.Price}
                    InputProps={{
                      startAdornment: <AttachMoneyIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Cost ($)"
                    name="Cost"
                    type="text"
                    value={skuData.Cost}
                    onChange={handleChange}
                    error={!!formErrors.Cost}
                    helperText={formErrors.Cost}
                    InputProps={{
                      startAdornment: <AttachMoneyIcon sx={{ color: 'text.secondary', mr: 1 }} />,
                      sx: { borderRadius: 1 }
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button 
                  variant="outlined" 
                  color="inherit"
                  onClick={handleClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={isUpdating ? <EditIcon /> : <AddIcon />}
                  onClick={isUpdating ? handleUpdateSKU : handleAddSKU}
                >
                  {isUpdating ? "Update" : "Save"}
                </Button>
              </Box>
            </Box>
          </Paper>
        </Modal>
        
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
}