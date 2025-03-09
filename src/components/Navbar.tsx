import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import HomeIcon from "@mui/icons-material/Home";
import StoreIcon from "@mui/icons-material/Store";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import Button from "@mui/material/Button";
import Link from "next/link";
import { useRouter } from "next/router";
import { Box } from "@mui/material";
import Image from "next/image";

// Logo Image
const logoSrc = "/assets/logo.svg"; // Replace with your actual logo path

const Navbar: React.FC = () => {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("token"); // ✅ Clear token from localStorage
    router.push("/login"); // ✅ Redirect to login page
  };
  return (
    <>
      {/* Top Navbar */}
      <AppBar position="sticky" sx={{ backgroundColor: "#ffffff", boxShadow: "0px 4px 6px rgba(0,0,0,0.1)" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          {/* Logo */}
          <Link href="/" passHref style={{ textDecoration: "none" }}>
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }}>
              <Image src={logoSrc} alt="Logo" width={150} height={40} />
            </Box>
          </Link>

          {/* Navigation Links (Underline Removed) */}
          <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
            {[
              { name: "Home", link: "/", icon: <HomeIcon /> },
              { name: "Stores", link: "/stores", icon: <StoreIcon /> },
              { name: "SKU", link: "/skus", icon: <ShoppingCartIcon /> },
              { name: "Planning", link: "/planning", icon: <CalendarTodayIcon /> },
              { name: "Charts", link: "/charts", icon: <BarChartIcon /> },
            ].map((item, index) => (
              <Link key={index} href={item.link} passHref legacyBehavior>
                <Typography
                  variant="body1"
                  sx={{
                    color: "#333",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontFamily: "sans-serif",
                    textDecoration: "none", // ✅ Removes Underline
                    transition: "color 0.3s",
                    "&:hover": { color: "#0073e6" },
                  }}
                >
                  {item.name}
                </Typography>
              </Link>
            ))}

            {/* Logout Button */}
            <Button
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{ ml: 3 }}
            >
              Logout
            </Button>
          </Box>

          {/* Toggle Button for Small Screens */}
          <IconButton
            edge="end"
            color="inherit"
            aria-label="menu"
            sx={{ display: { xs: "block", md: "none" }, color: "#333" }}
            onClick={() => setOpen(true)}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Drawer Menu for Small Screens */}
      <Drawer anchor="left" open={open} onClose={() => setOpen(false)}>
        <List sx={{ width: 250 }}>
        <ListItem component="a" href="/" onClick={() => setOpen(false)}>
  <ListItemIcon><HomeIcon /></ListItemIcon>
  <ListItemText primary="Home" />
</ListItem>

<ListItem component="a" href="/stores" onClick={() => setOpen(false)}>
  <ListItemIcon><StoreIcon /></ListItemIcon>
  <ListItemText primary="Stores" />
</ListItem>

<ListItem component="a" href="/skus" onClick={() => setOpen(false)}>
  <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
  <ListItemText primary="SKU" />
</ListItem>

<ListItem component="a" href="/planning" onClick={() => setOpen(false)}>
  <ListItemIcon><CalendarTodayIcon /></ListItemIcon>
  <ListItemText primary="Planning" />
</ListItem>

<ListItem component="a" href="/charts" onClick={() => setOpen(false)}>
  <ListItemIcon><BarChartIcon /></ListItemIcon>
  <ListItemText primary="Charts" />
</ListItem>

{/* Logout Button */}
<ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
  <ListItemIcon>
    <LogoutIcon />
  </ListItemIcon>
  <ListItemText primary="Logout" />
</ListItem>
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
