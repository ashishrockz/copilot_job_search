import * as React from "react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Switch,
  IconButton,
  Button,
  Tooltip,
  Chip,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Skeleton,
  Snackbar,
  Alert,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  BriefcaseIcon as Briefcase,
  MapPinIcon as MapPin,
  MagnifyingGlassIcon as MagnifyingGlass,
  SlidersIcon as Sliders,
  TrashIcon as Trash,
  PencilSimpleIcon as PencilSimple,
  PlusIcon as Plus,
  SparkleIcon as Sparkle,
  ArrowsClockwiseIcon as ArrowsClockwise,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,

  BookmarkSimpleIcon as BookmarkSimple,
  LightningIcon as Lightning,
  QuestionIcon as Question,
  RocketIcon as Rocket,
  TargetIcon as Target,
  GraduationCapIcon as GraduationCap,
  CaretRightIcon as CaretRight,
} from "@phosphor-icons/react";
import { CandidateProfile } from "@/models/candidatePreferences";
import { useCandidateProfileList } from "@/hooks/onboarding/list";
import { useNavigate } from "react-router-dom";

// Custom MUI theme with refined aesthetics
const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1",
      light: "#818cf8",
      dark: "#4f46e5",
    },
    secondary: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
    },
    success: {
      main: "#10b981",
    },
    error: {
      main: "#ef4444",
    },
  },
  typography: {
    fontFamily: '"DM Sans", "Outfit", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: "0 4px 24px -4px rgba(0, 0, 0, 0.08)",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 500,
        },
      },
    },
  },
});

// Types for copilot configuration
interface CopilotConfig {
  id: number;
  title: string;
  searchMethod: string;
  location: string;
  jobMatch: string;
  filters: string;
  isActive: boolean;
  savedJobs: number;
  profile?: CandidateProfile;
}

// Helper function to safely display data
const displayValue = (value: string | null | undefined): string => {
  return value && value.trim() !== "" ? value : "-";
};

const displayArrayValue = (arr: string[] | null | undefined): string => {
  if (!arr || arr.length === 0) return "-";
  return arr.join(", ");
};

// Transform profile to copilot config
const transformProfileToConfig = (
  profile: CandidateProfile,
  index: number
): CopilotConfig => {
  const jobTitles = displayArrayValue(profile.preferences?.jobTitles);
  const locations = displayArrayValue(profile.preferences?.workLocation);
  const seniority = displayArrayValue(profile.preferences?.seniority);
  const jobTypes = displayArrayValue(profile.preferences?.jobTypes);

  return {
    id: profile.id || index,
    title: jobTitles !== "-" ? jobTitles : `Profile ${index + 1}`,
    searchMethod: "Job Titles",
    location: locations,
    jobMatch: seniority !== "-" ? seniority : "-",
    filters: jobTypes !== "-" ? `Job Types: ${jobTypes}` : "-",
    isActive: true,
    savedJobs: 0,
    profile,
  };
};

// Individual Copilot Card Component
interface CopilotCardProps {
  config: CopilotConfig;
  onToggle: (id: number) => void;
  onEdit: (config: CopilotConfig) => void;
  onDelete: (id: number) => void;
  onOptimize: (id: number) => void;
  index: number;
}

