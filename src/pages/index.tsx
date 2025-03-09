import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Grid, Card, CardContent, Box, 
  Paper, Fade, Zoom, Avatar
} from "@mui/material";
import { 
  Store, Dashboard, BarChart, Equalizer, Insights, 
  Timeline, Lightbulb, ArrowForward, TrendingUp, Speed, Analytics
} from "@mui/icons-material";
import Link from "next/link";

const Home: React.FC = () => {
  const [activeSection, setActiveSection] = useState(0);

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = parseInt(entry.target.id.split("-")[1]);
            setActiveSection(id);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Custom stats for demo purposes
  const stats = [
    { value: "99.9%", label: "Uptime" },
    { value: "50M+", label: "Data Points" },
    { value: "2x", label: "Efficiency" },
    { value: "<500ms", label: "Response Time" }
  ];

  return (
    <Box sx={{ overflow: "hidden" }}>
      {/* Hero Section */}
      <section id="section-0">
        <Box
          sx={{
            position: "relative",
            overflow: "hidden",
            bgcolor: "#f8fafc",
            pt: 12,
            pb: 16,
          }}
        >
          {/* Background Elements */}
          <Box 
            sx={{ 
              position: "absolute", 
              top: 0, 
              left: 0, 
              width: "100%", 
              height: "100%", 
              overflow: "hidden",
              zIndex: 0 
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  position: "absolute",
                  width: { xs: "200px", md: "300px" },
                  height: { xs: "200px", md: "300px" },
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(30, 58, 138, 0.1))",
                  filter: "blur(50px)",
                  opacity: 0.8,
                  top: Math.random() * 100 + "%",
                  left: Math.random() * 100 + "%",
                  transform: "translate(-50%, -50%)",
                  animation: `float ${Math.floor(Math.random() * 10) + 20}s infinite linear`,
                }}
              />
            ))}
          </Box>

          <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Fade in={activeSection === 0} timeout={1000}>
                  <Box>
                    <Typography 
                      variant="h2" 
                      fontWeight="900" 
                      sx={{ 
                        background: "linear-gradient(135deg, #1E3A8A, #3B82F6)",
                        backgroundClip: "text",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.2
                      }}
                    >
                      Transform Your Data into Actionable Insights
                    </Typography>
                    <Typography variant="h6" sx={{ mt: 3, color: "#64748b", fontWeight: "normal" }}>
                      A powerful suite of tools to visualize, analyze, and manage your business data with unparalleled efficiency and clarity.
                    </Typography>
                    <Box sx={{ mt: 5, display: "flex", flexWrap: "wrap", gap: 2 }}>
                      <Link href="/stores" passHref>
                        <Button
                          variant="contained"
                          size="large"
                          endIcon={<ArrowForward />}
                          sx={{ 
                            px: 4, 
                            py: 1.5, 
                            borderRadius: "12px",
                            background: "linear-gradient(135deg, #2563EB, #1E40AF)",
                            boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.5)",
                            fontWeight: "bold",
                            transition: "transform 0.2s",
                            "&:hover": { 
                              transform: "translateY(-3px)",
                              boxShadow: "0 15px 30px -8px rgba(37, 99, 235, 0.6)",
                            }
                          }}
                        >
                          Get Started
                        </Button>
                      </Link>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{ 
                          px: 4, 
                          py: 1.5, 
                          borderRadius: "12px",
                          borderColor: "#2563EB",
                          color: "#2563EB",
                          fontWeight: "bold",
                          "&:hover": { 
                            borderColor: "#1E40AF",
                            background: "rgba(37, 99, 235, 0.05)"
                          }
                        }}
                      >
                        Watch Demo
                      </Button>
                    </Box>
                    
                    {/* Stats Row */}
                    <Grid container spacing={2} sx={{ mt: 6 }}>
                      {stats.map((stat, index) => (
                        <Grid item xs={6} sm={3} key={index}>
                          <Box sx={{ textAlign: { xs: "left", sm: "center" } }}>
                            <Typography variant="h4" sx={{ fontWeight: "bold", color: "#1E3A8A" }}>
                              {stat.value}
                            </Typography>
                            <Typography variant="body2" sx={{ color: "#64748b" }}>
                              {stat.label}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Fade>
              </Grid>
              <Grid item xs={12} md={6}>
                <Zoom in={activeSection === 0} timeout={1000} style={{ transitionDelay: '300ms' }}>
                  <Box 
                    sx={{ 
                      display: "flex", 
                      justifyContent: "center",
                      position: "relative"
                    }}
                  >
                    <Paper 
                      elevation={0}
                      sx={{ 
                        maxWidth: "100%",
                        aspectRatio: "4/3",
                        borderRadius: "24px",
                        overflow: "hidden", 
                        border: "1px solid rgba(226, 232, 240, 0.8)",
                        background: "linear-gradient(135deg, white, #f1f5f9)",
                        p: 3,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)"
                      }}
                    >
                      {/* Dashboard image placeholder with gradient instead of external image */}
                      <Box 
                        sx={{
                          width: "100%",
                          height: "100%",
                          borderRadius: "16px",
                          background: "linear-gradient(45deg, #e0f2fe, #dbeafe, #ede9fe)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center"
                        }}
                      >
                        <BarChart sx={{ fontSize: 80, color: "rgba(37, 99, 235, 0.3)" }} />
                      </Box>
                    </Paper>
                    
                    {/* Floating elements */}
                    <Paper 
                      elevation={2}
                      sx={{ 
                        position: "absolute", 
                        top: "10%", 
                        left: { xs: "0%", md: "-10%" },
                        bgcolor: "white",
                        borderRadius: "16px",
                        p: 2,
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: 1,
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)"
                      }}
                    >
                      <Avatar sx={{ bgcolor: "#ecf0ff" }}>
                        <TrendingUp sx={{ color: "#2563EB" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Revenue Growth</Typography>
                        <Typography variant="h6" sx={{ color: "#10b981", fontWeight: "bold" }}>+27.4%</Typography>
                      </Box>
                    </Paper>
                    
                    <Paper 
                      elevation={2}
                      sx={{ 
                        position: "absolute", 
                        bottom: "15%", 
                        right: { xs: "0%", md: "-5%" },
                        bgcolor: "white",
                        borderRadius: "16px",
                        p: 2,
                        display: { xs: "none", sm: "flex" },
                        alignItems: "center",
                        gap: 1,
                        boxShadow: "0 15px 30px rgba(0, 0, 0, 0.08)"
                      }}
                    >
                      <Avatar sx={{ bgcolor: "#fff1f2" }}>
                        <Speed sx={{ color: "#ef4444" }} />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">Performance</Typography>
                        <Typography variant="body2">Optimized by 35%</Typography>
                      </Box>
                    </Paper>
                  </Box>
                </Zoom>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </section>

      {/* Features Section */}
      <section id="section-1">
        <Box sx={{ bgcolor: "white", py: 12 }}>
          <Container>
            <Box sx={{ textAlign: "center", mb: 8 }}>
              <Typography 
                variant="overline" 
                sx={{ 
                  fontWeight: "bold", 
                  color: "#2563EB", 
                  letterSpacing: "0.1em" 
                }}
              >
                POWERFUL CAPABILITIES
              </Typography>
              <Typography 
                variant="h3" 
                fontWeight="bold" 
                sx={{ mt: 1, color: "#0f172a" }}
              >
                Key Features
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 2, 
                  color: "#64748b", 
                  maxWidth: "650px", 
                  mx: "auto" 
                }}
              >
                Our platform offers a comprehensive suite of tools designed to help you make better decisions through data-driven insights.
              </Typography>
            </Box>

            <Grid container spacing={4}>
              {[
                { 
                  title: "Advanced Store Management", 
                  desc: "Track store performance metrics, inventory levels, and customer patterns to optimize operations across all locations.", 
                  icon: <Store fontSize="large" sx={{ color: "#1E3A8A" }} />,
                  color: "#dbeafe"
                },
                { 
                  title: "Real-time Analytics Engine", 
                  desc: "Monitor your key performance indicators in real-time with our powerful analytics dashboard to make immediate data-driven decisions.", 
                  icon: <Analytics fontSize="large" sx={{ color: "#7c3aed" }} />,
                  color: "#ede9fe"
                },
                { 
                  title: "Interactive Visualizations", 
                  desc: "Transform complex data into easy-to-understand visual insights with customizable charts, graphs and interactive dashboards.", 
                  icon: <Timeline fontSize="large" sx={{ color: "#0891b2" }} />,
                  color: "#cffafe"
                },
                { 
                  title: "Predictive Intelligence", 
                  desc: "Leverage machine learning algorithms to predict trends, forecast demand, and identify opportunities for growth.", 
                  icon: <Lightbulb fontSize="large" sx={{ color: "#f59e0b" }} />,
                  color: "#fef3c7"
                },
              ].map((feature, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Zoom in={activeSection === 1} timeout={500} style={{ transitionDelay: `${index * 150}ms` }}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        height: "100%",
                        borderRadius: "16px",
                        transition: "transform 0.3s, box-shadow 0.3s",
                        border: "1px solid #f1f5f9",
                        overflow: "visible",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Box 
                          sx={{ 
                            display: "inline-flex",
                            p: 1.5,
                            borderRadius: "12px",
                            mb: 2,
                            bgcolor: feature.color
                          }}
                        >
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.desc}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </section>

      {/* Quick Navigation Section */}
      <section id="section-2">
        <Box 
          sx={{ 
            py: 10, 
            background: "linear-gradient(135deg, #1E3A8A, #2563EB)",
            position: "relative",
            overflow: "hidden"
          }}
        >
          {/* Background dots pattern */}
          <Box 
            sx={{ 
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              opacity: 0.4
            }}
          />
          
          <Container sx={{ position: "relative", zIndex: 1 }}>
            <Fade in={activeSection === 2} timeout={1000}>
              <Box sx={{ textAlign: "center", mb: 6 }}>
                <Typography variant="h3" fontWeight="bold" color="white">
                  Explore Our Platform
                </Typography>
                <Typography variant="body1" sx={{ mt: 2, color: "rgba(255, 255, 255, 0.8)", maxWidth: "700px", mx: "auto" }}>
                  Discover specialized tools designed to help you manage different aspects of your business data with precision and ease.
                </Typography>
              </Box>
            </Fade>

            <Grid container spacing={3} justifyContent="center">
              {[
                { 
                  name: "Store Dimension", 
                  link: "/stores", 
                  icon: <Store />,
                  desc: "Manage and analyze store performance metrics"
                },
                { 
                  name: "SKU Dimension", 
                  link: "/skus", 
                  icon: <Dashboard />,
                  desc: "Track product data across your inventory"
                },
                { 
                  name: "Planning Screen", 
                  link: "/planning", 
                  icon: <Equalizer />,
                  desc: "Forecast and plan future business strategies"
                },
                { 
                  name: "Charts", 
                  link: "/charts", 
                  icon: <BarChart />,
                  desc: "High-level overview of business performance"
                },
              ].map((item, index) => (
                <Grid item key={index} xs={12} sm={6} md={3}>
                  <Zoom in={activeSection === 2} timeout={500} style={{ transitionDelay: `${index * 150}ms` }}>
                    <Card 
                      elevation={0}
                      sx={{ 
                        borderRadius: "16px",
                        bgcolor: "rgba(255, 255, 255, 0.1)",
                        backdropFilter: "blur(10px)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        transition: "transform 0.3s, background-color 0.3s",
                        height: "100%",
                        "&:hover": {
                          transform: "translateY(-5px)",
                          bgcolor: "rgba(255, 255, 255, 0.15)",
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                          <Avatar 
                            sx={{ 
                              bgcolor: "rgba(255, 255, 255, 0.2)", 
                              color: "white", 
                              mr: 2 
                            }}
                          >
                            {item.icon}
                          </Avatar>
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              color: "white", 
                              fontWeight: "medium" 
                            }}
                          >
                            {item.name}
                          </Typography>
                        </Box>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: "rgba(255, 255, 255, 0.7)",
                            mb: 2
                          }}
                        >
                          {item.desc}
                        </Typography>
                        <Link href={item.link} passHref>
                          <Button 
                            variant="contained" 
                            fullWidth
                            sx={{ 
                              textTransform: "none",
                              bgcolor: "rgba(255, 255, 255, 0.15)",
                              borderRadius: "8px",
                              "&:hover": {
                                bgcolor: "rgba(255, 255, 255, 0.25)",
                              }
                            }}
                          >
                            Explore
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      </section>

      {/* Footer */}
      <Box
        sx={{
          bgcolor: "#0f172a",
          color: "white",
          textAlign: "center",
          p: 4,
        }}
      >
        <Container>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", mb: 2 }}>
            
            <Typography variant="h6" fontWeight="bold">
              Synergy
            </Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "rgba(255, 255, 255, 0.6)" }}>
            © 2025 Synergy. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;