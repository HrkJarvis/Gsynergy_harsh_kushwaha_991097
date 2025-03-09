import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import type { AppProps } from "next/app";
import { ThemeProvider, CssBaseline, createTheme, CircularProgress, Box } from "@mui/material";
import Navbar from "../components/Navbar";

const theme = createTheme();

function MyApp({ Component, pageProps }: AppProps) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setAuthenticated(false);
        if (router.pathname !== "/login") router.push("/login");
        return;
      }

      try {
        const response = await fetch("/api/protected", {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token in headers
        });

        if (response.ok) {
          setAuthenticated(true);
        } else {
          throw new Error("Not authenticated");
        }
      } catch (err) {
        setAuthenticated(false);
        localStorage.removeItem("token"); // ✅ Clear token if invalid
        if (router.pathname !== "/login") router.push("/login");
      }
    };

    checkAuth();
  }, [router.pathname]);

  // ✅ Show a loading spinner while checking authentication
  if (authenticated === null) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {authenticated && <Navbar />}
      <Component {...pageProps} />
    </ThemeProvider>
  );
}

export default MyApp;
