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
import { clear } from "console";
import { clearTokens } from "@/lib/local-storage";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<HTMLElement | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState("EN");
  const { isAuthenticated } = useAuth();

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
    navigate("/auth/signin");
    clearTokens();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Navigation items
  const navItems = [
    { label: "Copilots", path: "/copilot", icon: <Briefcase size={20} /> },
    { label: "Companies", path: "/companies", icon: <Buildings size={20} /> },
    { label: "Services", path: "/services", icon: <Gear size={20} /> },
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
        className="normal-case px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 min-w-[80px]"
        sx={{ textTransform: "none" }}
      >
        <Translate size={20} className="mr-1" />
        {currentLang}
      </Button>

      {/* Notifications */}
      <IconButton className="hover:bg-gray-100">
        <Badge badgeContent={3} color="error">
          <Bell size={24} className="text-gray-700" />
        </Badge>
      </IconButton>

      {/* User Menu */}
      <div className="ml-2">
        <IconButton onClick={handleMenuOpen} className="p-0">
          <div className="relative">
            <Avatar
              sx={{
                width: 40,
                height: 40,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                border: "2px solid white",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              }}
            >
              <User size={22} weight="bold" />
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
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
            borderRadius: 2,
            minWidth: 200,
            boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          },
        }}
      >
        <div className="px-4 py-3 border-b">
          <Typography
            variant="subtitle2"
            className="font-semibold text-gray-900"
          >
            John Doe
          </Typography>
          <Typography variant="caption" className="text-gray-500">
            john.doe@email.com
          </Typography>
        </div>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/profile");
          }}
          className="py-2.5"
        >
          <ListItemIcon>
            <User size={20} />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/applications");
          }}
          className="py-2.5"
        >
          <ListItemIcon>
            <ListIcon size={20} />
          </ListItemIcon>
          <ListItemText>Applications</ListItemText>
          <Chip label="5" size="small" color="primary" />
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate("/saved");
          }}
          className="py-2.5"
        >
          <ListItemIcon>
            <BookmarkSimple size={20} />
          </ListItemIcon>
          <ListItemText>Saved Jobs</ListItemText>
          <Chip label="12" size="small" />
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleSignOut} className="py-2.5 text-red-600">
          <ListItemIcon>
            <SignOut size={20} className="text-red-600" />
          </ListItemIcon>
          <ListItemText>Sign Out</ListItemText>
        </MenuItem>
      </Menu>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLangMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          mt: 1,
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={currentLang === lang.code}
            className="py-2"
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
              John Doe
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
        sx={{
          mt: 1,
          "& .MuiPaper-root": {
            borderRadius: 2,
            minWidth: 180,
          },
        }}
      >
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={currentLang === lang.code}
            className="py-2"
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
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <Toolbar className="py-2">
          <div
            onClick={() => isAuthenticated ? navigate("/copilot") : navigate("/auth/login")}
            className="flex-grow flex items-center gap-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              J
            </div>
            <Typography
              variant="h6"
              className="font-bold text-gray-800 hidden sm:block"
            >
              Job Scout
            </Typography>
          </div>

          {isAuthenticated ? (
            <>
              {isMobile ? (
                <IconButton
                  onClick={toggleMobileMenu}
                  className="hover:bg-gray-100"
                >
                  <ListIcon size={24} className="text-gray-700" />
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