function CopilotCard({
  config,
  onToggle,
  onEdit,
  onDelete,
  onOptimize,
  index,
}: CopilotCardProps) {
  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
  ];

  const bgPatterns = [
    "bg-gradient-to-br from-indigo-50 to-purple-50",
    "bg-gradient-to-br from-emerald-50 to-teal-50",
    "bg-gradient-to-br from-amber-50 to-orange-50",
  ];

  const accentColors = [
    { bg: "bg-indigo-100", text: "text-indigo-700", border: "border-indigo-200" },
    { bg: "bg-emerald-100", text: "text-emerald-700", border: "border-emerald-200" },
    { bg: "bg-amber-100", text: "text-amber-700", border: "border-amber-200" },
  ];

  const gradient = gradients[index % 3];
  const bgPattern = bgPatterns[index % 3];
  const accent = accentColors[index % 3];

  return (
    <Card
      className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 ${bgPattern} border border-gray-100/50`}
      sx={{
        background: "rgba(255, 255, 255, 0.85)",
        backdropFilter: "blur(20px)",
      }}
    >
      {/* Decorative gradient bar */}
      <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />

      {/* Header Section */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate leading-tight">
              {displayValue(config.title)}
            </h3>
            <div className="flex items-center gap-2 mt-2">
              <Chip
                size="small"
                label={config.isActive ? "Active" : "Paused"}
                icon={
                  config.isActive ? (
                    <CheckCircle weight="fill" className="text-emerald-600" size={14} />
                  ) : (
                    <XCircle weight="fill" className="text-gray-400" size={14} />
                  )
                }
                className={`${
                  config.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-gray-100 text-gray-500"
                } font-medium`}
              />
            </div>
          </div>
          <Switch
            checked={config.isActive}
            onChange={() => onToggle(config.id)}
            color="primary"
            size="small"
          />
        </div>
      </div>

      {/* Details Section */}
      <CardContent className="px-5 py-3 space-y-3">
        <div className={`flex items-center gap-3 p-3 rounded-xl ${accent.bg} ${accent.border} border`}>
          <div className={`p-2 rounded-lg bg-white/80 ${accent.text}`}>
            <BookmarkSimple weight="duotone" size={18} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Auto-Save Jobs</p>
            <p className={`text-sm font-semibold ${accent.text}`}>Enabled</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <DetailRow
            icon={<MagnifyingGlass weight="duotone" size={16} />}
            label="Search Method"
            value={displayValue(config.searchMethod)}
          />
          <DetailRow
            icon={<MapPin weight="duotone" size={16} />}
            label="Location"
            value={displayValue(config.location)}
            truncate
          />
          <DetailRow
            icon={<Target weight="duotone" size={16} />}
            label="Job Match"
            value={displayValue(config.jobMatch)}
          />
          <DetailRow
            icon={<Sliders weight="duotone" size={16} />}
            label="Filters"
            value={displayValue(config.filters)}
            truncate
          />
        </div>
      </CardContent>

      {/* Actions Section */}
      <div className="px-5 pb-5 pt-2 flex items-center justify-between gap-2 border-t border-gray-100/80 mt-2">
        <div className="flex items-center gap-1">
          <Tooltip title="Edit Configuration" arrow>
            <IconButton
              size="small"
              onClick={() => onEdit(config)}
              className="text-gray-500 hover:text-indigo-600 hover:bg-indigo-50"
            >
              <PencilSimple weight="duotone" size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Refresh" arrow>
            <IconButton
              size="small"
              className="text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
            >
              <ArrowsClockwise weight="duotone" size={18} />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete" arrow>
            <IconButton
              size="small"
              onClick={() => onDelete(config.id)}
              className="text-gray-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash weight="duotone" size={18} />
            </IconButton>
          </Tooltip>
        </div>

        <Button
          size="small"
          variant="contained"
          startIcon={<Sparkle weight="fill" size={16} />}
          onClick={() => onOptimize(config.id)}
          className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-lg shadow-amber-200/50"
          sx={{
            background: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #d97706 0%, #ea580c 100%)",
            },
          }}
        >
          Optimize
        </Button>
      </div>
    </Card>
  );
}

// Detail Row Component
interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  truncate?: boolean;
}

function DetailRow({ icon, label, value, truncate }: DetailRowProps) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-400 flex-shrink-0">{icon}</span>
      <span className="text-gray-500 font-medium min-w-0">{label}:</span>
      <span
        className={`text-gray-800 font-semibold ${truncate ? "truncate" : ""} ${
          value === "-" ? "text-gray-400 font-normal italic" : ""
        }`}
        title={truncate ? value : undefined}
      >
        {value}
      </span>
    </div>
  );
}

// Add Card Placeholder
interface AddCardProps {
  onAdd: () => void;
  cardsCount: number;
}

function AddCard({ onAdd, cardsCount }: AddCardProps) {
  return (
    <Card
      onClick={onAdd}
      className="relative overflow-hidden cursor-pointer transition-all duration-500 hover:shadow-xl hover:-translate-y-1 border-2 border-dashed border-gray-300 hover:border-indigo-400 bg-gradient-to-br from-gray-50 to-white group"
      sx={{
        minHeight: 380,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="flex flex-col items-center gap-4 p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-100/50">
          <Plus
            weight="bold"
            size={32}
            className="text-indigo-600 group-hover:rotate-90 transition-transform duration-300"
          />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Add New Copilot</h3>
          <p className="text-sm text-gray-500">
            {3 - cardsCount} slot{3 - cardsCount !== 1 ? "s" : ""} remaining
          </p>
        </div>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<Lightning weight="fill" size={18} />}
          className="mt-2 border-2 hover:bg-indigo-50"
        >
          Create Copilot
        </Button>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-24 h-24 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-2xl" />
      <div className="absolute bottom-4 left-4 w-20 h-20 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-2xl" />
    </Card>
  );
}

// Loading Skeleton Card
function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton variant="rectangular" height={6} />
      <div className="p-5 space-y-4">
        <div className="flex justify-between">
          <Skeleton variant="text" width="60%" height={28} />
          <Skeleton variant="circular" width={40} height={24} />
        </div>
        <Skeleton variant="rounded" height={60} />
        <div className="space-y-2">
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="75%" />
        </div>
        <div className="flex justify-between pt-4">
          <div className="flex gap-2">
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
            <Skeleton variant="circular" width={32} height={32} />
          </div>
          <Skeleton variant="rounded" width={100} height={36} />
        </div>
      </div>
    </Card>
  );
}

// Guide Card Component
interface GuideCardProps {
  icon: React.ReactNode;
  title: string;
  gradient: string;
}

function GuideCard({ icon, title, gradient }: GuideCardProps) {
  return (
    <button className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-white border border-gray-100 hover:border-indigo-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div
        className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-indigo-600 transition-colors">
        {title}
      </span>
      <CaretRight
        weight="bold"
        size={16}
        className="text-gray-300 group-hover:text-indigo-500 group-hover:translate-x-1 transition-all"
      />
    </button>
  );
}

export function Page(): React.JSX.Element {
  const { profiles, loading, error, refetch } = useCandidateProfileList("user@abc.com");
  const [copilots, setCopilots] = useState<CopilotConfig[]>([]);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ open: false, message: "", severity: "info" });
  const navigate = useNavigate();

  // Transform profiles to copilots when data loads
  useEffect(() => {
    if (profiles && profiles.length > 0) {
      const transformedCopilots = profiles
        .slice(0, 3)
        .map((profile, index) => transformProfileToConfig(profile, index));
      setCopilots(transformedCopilots);
    }
  }, [profiles]);

  const handleToggle = (id: number) => {
    setCopilots((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
    setSnackbar({
      open: true,
      message: "Copilot status updated",
      severity: "success",
    });
  };

  const handleEdit = (config: CopilotConfig) => {
    console.log("Edit copilot:", config);
    // Implement edit modal logic here
  };

  const handleDelete = (id: number) => {
    setCopilots((prev) => prev.filter((c) => c.id !== id));
    setSnackbar({
      open: true,
      message: "Copilot deleted successfully",
      severity: "success",
    });
  };

  const handleOptimize = (id: number) => {
    setSnackbar({
      open: true,
      message: "Optimizing copilot configuration...",
      severity: "info",
    });
  };

  const handleAddCopilot = () => {
    if (copilots.length >= 3) {
      setSnackbar({
        open: true,
        message: "Maximum of 3 copilots allowed",
        severity: "error",
      });
      return;
    }
    // Implement add copilot modal logic here
    navigate("/copilot/create")
    console.log("Add new copilot");
  };

  const guides = [
    {
      icon: <Rocket weight="fill" size={24} />,
      title: "How copilot works",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: <GraduationCap weight="fill" size={24} />,
      title: "How to train your copilot",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      icon: <Briefcase weight="fill" size={24} />,
      title: "How to apply to external jobs",
      gradient: "from-amber-500 to-orange-500",
    },
    {
      icon: <Question weight="fill" size={24} />,
      title: "FAQ",
      gradient: "from-rose-500 to-pink-500",
    },
  ];

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Lightning weight="fill" size={22} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Copilots
              </h1>
            </div>
            <p className="text-gray-500 ml-13 pl-0.5">
              Manage your automated job search assistants
            </p>
          </div>

          {/* Error State */}
          {error && (
            <Alert severity="error" className="mb-6 rounded-xl">
              {error}
              <Button size="small" onClick={refetch} className="ml-4">
                Retry
              </Button>
            </Alert>
          )}

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <>
                <SkeletonCard />
                <SkeletonCard />
                <SkeletonCard />
              </>
            ) : (
              <>
                {copilots.map((copilot, index) => (
                  <CopilotCard
                    key={copilot.id}
                    config={copilot}
                    onToggle={handleToggle}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onOptimize={handleOptimize}
                    index={index}
                  />
                ))}
                {copilots.length < 3 && (
                  <AddCard onAdd={handleAddCopilot} cardsCount={copilots.length} />
                )}
              </>
            )}
          </div>

          {/* Stats Banner */}
          {/* <div className="mb-8">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-1">
              <div className="relative bg-white/95 backdrop-blur-xl rounded-xl px-6 py-5 flex items-center justify-center gap-4">
                <span className="text-3xl animate-bounce">🎉</span>
                <p className="text-lg text-gray-700">
                  Your copilots have saved{" "}
                  <span className="font-bold text-2xl bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {totalSavedJobs}
                  </span>{" "}
                  jobs since {savedJobsDate}
                </p>
              </div>
            </div>
          </div> */}

          {/* Guides Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap weight="duotone" size={24} className="text-indigo-500" />
                Guides
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Learn how to get the most out of your copilots
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
              {guides.map((guide, index) => (
                <GuideCard
                  key={index}
                  icon={guide.icon}
                  title={guide.title}
                  gradient={guide.gradient}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
            className="rounded-xl shadow-lg"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    </ThemeProvider>
  );
}