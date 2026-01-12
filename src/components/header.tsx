import * as React from "react";
import { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Avatar,
  Badge,
  Chip,
} from "@mui/material";
import {
  UserIcon as User,
  SignOutIcon as SignOut,
  ListIcon,
  BriefcaseIcon as Briefcase,
  MagnifyingGlassIcon as MagnifyingGlass,
  BookmarkSimpleIcon as BookmarkSimple,
  XIcon as X,
  BuildingsIcon as Buildings,
  GearIcon as Gear,
  TranslateIcon as Translate,
  BellIcon as Bell,
  CaretDownIcon as CaretDown,
  ArticleIcon,
} from "@phosphor-icons/react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const { isAuthenticated, user, logout } = useAuth();

  // Use location.pathname instead of separate state
  const currentPath = location.pathname;

  // Languages available
  const languages = [
    { code: "EN", name: "English", flag: "🇺🇸" },
    { code: "ES", name: "Español", flag: "🇪🇸" },
    { code: "FR", name: "Français", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch", flag: "🇩🇪" },
    { code: "HI", name: "हिन्दी", flag: "🇮🇳" },
    { code: "ZH", name: "中文", flag: "🇨🇳" },
  ];

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (langCode: string) => {
    setCurrentLang(langCode);
    handleLangMenuClose();
  };

  const handleSignOut = () => {
    handleMenuClose();
    setMobileMenuOpen(false);
    logout();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items
  const navItems = [
    { label: "Copilots", path: "/copilot", icon: <Briefcase size={20} /> },
    { label: "Applications", path: "/applications", icon: <ListIcon size={20} /> },
    { label: "Tools", path: "/tools", icon: <Gear size={20} /> },
    { label: "Career", path: "/career", icon: <Buildings size={20} /> },
    { label: "Support", path: "/support", icon: <ArticleIcon size={20} /> },
  ];

  // Desktop Navigation (Authenticated)
  const DesktopAuthNav = () => (
    <div className="flex items-center gap-3">
      {navItems.map((item) => (
        <Button
          key={item.path}
          onClick={() => navigate(item.path)}
          startIcon={item.icon}
          sx={{
            px: 2,
            py: 1,
            borderRadius: "12px",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "0.95rem",
            transition: "all 0.2s ease",

            color: currentPath === item.path ? "#fff" : "#374151",

            background:
              currentPath === item.path
                ? "linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)"
                : "transparent",

            boxShadow:
              currentPath === item.path
                ? "0 8px 20px rgba(37, 99, 235, 0.3)"
                : "none",

            "&:hover": {
              background:
                currentPath === item.path
                  ? "linear-gradient(90deg, #2563EB 0%, #1D4ED8 100%)"
                  : "#F1F5F9",
            },

            "& .MuiButton-startIcon": {
              marginRight: "6px",
            },

            "&:focus-visible": {
              outline: "2px solid #2563EB",
              outlineOffset: "2px",
            },
          }}
        >
          {item.label}
        </Button>
      ))}

      {/* Language Selector */}
      <Button
        onClick={handleLangMenuOpen}
        endIcon={<CaretDown size={16} />}
        sx={{
          textTransform: "none",
          px: 2,
          py: 1,
          borderRadius: 2.5,
          color: "#374151",
          fontWeight: 600,
          minWidth: 85,
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(59, 130, 246, 0.08)",
            transform: "translateY(-2px)",
          },
        }}
      >
        <Translate size={20} className="mr-1" />
        {currentLang}
      </Button>

      {/* Notifications */}
      <IconButton
        sx={{
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "rgba(59, 130, 246, 0.08)",
            transform: "scale(1.05)",
          },
        }}
      >
        <Badge
          badgeContent={3}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)",
              color: "white",
              fontWeight: 700,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              "@keyframes pulse": {
                "0%, 100%": { opacity: 1 },
                "50%": { opacity: 0.7 },
              },
            },
          }}
        >
          <Bell size={24} className="text-gray-700" weight="duotone" />
        </Badge>
      </IconButton>

      {/* User Menu */}
      <div className="ml-2">
        <IconButton
          onClick={handleMenuOpen}
          className="p-0 transition-transform hover:scale-105"
        >
          <div className="relative">
            <Avatar
              sx={{
                width: 44,
                height: 44,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "3px solid white",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4), 0 0 0 0 rgba(102, 126, 234, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  boxShadow: "0 6px 16px rgba(102, 126, 234, 0.6), 0 0 0 4px rgba(102, 126, 234, 0.1)",
                },
              }}
            >
              <User size={24} weight="bold" />
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
          </div>
        </IconButton>
      </div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          mt: 1.5,
          "& .MuiPaper-root": {
            borderRadius: 3,
            minWidth: 240,
            boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "visible",
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
              borderTop: "1px solid rgba(0,0,0,0.05)",
              borderLeft: "1px solid rgba(0,0,0,0.05)",
            },
          },
        }}
      >
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
          <Typography
            variant="subtitle2"
            className="font-bold text-gray-900"
            sx={{ fontSize: "0.95rem" }}
          >
            {user?.first_name} {user?.last_name}
          </Typography>
          <Typography variant="caption" className="text-gray-600 font-medium">
            {user?.email}
          </Typography>
        </div>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/profile");
          }}
          sx={{
            py: 1.5,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.08)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
            My Profile
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/applications");
          }}
          sx={{
            py: 1.5,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.08)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon>
            <ListIcon size={20} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
            Applications
          </ListItemText>
          <Chip
            label="5"
            size="small"
            sx={{
              bgcolor: "rgba(59, 130, 246, 0.15)",
              color: "#2563EB",
              fontWeight: 700,
            }}
          />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/saved");
          }}
          sx={{
            py: 1.5,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(59, 130, 246, 0.08)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon>
            <BookmarkSimple size={20} />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 500 }}>
            Saved Jobs
          </ListItemText>
          <Chip
            label="12"
            size="small"
            sx={{
              bgcolor: "rgba(139, 92, 246, 0.15)",
              color: "#8B5CF6",
              fontWeight: 700,
            }}
          />
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem
          onClick={handleSignOut}
          sx={{
            py: 1.5,
            mx: 1,
            my: 0.5,
            borderRadius: 2,
            color: "#DC2626",
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "rgba(220, 38, 38, 0.08)",
              transform: "translateX(4px)",
            },
          }}
        >
          <ListItemIcon>
            <SignOut size={20} className="text-red-600" />
          </ListItemIcon>
          <ListItemText primaryTypographyProps={{ fontWeight: 600 }}>
            Sign Out
          </ListItemText>
        </MenuItem>
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLangMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 180,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={currentLang === lang.code}
            sx={{
              py: 1.5,
              px: 2,
              "&.Mui-selected": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
              },
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
              },
            }}
          >
            <span className="mr-2 text-xl">{lang.flag}</span>
            <span className="flex-grow">{lang.name}</span>
            {currentLang === lang.code && (
              <span className="ml-2 text-blue-600">✓</span>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

  // Mobile Navigation Drawer (Authenticated)
  const MobileAuthDrawer = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={toggleMobileMenu}
      sx={{
        "& .MuiDrawer-paper": {
          width: 300,
        },
      }}
    >
      <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar
            sx={{
              width: 48,
              height: 48,
              bgcolor: "white",
              color: "primary.main",
            }}
          >
            <User size={24} />
          </Avatar>
          <div>
            <Typography variant="subtitle1" className="font-semibold">
              {user?.first_name} {user?.last_name}
            </Typography>
            <Typography variant="caption">View Profile</Typography>
          </div>
        </div>
        <IconButton onClick={toggleMobileMenu} className="text-white">
          <X size={24} />
        </IconButton>
      </div>

      <List className="pt-2">
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                toggleMobileMenu();
              }}
              selected={currentPath === item.path}
              className="py-3"
              sx={{
                "&.Mui-selected": {
                  bgcolor: "rgba(59, 130, 246, 0.1)",
                  borderLeft: "4px solid #3b82f6",
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton className="py-3">
            <ListItemIcon>
              <Bell size={24} />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <Badge badgeContent={3} color="error" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/applications");
              toggleMobileMenu();
            }}
            className="py-3"
          >
            <ListItemIcon>
              <ArticleIcon size={24} />
            </ListItemIcon>
            <ListItemText primary="Applications" />
            <Chip label="5" size="small" color="primary" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/saved");
              toggleMobileMenu();
            }}
            className="py-3"
          >
            <ListItemIcon>
              <BookmarkSimple size={24} />
            </ListItemIcon>
            <ListItemText primary="Saved Jobs" />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider />

      {/* Language Selection in Mobile */}
      <div className="px-4 py-3">
        <Typography
          variant="caption"
          className="text-gray-500 font-semibold uppercase"
        >
          Language
        </Typography>
        <div className="grid grid-cols-3 gap-2 mt-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`p-2 rounded-lg text-center transition-all ${
                currentLang === lang.code
                  ? "bg-blue-100 border-2 border-blue-600"
                  : "bg-gray-100 border-2 border-transparent hover:bg-gray-200"
              }`}
            >
              <div className="text-xl mb-1">{lang.flag}</div>
              <div className="text-xs font-semibold">{lang.code}</div>
            </button>
          ))}
        </div>
      </div>

      <Divider />

      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut} className="py-3 text-red-600">
            <ListItemIcon>
              <SignOut size={24} className="text-red-600" />
            </ListItemIcon>
            <ListItemText primary="Sign Out" className="text-red-600" />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );

  // Auth Pages Navigation (Before Login)
  const AuthNav = () => (
    <div className="flex items-center gap-3">
      {/* Language Selector for non-authenticated users */}
      <Button
        onClick={handleLangMenuOpen}
        endIcon={<CaretDown size={16} />}
        className="normal-case px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100"
        sx={{ textTransform: "none" }}
      >
        <Translate size={20} className="mr-1" />
        {currentLang}
      </Button>

      <Button
        onClick={() => navigate("/auth/signin")}
        className="normal-case px-5 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-semibold"
        sx={{ textTransform: "none" }}
      >
        Login
      </Button>
      <Button
        onClick={() => navigate("/auth/signup")}
        className="normal-case px-5 py-2 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 font-semibold shadow-lg shadow-orange-500/30"
        sx={{ textTransform: "none", color: "white" }}
      >
        Register
      </Button>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLangMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{
          paper: {
            sx: {
              mt: 1,
              borderRadius: 2,
              minWidth: 180,
              boxShadow: "0 8px 30px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }
          }
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={currentLang === lang.code}
            sx={{
              py: 1.5,
              px: 2,
              "&.Mui-selected": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
              },
              "&:hover": {
                bgcolor: "rgba(59, 130, 246, 0.08)",
              },
            }}
          >
            <span className="mr-2 text-xl">{lang.flag}</span>
            <span className="flex-grow">{lang.name}</span>
            {currentLang === lang.code && (
              <span className="ml-2 text-blue-600">✓</span>
            )}
          </MenuItem>
        ))}
      </Menu>
    </div>
  );

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: "white",
          borderBottom: "2px solid transparent",
          borderImage: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899) 1",
          backdropFilter: "blur(10px)",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
        }}
      >
        <Toolbar className="py-3">
          <div
            onClick={() => isAuthenticated ? navigate("/copilot") : navigate("/auth/signin")}
            className="flex-grow flex items-center gap-2 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 flex items-center justify-center text-white font-bold text-xl shadow-xl shadow-blue-500/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
              <span className="relative z-10">J</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-400 to-purple-400 opacity-0 group-hover:opacity-50 blur-sm transition-opacity duration-300"></div>
            </div>
            <div className="hidden sm:block">
              <Typography
                variant="h6"
                className="font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500"
                sx={{
                  fontSize: "1.3rem",
                  letterSpacing: "-0.02em",
                }}
              >
                Job Scout
              </Typography>
              <Typography
                variant="caption"
                className="text-gray-500 font-medium -mt-1 block"
                sx={{ fontSize: "0.7rem" }}
              >
                Your AI Career Partner
              </Typography>
            </div>
          </div>

          {isAuthenticated ? (
            <>
              {isMobile ? (
                <IconButton
                  onClick={toggleMobileMenu}
                  className="hover:bg-gray-100"
                  sx={{
                    transition: "all 0.2s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                      bgcolor: "rgba(59, 130, 246, 0.1)",
                    },
                  }}
                >
                  <ListIcon size={26} className="text-gray-700" />
                </IconButton>
              ) : (
                <DesktopAuthNav />
              )}
            </>
          ) : (
            <AuthNav />
          )}
        </Toolbar>
      </AppBar>

      {isAuthenticated && isMobile && <MobileAuthDrawer />}
    </>
  );
}