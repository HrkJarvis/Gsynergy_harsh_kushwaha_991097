import { useState } from "react";
import { useRouter } from "next/router";
import { 
  TextField, 
  Button, 
  Box, 
  Typography, 
  Container, 
  Paper,
  InputAdornment,
  IconButton,
  useTheme
} from "@mui/material";
import Image from "next/image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const theme = useTheme();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
  
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }
  
      // Store JWT token in localStorage
      localStorage.setItem("token", data.token);
  
      // Redirect to home page
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Paper 
        elevation={6} 
        sx={{ 
          mt: 10, 
          p: 5, 
          borderRadius: 3, 
          textAlign: "center",
          background: `linear-gradient(to bottom, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
        }}
      >
        <Box sx={{ mb: 4, display: "flex", justifyContent: "center" }}>
          <Box sx={{ position: "relative", width: 150, height: 80 }}>
            <Image 
              src="/assets/logo.svg" 
              alt="Company Logo" 
              layout="fill"
              objectFit="contain"
              priority
            />
          </Box>
        </Box>
        
        <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
          Welcome Back
        </Typography>
        
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Please enter your credentials to access your account
        </Typography>
        
        {error && (
          <Box sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'error.light', 
            color: 'error.contrastText',
            borderRadius: 1,
            opacity: 0.9
          }}>
            <Typography>{error}</Typography>
          </Box>
        )}

        <form onSubmit={handleLogin}>
          <TextField 
            fullWidth 
            label="Email Address" 
            variant="outlined" 
            margin="normal"
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="action" />
                </InputAdornment>
              ),
            }}
          />
          
          <TextField 
            fullWidth 
            label="Password" 
            type={showPassword ? "text" : "password"} 
            variant="outlined" 
            margin="normal"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockIcon color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={toggleShowPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          
          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            fullWidth 
            size="large"
            sx={{ 
              mt: 3,
              py: 1.5,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              fontSize: "1rem",
              boxShadow: 3
            }}
          >
            Sign In
          </Button>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;