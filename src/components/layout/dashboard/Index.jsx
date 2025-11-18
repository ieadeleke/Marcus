import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Container,
  CssBaseline,
  Drawer,
  IconButton,
  Toolbar,
} from "@mui/material";
import { Menu } from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import { Sidebar } from "./Sidebar";
import { useDispatch, useSelector } from "react-redux";
import Text from "../../Text";
import { useI18n } from "../../../utils/I18n.jsx";
import { setupAxiosInterceptors } from "../../../api/axios";
import axios from "../../../api/axios";
import Button from "../../Button";


export default function DashboardLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const user = useSelector((s) => s.user.details);
  const { t } = useI18n();
  const [onboarding, setOnboarding] = useState(null);
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    setupAxiosInterceptors(dispatch, navigate);
  }, [dispatch, navigate]);

  useEffect(() => {
    const load = async () => {
      try {
        const lang = user?.language || 'en';
        const { data } = await axios.get(`/api/i18n/onboarding?lang=${lang}`);
        setOnboarding(data);
        setShowOnboarding(!user?.onboardingCompleted);
      } catch (e) { /* ignore */ }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?._id, user?.language]);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const drawerWidth = 270;

  return (
    <>
      <Box>
        <Box
          component="nav"
          sx={{
            width: { sm: drawerWidth },
            flexShrink: { sm: 0 },
            zIndex: (theme) => theme.zIndex.drawer,
          }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", sm: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                maxHeight : '100vh !important',
              },
            }}
          >
            <Sidebar />
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
            open
          >
            <Sidebar />
          </Drawer>
        </Box>
        <Box
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          <CssBaseline />
          <AppBar
            position="fixed"
            sx={{
              zIndex: (theme) => theme.zIndex.drawer + 1,
              width: { md: `calc(100% - ${drawerWidth}px)` },
              
              ml: { sm: `${drawerWidth}px` },
              backgroundColor: "#fff",
              boxShadow: "none", padding: 2
            }}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2, display: { md: "none" } }}
              >
                <Menu sx={{ color: "#000" }} />
              </IconButton>
              <Box>
                <Text fs="23px" fw="550" color="#131C30">
                  {t('app.overview', 'Overview')}
                </Text>
              </Box>
              <Box sx={{ flexGrow: 1 }} />
              <Nav />
            </Toolbar>
          </AppBar>
          <Box
            bgcolor="#F6F9FC"
            sx={{
              minHeight: "calc(90vh)", // Adjusted to exclude app bar height
              ml: { md: `${drawerWidth}px` },
              minWidth: "100%",
              marginTop: '100px',
              p: { md: 5, lg: 6, sm: 2, xs: 1 },
              borderTopLeftRadius: "40px !important",
            }}
          >
            {showOnboarding && onboarding?.steps && (
              <Box sx={{ bgcolor: '#fff', p: 2, borderRadius: 2, mb: 2 }}>
                <Text fs="18px" fw="600" color="#131C30">Getting Started</Text>
                {onboarding.steps.map((s, i) => (
                  <Text key={i} fs="14px" fw="400" color="#475467">{i+1}. {s.title} — {s.content}</Text>
                ))}
                <Box sx={{ textAlign: 'right', mt: 1 }}>
                  <Button variant="contained" onClick={async () => { await axios.post(`/api/auth/onboarding/complete/${user?._id}`); setShowOnboarding(false); }}>Mark Complete</Button>
                </Box>
              </Box>
            )}
            {/* ------------------------------------------- */}
            {/* Page Route */}
            {/* ------------------------------------------- */}

            <Outlet />

            {/* ------------------------------------------- */}
            {/* End Page */}
            {/* ------------------------------------------- */}
          </Box>
        </Box>
      </Box>
    </>
  );
};
