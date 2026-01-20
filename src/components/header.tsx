import * as React from "react";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
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
  BookmarkSimpleIcon as BookmarkSimple,
  XIcon as X,
  BuildingsIcon as Buildings,
  GearIcon as Gear,
  TranslateIcon as Translate,
  BellIcon as Bell,
  CaretDownIcon as CaretDown,
  ArticleIcon,
  SparkleIcon as Sparkle,
  RocketLaunchIcon as RocketLaunch,
  MagnifyingGlassIcon as MagnifyingGlass,
  CommandIcon as Command,
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
  const [searchFocused, setSearchFocused] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const currentPath = location.pathname;

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

  const navItems = [
    { label: "Copilots", path: "/copilot", icon: <RocketLaunch size={18} weight="duotone" /> },
    { label: "Applications", path: "/applications", icon: <Briefcase size={18} weight="duotone" /> },
    { label: "Tools", path: "/tools", icon: <Gear size={18} weight="duotone" /> },
    { label: "Career", path: "/career", icon: <Buildings size={18} weight="duotone" /> },
    { label: "Support", path: "/support", icon: <ArticleIcon size={18} weight="duotone" /> },
  ];

  // Desktop Navigation (Authenticated)
  const DesktopAuthNav = () => (
    <div className="flex items-center gap-2">
      {/* Navigation Pills */}
      <nav className="flex items-center bg-gray-100/80 backdrop-blur-sm rounded-2xl p-1.5 mr-2">
        {navItems.map((item) => {
          const isActive = currentPath === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`
                relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold
                transition-all duration-300 ease-out
                ${isActive
                  ? "text-white shadow-lg"
                  : "text-gray-600 hover:text-gray-900 hover:bg-white/60"
                }
              `}
            >
              {isActive && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl" />
              )}
              <span className="relative z-10 flex items-center gap-2">
                {item.icon}
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>


      {/* Language Selector */}
      <Button
        onClick={handleLangMenuOpen}
        endIcon={<CaretDown size={14} weight="bold" />}
        sx={{
          textTransform: "none",
          px: 2,
          py: 1,
          borderRadius: "12px",
          color: "#4b5563",
          fontWeight: 600,
          fontSize: "0.875rem",
          minWidth: 75,
          bgcolor: "rgba(255,255,255,0.6)",
          border: "2px solid transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "white",
            borderColor: "#e5e7eb",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Translate size={18} className="mr-1.5" weight="duotone" />
        {currentLang}
      </Button>

      {/* Notifications */}
      <IconButton
        sx={{
          width: 42,
          height: 42,
          bgcolor: "rgba(255,255,255,0.6)",
          border: "2px solid transparent",
          transition: "all 0.2s ease",
          "&:hover": {
            bgcolor: "white",
            borderColor: "#e5e7eb",
            transform: "translateY(-1px)",
          },
        }}
      >
        <Badge
          badgeContent={3}
          sx={{
            "& .MuiBadge-badge": {
              bgcolor: "#ef4444",
              color: "white",
              fontWeight: 700,
              fontSize: "0.65rem",
              minWidth: 18,
              height: 18,
              animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
              "@keyframes pulse": {
                "0%, 100%": { transform: "scale(1)" },
                "50%": { transform: "scale(1.1)" },
              },
            },
          }}
        >
          <Bell size={20} className="text-gray-600" weight="duotone" />
        </Badge>
      </IconButton>

      {/* User Menu */}
      <button
        onClick={handleMenuOpen}
        className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-2xl bg-white/60 border-2 border-transparent hover:border-gray-200 hover:bg-white transition-all duration-200 group"
      >
        <div className="relative">
          <Avatar
            sx={{
              width: 36,
              height: 36,
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
              fontSize: "0.875rem",
              fontWeight: 700,
            }}
          >
            {user?.first_name?.[0]}{user?.last_name?.[0]}
          </Avatar>
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white" />
        </div>
        <div className="hidden xl:block text-left">
          <p className="text-sm font-semibold text-gray-800 leading-tight">
            {user?.first_name}
          </p>
          <p className="text-xs text-gray-500 leading-tight">Pro Plan</p>
        </div>
        <CaretDown size={14} className="text-gray-400 group-hover:text-gray-600 transition-colors" weight="bold" />
      </button>

      {/* User Dropdown Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        sx={{
          mt: 1,
          "& .MuiPaper-root": {
            borderRadius: "16px",
            minWidth: 260,
            boxShadow: "0 20px 40px -8px rgba(0,0,0,0.15), 0 8px 16px -4px rgba(0,0,0,0.08)",
            border: "1px solid rgba(0,0,0,0.05)",
            overflow: "hidden",
          },
        }}
      >
        {/* User Info Header */}
        <div className="px-4 py-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: "white",
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "1rem",
              }}
            >
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
            <div>
              <Typography className="font-bold text-white text-base">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography className="text-white/80 text-xs">
                {user?.email}
              </Typography>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Chip
              icon={<Sparkle size={14} className="text-amber-500" weight="fill" />}
              label="Pro Plan"
              size="small"
              sx={{
                bgcolor: "white",
                color: "#6366f1",
                fontWeight: 600,
                fontSize: "0.7rem",
                height: 24,
              }}
            />
            <span className="text-xs text-white/70">Active</span>
          </div>
        </div>

        {/* Menu Items */}
        <div className="py-2">
          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/profile");
            }}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <User size={20} className="text-gray-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText
              primary="My Profile"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
            />
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/applications");
            }}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Briefcase size={20} className="text-gray-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText
              primary="Applications"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
            />
            <Chip
              label="5"
              size="small"
              sx={{
                bgcolor: "rgba(99, 102, 241, 0.1)",
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 22,
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
              px: 2,
              mx: 1,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <BookmarkSimple size={20} className="text-gray-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText
              primary="Saved Jobs"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
            />
            <Chip
              label="12"
              size="small"
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
                fontWeight: 700,
                fontSize: "0.7rem",
                height: 22,
              }}
            />
          </MenuItem>

          <MenuItem
            onClick={() => {
              handleMenuClose();
              navigate("/settings");
            }}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              borderRadius: "10px",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <Gear size={20} className="text-gray-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText
              primary="Settings"
              primaryTypographyProps={{ fontWeight: 500, fontSize: "0.9rem" }}
            />
          </MenuItem>
        </div>

        <Divider sx={{ my: 1 }} />

        <div className="py-2">
          <MenuItem
            onClick={handleSignOut}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              borderRadius: "10px",
              color: "#dc2626",
              transition: "all 0.2s ease",
              "&:hover": {
                bgcolor: "rgba(220, 38, 38, 0.08)",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 36 }}>
              <SignOut size={20} className="text-red-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }}
            />
          </MenuItem>
        </div>
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
              borderRadius: "14px",
              minWidth: 200,
              boxShadow: "0 20px 40px -8px rgba(0,0,0,0.15), 0 8px 16px -4px rgba(0,0,0,0.08)",
              border: "1px solid rgba(0,0,0,0.05)",
            }
          }
        }}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Select Language</p>
        </div>
        {languages.map((lang) => (
          <MenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            selected={currentLang === lang.code}
            sx={{
              py: 1.5,
              px: 2,
              mx: 1,
              my: 0.5,
              borderRadius: "10px",
              "&.Mui-selected": {
                bgcolor: "rgba(99, 102, 241, 0.1)",
              },
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.08)",
              },
            }}
          >
            <span className="mr-3 text-xl">{lang.flag}</span>
            <span className="flex-grow font-medium">{lang.name}</span>
            {currentLang === lang.code && (
              <span className="text-indigo-600 font-bold">✓</span>
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
          width: 320,
          borderTopLeftRadius: 24,
          borderBottomLeftRadius: 24,
        },
      }}
    >
      {/* Drawer Header */}
      <div className="p-5 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <Avatar
              sx={{
                width: 52,
                height: 52,
                bgcolor: "white",
                color: "#6366f1",
                fontWeight: 700,
                fontSize: "1.1rem",
              }}
            >
              {user?.first_name?.[0]}{user?.last_name?.[0]}
            </Avatar>
            <div>
              <Typography className="font-bold text-white text-lg">
                {user?.first_name} {user?.last_name}
              </Typography>
              <Typography className="text-white/80 text-sm">
                {user?.email}
              </Typography>
            </div>
          </div>
          <IconButton
            onClick={toggleMobileMenu}
            sx={{
              color: "white",
              bgcolor: "rgba(255,255,255,0.1)",
              "&:hover": { bgcolor: "rgba(255,255,255,0.2)" }
            }}
          >
            <X size={20} weight="bold" />
          </IconButton>
        </div>
        <Chip
          icon={<Sparkle size={14} className="text-amber-500" weight="fill" />}
          label="Pro Plan Active"
          size="small"
          sx={{
            bgcolor: "white",
            color: "#6366f1",
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      </div>

      {/* Navigation Items */}
      <List className="py-3">
        {navItems.map((item) => (
          <ListItem key={item.path} disablePadding>
            <ListItemButton
              onClick={() => {
                navigate(item.path);
                toggleMobileMenu();
              }}
              selected={currentPath === item.path}
              sx={{
                py: 1.5,
                px: 3,
                mx: 1.5,
                borderRadius: "12px",
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(99, 102, 241, 0.1)",
                  "&:hover": { bgcolor: "rgba(99, 102, 241, 0.15)" },
                },
                "&:hover": { bgcolor: "rgba(99, 102, 241, 0.05)" },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: currentPath === item.path ? "#6366f1" : "#6b7280" }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: currentPath === item.path ? 600 : 500,
                  color: currentPath === item.path ? "#6366f1" : "#374151",
                }}
              />
              {currentPath === item.path && (
                <div className="w-2 h-2 rounded-full bg-indigo-500" />
              )}
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Quick Actions */}
      <List className="py-2">
        <ListItem disablePadding>
          <ListItemButton sx={{ py: 1.5, px: 3, mx: 1.5, borderRadius: "12px" }}>
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Bell size={20} className="text-gray-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText primary="Notifications" />
            <Badge
              badgeContent={3}
              sx={{
                "& .MuiBadge-badge": {
                  bgcolor: "#ef4444",
                  color: "white",
                  fontWeight: 700,
                }
              }}
            />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => {
              navigate("/saved");
              toggleMobileMenu();
            }}
            sx={{ py: 1.5, px: 3, mx: 1.5, borderRadius: "12px" }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <BookmarkSimple size={20} className="text-gray-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText primary="Saved Jobs" />
            <Chip
              label="12"
              size="small"
              sx={{
                bgcolor: "rgba(139, 92, 246, 0.1)",
                color: "#8b5cf6",
                fontWeight: 700,
                height: 22,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>

      <Divider sx={{ mx: 2 }} />

      {/* Language Selection */}
      <div className="px-4 py-4">
        <Typography className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Language
        </Typography>
        <div className="grid grid-cols-3 gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              className={`
                p-2.5 rounded-xl text-center transition-all duration-200
                ${currentLang === lang.code
                  ? "bg-indigo-100 border-2 border-indigo-400 shadow-sm"
                  : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }
              `}
            >
              <div className="text-xl mb-1">{lang.flag}</div>
              <div className={`text-xs font-semibold ${currentLang === lang.code ? "text-indigo-600" : "text-gray-600"}`}>
                {lang.code}
              </div>
            </button>
          ))}
        </div>
      </div>

      <Divider sx={{ mx: 2 }} />

      {/* Sign Out */}
      <List className="py-2">
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleSignOut}
            sx={{
              py: 1.5,
              px: 3,
              mx: 1.5,
              borderRadius: "12px",
              color: "#dc2626",
              "&:hover": { bgcolor: "rgba(220, 38, 38, 0.08)" },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <SignOut size={20} className="text-red-500" weight="duotone" />
            </ListItemIcon>
            <ListItemText
              primary="Sign Out"
              primaryTypographyProps={{ fontWeight: 600 }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Drawer>
  );

  // Auth Pages Navigation (Before Login)
  const AuthNav = () => (
    <div className="flex items-center gap-2">
      {/* Language Selector */}
      <Button
        onClick={handleLangMenuOpen}
        endIcon={<CaretDown size={14} weight="bold" />}
        sx={{
          textTransform: "none",
          px: 2,
          py: 1,
          borderRadius: "12px",
          color: "#4b5563",
          fontWeight: 600,
          fontSize: "0.875rem",
          bgcolor: "rgba(255,255,255,0.6)",
          border: "2px solid transparent",
          "&:hover": {
            bgcolor: "white",
            borderColor: "#e5e7eb",
          },
        }}
      >
        <Translate size={18} className="mr-1.5" weight="duotone" />
        {currentLang}
      </Button>

      <Button
        onClick={() => navigate("/auth/signin")}
        sx={{
          textTransform: "none",
          px: 3,
          py: 1,
          borderRadius: "12px",
          border: "2px solid #6366f1",
          color: "#6366f1",
          fontWeight: 600,
          fontSize: "0.875rem",
          "&:hover": {
            bgcolor: "rgba(99, 102, 241, 0.08)",
            borderColor: "#4f46e5",
          },
        }}
      >
        Login
      </Button>

      <Button
        onClick={() => navigate("/auth/signup")}
        sx={{
          textTransform: "none",
          px: 3,
          py: 1,
          borderRadius: "12px",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
          color: "white",
          fontWeight: 600,
          fontSize: "0.875rem",
          boxShadow: "0 4px 14px -2px rgba(99, 102, 241, 0.4)",
          "&:hover": {
            background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #c026d3 100%)",
            boxShadow: "0 6px 20px -2px rgba(99, 102, 241, 0.5)",
            transform: "translateY(-1px)",
          },
          transition: "all 0.2s ease",
        }}
      >
        Get Started
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
              borderRadius: "14px",
              minWidth: 200,
              boxShadow: "0 20px 40px -8px rgba(0,0,0,0.15)",
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
              mx: 1,
              my: 0.5,
              borderRadius: "10px",
              "&.Mui-selected": { bgcolor: "rgba(99, 102, 241, 0.1)" },
              "&:hover": { bgcolor: "rgba(99, 102, 241, 0.08)" },
            }}
          >
            <span className="mr-3 text-xl">{lang.flag}</span>
            <span className="flex-grow font-medium">{lang.name}</span>
            {currentLang === lang.code && (
              <span className="text-indigo-600 font-bold">✓</span>
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
          bgcolor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Toolbar
          sx={{
            py: 1.5,
            px: { xs: 2, sm: 3 },
            minHeight: { xs: 64, sm: 72 },
          }}
        >
          {/* Logo */}
          <div
            onClick={() => isAuthenticated ? navigate("/copilot") : navigate("/auth/signin")}
            className="flex items-center gap-3 cursor-pointer group mr-4"
          >
            {/* Animated Logo */}
            <div className="relative">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 group-hover:scale-105 transition-all duration-300">
                <span className="text-white font-bold text-xl">J</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center shadow-md">
                <Sparkle size={10} className="text-white" weight="fill" />
              </div>
            </div>

            {/* Brand Text */}
            <div className="hidden sm:block">
              <div className="flex items-center gap-1">
                <Typography
                  sx={{
                    fontSize: "1.35rem",
                    fontWeight: 800,
                    background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #d946ef 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Job Scout
                </Typography>
                <Chip
                  label="AI"
                  size="small"
                  sx={{
                    height: 18,
                    fontSize: "0.6rem",
                    fontWeight: 700,
                    bgcolor: "rgba(99, 102, 241, 0.1)",
                    color: "#6366f1",
                    ml: 0.5,
                  }}
                />
              </div>
              <Typography
                sx={{
                  fontSize: "0.7rem",
                  color: "#9ca3af",
                  fontWeight: 500,
                  letterSpacing: "0.02em",
                }}
              >
                Your AI Career Partner
              </Typography>
            </div>
          </div>

          {/* Spacer */}
          <div className="flex-grow" />

          {/* Navigation */}
          {isAuthenticated ? (
            <>
              {isMobile ? (
                <IconButton
                  onClick={toggleMobileMenu}
                  sx={{
                    width: 44,
                    height: 44,
                    bgcolor: "rgba(99, 102, 241, 0.08)",
                    "&:hover": {
                      bgcolor: "rgba(99, 102, 241, 0.15)",
                    },
                  }}
                >
                  <ListIcon size={24} className="text-indigo-600" weight="bold" />
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
