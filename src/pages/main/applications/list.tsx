import * as React from "react";
import {
  Card,
  CardContent,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Skeleton,
  Pagination,
  Button,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
  MagnifyingGlassIcon as MagnifyingGlass,
  BriefcaseIcon as Briefcase,
  BuildingsIcon as Buildings,
  CalendarIcon as Calendar,
  LinkIcon as Link,
  CheckCircleIcon as CheckCircle,
  XCircleIcon as XCircle,
  ClockIcon as Clock,
  FunnelIcon as Funnel,
  ArrowSquareOutIcon as ArrowSquareOut,
  EnvelopeIcon as Envelope,
  UserIcon as User,
  ListBulletsIcon as ListBullets,
  SquaresFourIcon as SquaresFour,
  FileTextIcon as FileText,
} from "@phosphor-icons/react";
import { useApplicationsPage } from "@/hooks/application/get-application";
import { Application } from "@/types/application";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Custom MUI theme matching the app design
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
    warning: {
      main: "#f59e0b",
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

// Status configuration
const statusConfig: Record<
  string,
  { color: string; bg: string; icon: React.ReactNode; label: string }
> = {
  applied: {
    color: "text-emerald-700",
    bg: "bg-emerald-100",
    icon: <CheckCircle weight="fill" size={16} className="text-emerald-600" />,
    label: "Applied",
  },
  failed: {
    color: "text-red-700",
    bg: "bg-red-100",
    icon: <XCircle weight="fill" size={16} className="text-red-600" />,
    label: "Failed",
  },
  pending: {
    color: "text-amber-700",
    bg: "bg-amber-100",
    icon: <Clock weight="fill" size={16} className="text-amber-600" />,
    label: "Pending",
  },
};

// Platform colors
const platformColors: Record<string, { bg: string; text: string }> = {
  linkedin: { bg: "bg-blue-100", text: "text-blue-700" },
  indeed: { bg: "bg-indigo-100", text: "text-indigo-700" },
  glassdoor: { bg: "bg-green-100", text: "text-green-700" },
  ziprecruiter: { bg: "bg-purple-100", text: "text-purple-700" },
  dice: { bg: "bg-orange-100", text: "text-orange-700" },
  monster: { bg: "bg-pink-100", text: "text-pink-700" },
  default: { bg: "bg-gray-100", text: "text-gray-700" },
};

const getPlatformColor = (platform: string) => {
  const key = platform.toLowerCase();
  return platformColors[key] || platformColors.default;
};

// Application Card Component
interface ApplicationCardProps {
  application: Application;
  index: number;
}

function ApplicationCard({ application, index }: ApplicationCardProps) {
  const status = statusConfig[application.status] || statusConfig.pending;
  const platformColor = getPlatformColor(application.platform);

  const gradients = [
    "from-indigo-500 via-purple-500 to-pink-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-amber-500 via-orange-500 to-red-500",
    "from-blue-500 via-indigo-500 to-violet-500",
    "from-rose-500 via-pink-500 to-fuchsia-500",
  ];

  const gradient = gradients[index % 5];

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return dayjs(date).format("MMM D, YYYY");
  };

  const getRelativeTime = (date: Date | undefined) => {
    if (!date) return "";
    return dayjs(date).fromNow();
  };

  return (
    <Card className="relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-white/90 backdrop-blur-sm border border-gray-100/50 group">
      {/* Gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />

      <CardContent className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 truncate leading-tight group-hover:text-indigo-600 transition-colors">
              {application.jobTitle}
            </h3>
            <div className="flex items-center gap-2 mt-1.5">
              <Buildings
                weight="duotone"
                size={16}
                className="text-gray-400 flex-shrink-0"
              />
              <span className="text-sm text-gray-600 font-medium truncate">
                {application.company}
              </span>
            </div>
          </div>
          <Tooltip title="View Job Posting" arrow>
            <IconButton
              size="small"
              onClick={() => window.open(application.jobUrl, "_blank")}
              className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 opacity-0 group-hover:opacity-100 transition-all"
            >
              <ArrowSquareOut weight="bold" size={20} />
            </IconButton>
          </Tooltip>
        </div>

        {/* Status & Platform Chips */}
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <Chip
            size="small"
            label={status.label}
            className={`${status.bg} ${status.color} font-medium`}
          />
          <Chip
            size="small"
            label={application.platform}
            className={`${platformColor.bg} ${platformColor.text} font-medium capitalize`}
          />
        </div>

        {/* Details */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-3 text-sm">
            <User
              weight="duotone"
              size={16}
              className="text-gray-400 flex-shrink-0"
            />
            <span className="text-gray-500">Applicant:</span>
            <span className="text-gray-800 font-medium truncate">
              {application.applicantName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Envelope
              weight="duotone"
              size={16}
              className="text-gray-400 flex-shrink-0"
            />
            <span className="text-gray-500">Email:</span>
            <span className="text-gray-800 font-medium truncate">
              {application.applicantEmail}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Calendar
              weight="duotone"
              size={16}
              className="text-gray-400 flex-shrink-0"
            />
            <span className="text-gray-500">Applied:</span>
            <span className="text-gray-800 font-medium">
              {formatDate(application.appliedAt)}
              <span className="text-gray-400 ml-1 text-xs">
                ({getRelativeTime(application.appliedAt)})
              </span>
            </span>
          </div>
        </div>

        {/* Error message for failed applications */}
        {application.status === "failed" && application.errorMessage && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
            <p className="text-xs text-red-600 line-clamp-2">
              {application.errorMessage}
            </p>
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            {application.resumePath && (
              <Tooltip title="View Resume" arrow>
                <IconButton
                  size="small"
                  className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
                >
                  <FileText weight="duotone" size={18} />
                </IconButton>
              </Tooltip>
            )}
          </div>
          <Button
            size="small"
            variant="text"
            endIcon={<ArrowSquareOut weight="bold" size={14} />}
            onClick={() => window.open(application.jobUrl, "_blank")}
            className="text-indigo-600 hover:bg-indigo-50"
          >
            View Job
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Application Table Row Component
interface ApplicationRowProps {
  application: Application;
}

function ApplicationRow({ application }: ApplicationRowProps) {
  const status = statusConfig[application.status] || statusConfig.pending;
  const platformColor = getPlatformColor(application.platform);

  const formatDate = (date: Date | undefined) => {
    if (!date) return "N/A";
    return dayjs(date).format("MMM D, YYYY");
  };

  return (
    <tr className="hover:bg-indigo-50/30 transition-colors group">
      <td className="px-4 py-4">
        <div className="flex flex-col">
          <span className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {application.jobTitle}
          </span>
          <span className="text-sm text-gray-500">{application.company}</span>
        </div>
      </td>
      <td className="px-4 py-4">
        <Chip
          size="small"
          label={application.platform}
          className={`${platformColor.bg} ${platformColor.text} font-medium capitalize`}
        />
      </td>
      <td className="px-4 py-4">
        <Chip
          size="small"
          label={status.label}
          className={`${status.bg} ${status.color} font-medium`}
        />
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">
          {application.applicantName}
        </span>
      </td>
      <td className="px-4 py-4">
        <span className="text-sm text-gray-600">
          {formatDate(application.appliedAt)}
        </span>
      </td>
      <td className="px-4 py-4">
        <div className="flex items-center gap-1">
          <Tooltip title="View Job" arrow>
            <IconButton
              size="small"
              onClick={() => window.open(application.jobUrl, "_blank")}
              className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
            >
              <ArrowSquareOut weight="bold" size={18} />
            </IconButton>
          </Tooltip>
          {application.resumePath && (
            <Tooltip title="View Resume" arrow>
              <IconButton
                size="small"
                className="text-gray-400 hover:text-indigo-600 hover:bg-indigo-50"
              >
                <FileText weight="duotone" size={18} />
              </IconButton>
            </Tooltip>
          )}
        </div>
      </td>
    </tr>
  );
}

// Skeleton Card
function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <Skeleton variant="rectangular" height={4} />
      <div className="p-5 space-y-4">
        <div>
          <Skeleton variant="text" width="70%" height={28} />
          <Skeleton variant="text" width="50%" height={20} className="mt-1" />
        </div>
        <div className="flex gap-2">
          <Skeleton variant="rounded" width={80} height={24} />
          <Skeleton variant="rounded" width={80} height={24} />
        </div>
        <div className="space-y-2">
          <Skeleton variant="text" width="60%" />
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
        <div className="flex justify-between pt-3 border-t border-gray-100">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="rounded" width={80} height={32} />
        </div>
      </div>
    </Card>
  );
}

// Skeleton Table Row
function SkeletonRow() {
  return (
    <tr>
      <td className="px-4 py-4">
        <div className="space-y-1">
          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="50%" height={16} />
        </div>
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="rounded" width={80} height={24} />
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="rounded" width={80} height={24} />
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="text" width="70%" height={20} />
      </td>
      <td className="px-4 py-4">
        <Skeleton variant="text" width="60%" height={20} />
      </td>
      <td className="px-4 py-4">
        <div className="flex gap-1">
          <Skeleton variant="circular" width={32} height={32} />
          <Skeleton variant="circular" width={32} height={32} />
        </div>
      </td>
    </tr>
  );
}

// Stats Card Component
interface StatsCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  gradient: string;
  bgGradient: string;
}

function StatsCard({
  icon,
  label,
  value,
  gradient,
  bgGradient,
}: StatsCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-2xl ${bgGradient} p-5 border border-white/50`}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}
        >
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl" />
    </div>
  );
}

// Empty State Component
function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6">
        <Briefcase weight="duotone" size={48} className="text-indigo-500" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        No Applications Yet
      </h3>
      <p className="text-gray-500 text-center max-w-md">
        Your job applications will appear here once you start applying through
        your copilots.
      </p>
    </div>
  );
}

export function Page(): React.JSX.Element {
  const { loading, applications } = useApplicationsPage();
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("all");
  const [platformFilter, setPlatformFilter] = React.useState<string>("all");
  const [currentPage, setCurrentPage] = React.useState(1);
  const itemsPerPage = 9;

  // Calculate stats
  const stats = React.useMemo(() => {
    return {
      total: applications.length,
      applied: applications.filter((a) => a.status === "applied").length,
      failed: applications.filter((a) => a.status === "failed").length,
      pending: applications.filter((a) => a.status === "pending").length,
    };
  }, [applications]);

  // Get unique platforms
  const platforms = React.useMemo(() => {
    const uniquePlatforms = [...new Set(applications.map((a) => a.platform))];
    return uniquePlatforms;
  }, [applications]);

  // Filter applications
  const filteredApplications = React.useMemo(() => {
    return applications.filter((app) => {
      const matchesSearch =
        searchQuery === "" ||
        app.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.applicantName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || app.status === statusFilter;
      const matchesPlatform =
        platformFilter === "all" ||
        app.platform.toLowerCase() === platformFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [applications, searchQuery, statusFilter, platformFilter]);

  // Pagination
  const paginatedApplications = React.useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredApplications.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredApplications, currentPage]);

  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, platformFilter]);

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
        {/* Decorative background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-indigo-200/40 to-purple-200/40 rounded-full blur-3xl" />
          <div className="absolute top-1/2 -left-40 w-96 h-96 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-200/50">
                <Briefcase weight="fill" size={22} className="text-white" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-gray-900 via-indigo-900 to-purple-900 bg-clip-text text-transparent">
                Applications
              </h1>
            </div>
            <p className="text-gray-500 ml-13 pl-0.5">
              Track and manage all your job applications
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <StatsCard
              icon={<Briefcase weight="fill" size={24} />}
              label="Total Applications"
              value={stats.total}
              gradient="from-indigo-500 to-purple-500"
              bgGradient="bg-gradient-to-br from-indigo-50 to-purple-50"
            />
            <StatsCard
              icon={<CheckCircle weight="fill" size={24} />}
              label="Applied"
              value={stats.applied}
              gradient="from-emerald-500 to-teal-500"
              bgGradient="bg-gradient-to-br from-emerald-50 to-teal-50"
            />
            <StatsCard
              icon={<Clock weight="fill" size={24} />}
              label="Pending"
              value={stats.pending}
              gradient="from-amber-500 to-orange-500"
              bgGradient="bg-gradient-to-br from-amber-50 to-orange-50"
            />
            <StatsCard
              icon={<XCircle weight="fill" size={24} />}
              label="Failed"
              value={stats.failed}
              gradient="from-red-500 to-rose-500"
              bgGradient="bg-gradient-to-br from-red-50 to-rose-50"
            />
          </div>

          {/* Filters Section */}
          <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg shadow-gray-100/50 p-4 sm:p-6 mb-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search by job title, company, or applicant..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <MagnifyingGlass
                          weight="duotone"
                          size={20}
                          className="text-gray-400"
                        />
                      </InputAdornment>
                    ),
                    className: "rounded-xl bg-gray-50/50",
                  }}
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <FormControl size="small" className="min-w-[140px]">
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={statusFilter}
                    label="Status"
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="rounded-xl bg-gray-50/50"
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="applied">Applied</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="failed">Failed</MenuItem>
                  </Select>
                </FormControl>

                <FormControl size="small" className="min-w-[140px]">
                  <InputLabel>Platform</InputLabel>
                  <Select
                    value={platformFilter}
                    label="Platform"
                    onChange={(e) => setPlatformFilter(e.target.value)}
                    className="rounded-xl bg-gray-50/50"
                  >
                    <MenuItem value="all">All Platforms</MenuItem>
                    {platforms.map((platform) => (
                      <MenuItem key={platform} value={platform.toLowerCase()}>
                        {platform}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-xl p-1">
                  <Tooltip title="Grid View" arrow>
                    <IconButton
                      size="small"
                      onClick={() => setViewMode("grid")}
                      className={`${
                        viewMode === "grid"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-500"
                      } rounded-lg`}
                    >
                      <SquaresFour
                        weight={viewMode === "grid" ? "fill" : "regular"}
                        size={20}
                      />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="List View" arrow>
                    <IconButton
                      size="small"
                      onClick={() => setViewMode("list")}
                      className={`${
                        viewMode === "list"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-500"
                      } rounded-lg`}
                    >
                      <ListBullets
                        weight={viewMode === "list" ? "fill" : "regular"}
                        size={20}
                      />
                    </IconButton>
                  </Tooltip>
                </div>
              </div>
            </div>

            {/* Active Filters */}
            {(searchQuery ||
              statusFilter !== "all" ||
              platformFilter !== "all") && (
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <Funnel weight="duotone" size={16} className="text-gray-400" />
                <span className="text-sm text-gray-500">Active filters:</span>
                <div className="flex flex-wrap gap-2">
                  {searchQuery && (
                    <Chip
                      size="small"
                      label={`Search: "${searchQuery}"`}
                      onDelete={() => setSearchQuery("")}
                      className="bg-indigo-100 text-indigo-700"
                    />
                  )}
                  {statusFilter !== "all" && (
                    <Chip
                      size="small"
                      label={`Status: ${statusFilter}`}
                      onDelete={() => setStatusFilter("all")}
                      className="bg-indigo-100 text-indigo-700"
                    />
                  )}
                  {platformFilter !== "all" && (
                    <Chip
                      size="small"
                      label={`Platform: ${platformFilter}`}
                      onDelete={() => setPlatformFilter("all")}
                      className="bg-indigo-100 text-indigo-700"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          {!loading && (
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                Showing{" "}
                <span className="font-semibold text-gray-700">
                  {paginatedApplications.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-gray-700">
                  {filteredApplications.length}
                </span>{" "}
                applications
              </p>
            </div>
          )}

          {/* Content */}
          {loading ? (
            viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : (
              <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50/80">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Job
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Platform
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Applicant
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <SkeletonRow key={i} />
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : filteredApplications.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg">
              <EmptyState />
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {paginatedApplications.map((application, index) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-gray-100 shadow-lg overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead className="bg-gray-50/80">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Platform
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Applicant
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Applied
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedApplications.map((application) => (
                    <ApplicationRow
                      key={application.id}
                      application={application}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <Pagination
                count={totalPages}
                page={currentPage}
                onChange={(_, page) => setCurrentPage(page)}
                color="primary"
                shape="rounded"
                size="large"
                sx={{
                  "& .MuiPaginationItem-root": {
                    borderRadius: "12px",
                    fontWeight: 600,
                  },
                }}
              />
            </div>
          )}
        </div>
      </div>
    </ThemeProvider>
  );
}
