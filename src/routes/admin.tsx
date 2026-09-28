import { useState, useEffect, useRef, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Bell,
  BellRing,
  Calendar,
  CalendarCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  CreditCard,
  Database,
  DollarSign,
  Download,
  Edit,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Filter,
  Globe,
  Key,
  Layers,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Megaphone,
  MessageSquare,
  Package,
  Palette,
  Phone,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sliders,
  Sparkles,
  Trash,
  Trash2,
  TrendingUp,
  User,
  UserCheck,
  UserPlus,
  Users,
  Video,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import type { Lead, LeadStatus, ProjectStatus, Order, PaymentStatus, AdminUser, ActivityLog, LoginLog, CalendlyMeeting, CRMNotification } from "@/lib/db";
import {
  fetchLeadsServerFn,
  addManualLeadServerFn,
  updateLeadDetailsServerFn,
  updateLeadStatusServerFn,
  updateProjectStatusServerFn,
  softDeleteLeadServerFn,
  restoreLeadServerFn,
  permanentDeleteLeadServerFn,
  bulkPermanentDeleteLeadsServerFn,
  bulkRestoreLeadsServerFn,
  emptyRecycleBinServerFn,
  fetchActivityLogsServerFn,
  addActivityLogServerFn,
  recordLoginLogServerFn,
  fetchLoginLogsServerFn,
  fetchAdminUsersServerFn,
  createAdminUserServerFn,
  toggleAdminUserStatusServerFn,
  deleteAdminUserServerFn,
  fetchCalendlyMeetingsServerFn,
  syncCalendlyEventsServerFn,
  saveCalendlyMeetingServerFn,
  updateCalendlyMeetingServerFn,
  cancelCalendlyMeetingServerFn,
  deleteCalendlyMeetingServerFn,
  sendTestCalendlyBookingServerFn,
  fetchNotificationsServerFn,
  markNotificationReadServerFn,
  markAllNotificationsReadServerFn,
  clearNotificationsServerFn,
  broadcastLeadEvent,
} from "@/lib/lead-actions";
import {
  fetchOrdersServerFn,
  updateOrderStatusServerFn,
  deleteOrderServerFn,
  broadcastOrderEvent,
  verifyPaymentPinServerFn,
} from "@/lib/paypal-actions";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [{ title: "CRM & Lead Management Portal | Quickupp AI Studio" }],
  }),
  component: AdminPage,
});

// Audio chime using Web Audio API
function playNotificationChime() {
  try {
    if (typeof window === "undefined") return;
    const AudioContextClass =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(587.33, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
    osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.22);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.exponentialRampToValueAtTime(0.18, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  } catch {}
}

function WhatsAppIcon({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`fill-current ${className}`} xmlns="http://www.w3.org/2000/svg">
      <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24zm-3.6 3.63c-.2 0-.42.01-.6.04-.24.04-.52.14-.72.37-.25.28-.97.95-.97 2.32s.99 2.69 1.13 2.87c.14.19 1.95 2.98 4.73 4.18.66.29 1.18.46 1.58.59.66.21 1.27.18 1.75.11.53-.08 1.63-.67 1.86-1.31.23-.65.23-1.2.16-1.31-.07-.12-.25-.19-.53-.33-.28-.14-1.63-.8-1.88-.89-.25-.09-.44-.14-.62.14-.19.28-.72.89-.88 1.07-.16.19-.33.21-.61.07-.28-.14-1.18-.44-2.25-1.39-.83-.74-1.4-1.66-1.56-1.94-.16-.28-.02-.43.12-.57.13-.13.28-.33.42-.5.14-.16.19-.28.28-.47.09-.19.05-.35-.02-.49-.07-.14-.62-1.5-.86-2.05-.22-.53-.46-.46-.62-.47z" />
    </svg>
  );
}

const VIDEO_TYPES = [
  "AI UGC",
  "AI Avatar",
  "Product Video",
  "Cartoon",
  "Hyper Realistic",
  "Digital Twin",
  "Other",
];

interface AuthSession {
  email: string;
  name: string;
  role: "super_admin" | "admin" | "leads_manager";
}

function AdminPage() {
  // Pure Clean Light Theme (Dark Mode completely removed as per requirements)
  const isDark = false;

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("ai_studio_crm_theme");
    }
  }, []);

  // Authentication & Role State
  const [session, setSession] = useState<AuthSession | null>(null);
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tabs Navigation
  type TabType = "dashboard" | "leads" | "meta_leads" | "orders" | "calendly" | "activity" | "users" | "security" | "recycle_bin" | "settings";
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  // Leads Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [recycleBinLeads, setRecycleBinLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Search & Filtering State for Website Leads (Section 11: Filters & Search)
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSource, setFilterSource] = useState<string>("All");
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [filterProjectStatus, setFilterProjectStatus] = useState<string>("All");
  const [filterVideoType, setFilterVideoType] = useState<string>("All");
  const [filterLocation, setFilterLocation] = useState<string>("");
  const [filterClosedBy, setFilterClosedBy] = useState<string>("All");
  const [filterDateType, setFilterDateType] = useState<"created_at" | "meeting_date" | "closed_at" | "delivery_date">("created_at");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleApplyFilters = () => {
    const count = filteredLeads.length;
    showToast(`Filters applied • ${count} lead${count === 1 ? "" : "s"} match`);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setFilterSource("All");
    setFilterStatus("All");
    setFilterProjectStatus("All");
    setFilterVideoType("All");
    setFilterLocation("");
    setFilterClosedBy("All");
    setFilterDateType("created_at");
    setFromDate("");
    setToDate("");
    showToast("All filters cleared");
  };

  // Meta Leads Dedicated Filtering & Search State
  const [metaSearchTerm, setMetaSearchTerm] = useState("");
  const [metaFilterSource, setMetaFilterSource] = useState("All");
  const [metaFilterStatus, setMetaFilterStatus] = useState("All");
  const [metaFilterProjectStatus, setMetaFilterProjectStatus] = useState("All");
  const [metaFilterVideoType, setMetaFilterVideoType] = useState("All");
  const [metaFilterLocation, setMetaFilterLocation] = useState("");
  const [metaFilterClosedBy, setMetaFilterClosedBy] = useState("All");
  const [metaFilterDateType, setMetaFilterDateType] = useState<"created_at" | "closed_at" | "delivery_date">("created_at");
  const [metaFromDate, setMetaFromDate] = useState("");
  const [metaToDate, setMetaToDate] = useState("");
  const [selectedMetaLeadIds, setSelectedMetaLeadIds] = useState<Set<string>>(new Set());

  const handleApplyMetaFilters = () => {
    const count = filteredMetaLeads.length;
    showToast(`Meta filters applied • ${count} lead${count === 1 ? "" : "s"} match`);
  };

  const handleClearMetaFilters = () => {
    setMetaSearchTerm("");
    setMetaFilterSource("All");
    setMetaFilterStatus("All");
    setMetaFilterProjectStatus("All");
    setMetaFilterVideoType("All");
    setMetaFilterLocation("");
    setMetaFilterClosedBy("All");
    setMetaFilterDateType("created_at");
    setMetaFromDate("");
    setMetaToDate("");
    showToast("Meta filters cleared");
  };

  // Selection & Bulk Actions
  const [selectedLeadIds, setSelectedLeadIds] = useState<Set<string>>(new Set());
  const [selectedRecycleBinIds, setSelectedRecycleBinIds] = useState<Set<string>>(new Set());

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [filterOrderStatus, setFilterOrderStatus] = useState<string>("COMPLETED");
  const [orderSearchTerm, setOrderSearchTerm] = useState("");
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  // Payment Tab PIN Security State
  const [isPaymentUnlocked, setIsPaymentUnlocked] = useState(false);
  const [showPaymentPinModal, setShowPaymentPinModal] = useState(false);
  const [paymentPinInput, setPaymentPinInput] = useState("");
  const [paymentPinError, setPaymentPinError] = useState("");
  const [isVerifyingPin, setIsVerifyingPin] = useState(false);
  const [showPaymentPin, setShowPaymentPin] = useState(false);
  const pendingOrdersCallbackRef = useRef<(() => void) | null>(null);

  const handleSelectOrdersTab = (callback?: () => void) => {
    if (isPaymentUnlocked) {
      setActiveTab("orders");
      if (callback) callback();
    } else {
      pendingOrdersCallbackRef.current = callback || null;
      setPaymentPinInput("");
      setPaymentPinError("");
      setShowPaymentPinModal(true);
    }
  };

  const handleUnlockPaymentPin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!paymentPinInput.trim()) {
      setPaymentPinError("Please enter the security PIN.");
      return;
    }

    setIsVerifyingPin(true);
    setPaymentPinError("");

    try {
      const res = await verifyPaymentPinServerFn({
        data: { pin: paymentPinInput },
      });

      if (res.success) {
        setIsPaymentUnlocked(true);
        setShowPaymentPinModal(false);
        setPaymentPinInput("");
        setPaymentPinError("");
        setActiveTab("orders");
        if (pendingOrdersCallbackRef.current) {
          pendingOrdersCallbackRef.current();
          pendingOrdersCallbackRef.current = null;
        }
      } else {
        setPaymentPinError(res.error || "Incorrect PIN. Please enter the valid security PIN.");
      }
    } catch (err: any) {
      setPaymentPinError(err?.message || "Failed to verify PIN with server.");
    } finally {
      setIsVerifyingPin(false);
    }
  };


  // Calendly Meetings State
  const [meetings, setMeetings] = useState<CalendlyMeeting[]>([]);
  const [meetingSearchTerm, setMeetingSearchTerm] = useState("");
  const [meetingStatusFilter, setMeetingStatusFilter] = useState<string>("all");
  const [isSendingTestMeeting, setIsSendingTestMeeting] = useState(false);
  const [calendlyWebhookCopied, setCalendlyWebhookCopied] = useState(false);

  // CRM Notifications State
  const [notifications, setNotifications] = useState<CRMNotification[]>([]);
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const [notificationFilter, setNotificationFilter] = useState<"all" | "unread" | "lead" | "meeting" | "order">("all");

  const unreadNotifsCount = useMemo(() => notifications.filter((n) => !n.is_read).length, [notifications]);
  const leadNotifs = useMemo(() => notifications.filter((n) => {
    const t = (n.type || "").toLowerCase();
    const title = (n.title || "").toLowerCase();
    return t.includes("lead") || t.includes("project") || title.includes("lead") || title.includes("project");
  }), [notifications]);

  const meetingNotifs = useMemo(() => notifications.filter((n) => {
    const t = (n.type || "").toLowerCase();
    const title = (n.title || "").toLowerCase();
    return t.includes("meeting") || t.includes("calendly") || title.includes("meeting") || title.includes("calendly") || title.includes("strategy call") || title.includes("call");
  }), [notifications]);

  const orderNotifs = useMemo(() => notifications.filter((n) => {
    const t = (n.type || "").toLowerCase();
    const title = (n.title || "").toLowerCase();
    return t.includes("order") || t.includes("payment") || t.includes("paypal") || title.includes("order") || title.includes("payment") || title.includes("paypal");
  }), [notifications]);

  const filteredNotificationsList = useMemo(() => {
    if (notificationFilter === "unread") return notifications.filter((n) => !n.is_read);
    if (notificationFilter === "lead") return leadNotifs;
    if (notificationFilter === "meeting") return meetingNotifs;
    if (notificationFilter === "order") return orderNotifs;
    return notifications;
  }, [notifications, notificationFilter, leadNotifs, meetingNotifs, orderNotifs]);

  // Activity & Login Logs State
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>([]);
  const [activityCategoryFilter, setActivityCategoryFilter] = useState<"all" | "calendly" | "leads" | "user_activity">("all");
  const [leadsActivitySubTab, setLeadsActivitySubTab] = useState<"website_manual" | "meta" | "all">("website_manual");
  const [activitySearchTerm, setActivitySearchTerm] = useState<string>("");

  // Super Admin CRM Settings State (with persistent local storage)
  const [crmPlatformTitle, setCrmPlatformTitle] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_platform_title") || "AI STUDIO USA - Enterprise CRM";
    }
    return "AI STUDIO USA - Enterprise CRM";
  });
  const [crmNotificationEmail, setCrmNotificationEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_notification_email") || "info@quickuppaistudio.us";
    }
    return "info@quickuppaistudio.us";
  });
  const [crmCurrency, setCrmCurrency] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_currency") || "USD ($)";
    }
    return "USD ($)";
  });
  const [crmSyncInterval, setCrmSyncInterval] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("crm_sync_interval")) || 10;
    }
    return 10;
  });
  const [crmAudioEnabled, setCrmAudioEnabled] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_audio_enabled") !== "false";
    }
    return true;
  });
  const [crmAccentTheme, setCrmAccentTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_accent_theme") || "slate";
    }
    return "slate";
  });
  const [crmDensity, setCrmDensity] = useState<"comfortable" | "compact">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("crm_density") as "comfortable" | "compact") || "comfortable";
    }
    return "comfortable";
  });
  const [crmHighContrast, setCrmHighContrast] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_high_contrast") === "true";
    }
    return false;
  });
  const [crmInactivityTimeout, setCrmInactivityTimeout] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("crm_inactivity_timeout")) || 10;
    }
    return 10;
  });
  const [crmLoginAttempts, setCrmLoginAttempts] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Number(localStorage.getItem("crm_login_attempts")) || 5;
    }
    return 5;
  });
  const [crmBroadcastBanner, setCrmBroadcastBanner] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("crm_broadcast_banner") || "";
    }
    return "";
  });
  const [crmBroadcastDraft, setCrmBroadcastDraft] = useState("");
  const [crmSettingsSaved, setCrmSettingsSaved] = useState(false);
  const [crmSettingsSubTab, setCrmSettingsSubTab] = useState<
    "crm_config" | "colors" | "export" | "permissions" | "records" | "reports" | "security"
  >("crm_config");

  // Strict Mutually Exclusive Classification for Activity Logs
  const classifiedLogs = useMemo(() => {
    return activityLogs.map((log) => {
      const act = (log.action || "").toLowerCase();
      const det = (log.details || "").toLowerCase();
      const perf = (log.performed_by || "").toLowerCase();

      // 1. Calendly / Strategy Call Category (STRICT)
      if (
        act.includes("calendly") ||
        act.includes("meeting") ||
        act.includes("strategy call") ||
        det.includes("calendly") ||
        det.includes("strategy call") ||
        det.includes("meeting") ||
        perf.includes("calendly")
      ) {
        return { log, category: "calendly" as const, isMeta: false };
      }

      // 2. User Activity / Authentication Category (STRICT)
      if (
        !log.lead_id &&
        (act.includes("logged in") ||
          act.includes("login") ||
          act.includes("logout") ||
          act.includes("user created") ||
          act.includes("admin user") ||
          act.includes("user status") ||
          act.includes("user deleted") ||
          act.includes("password") ||
          act.includes("security") ||
          det.includes("logged in from ip") ||
          det.includes("account created") ||
          det.includes("status changed to active") ||
          det.includes("status changed to inactive") ||
          det.includes("admin account deleted"))
      ) {
        return { log, category: "user_activity" as const, isMeta: false };
      }

      // 3. Leads Category (STRICT - NEVER Calendly, NEVER User Auth)
      let isMeta = false;
      if (
        act.includes("meta") ||
        det.includes("meta lead") ||
        det.includes("from meta") ||
        det.includes("meta ads")
      ) {
        isMeta = true;
      } else if (log.lead_id) {
        const foundLead = leads.find((l) => l.id === log.lead_id);
        if (foundLead && (foundLead.source?.toLowerCase().includes("meta") || Boolean(foundLead.meta_lead_id))) {
          isMeta = true;
        }
      }

      return { log, category: "leads" as const, isMeta };
    });
  }, [activityLogs, leads]);

  // 1. Calendly Logs
  const calendlyActivityLogs = useMemo(() => {
    return classifiedLogs.filter((c) => c.category === "calendly").map((c) => c.log);
  }, [classifiedLogs]);

  // 2. User Activity Logs
  const userActivityLogs = useMemo(() => {
    return classifiedLogs.filter((c) => c.category === "user_activity").map((c) => c.log);
  }, [classifiedLogs]);

  // 3. Leads Logs
  const leadsActivityLogs = useMemo(() => {
    return classifiedLogs.filter((c) => c.category === "leads").map((c) => c.log);
  }, [classifiedLogs]);

  // Sub-segregation: Meta Leads vs Website/Manual Leads
  const metaLeadsActivityLogs = useMemo(() => {
    return classifiedLogs.filter((c) => c.category === "leads" && c.isMeta).map((c) => c.log);
  }, [classifiedLogs]);

  const websiteLeadsActivityLogs = useMemo(() => {
    return classifiedLogs.filter((c) => c.category === "leads" && !c.isMeta).map((c) => c.log);
  }, [classifiedLogs]);

  const filteredActivityLogs = useMemo(() => {
    let list = activityLogs;
    if (activityCategoryFilter === "calendly") {
      list = calendlyActivityLogs;
    } else if (activityCategoryFilter === "user_activity") {
      list = userActivityLogs;
    } else if (activityCategoryFilter === "leads") {
      if (leadsActivitySubTab === "meta") {
        list = metaLeadsActivityLogs;
      } else if (leadsActivitySubTab === "website_manual") {
        list = websiteLeadsActivityLogs;
      } else {
        list = leadsActivityLogs;
      }
    }

    if (!activitySearchTerm.trim()) return list;
    const term = activitySearchTerm.toLowerCase();
    return list.filter(
      (log) =>
        (log.action || "").toLowerCase().includes(term) ||
        (log.details || "").toLowerCase().includes(term) ||
        (log.performed_by || "").toLowerCase().includes(term) ||
        (log.user_role || "").toLowerCase().includes(term)
    );
  }, [
    activityLogs,
    activityCategoryFilter,
    leadsActivitySubTab,
    calendlyActivityLogs,
    leadsActivityLogs,
    metaLeadsActivityLogs,
    websiteLeadsActivityLogs,
    userActivityLogs,
    activitySearchTerm,
  ]);

  // Admin Users Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);

  const uniqueAdminUsers = useMemo(() => {
    const map = new Map<string, AdminUser>();

    // 1. Guaranteed Super Admin entry
    map.set("sa@aistudio.com", {
      id: "usr_superadmin",
      name: "Super Admin",
      email: "sa@aistudio.com",
      role: "super_admin",
      status: "active",
      created_at: "System Protected",
    });

    // 2. Add DB admin accounts
    adminUsers.forEach((u) => {
      const cleanEmail = (u.email || "").toLowerCase().trim();
      if (!cleanEmail) return;
      if (cleanEmail === "sa@aistudio.com") return;
      if (!map.has(cleanEmail)) {
        map.set(cleanEmail, u);
      }
    });

    // 3. Guaranteed operational Admin entry if not already present
    if (!map.has("admin@aistudio.com")) {
      map.set("admin@aistudio.com", {
        id: "usr_admin_1",
        name: "Admin",
        email: "admin@aistudio.com",
        role: "admin",
        status: "active",
        created_at: "System Default",
      });
    }

    return Array.from(map.values());
  }, [adminUsers]);

  // Modals State
  const [showAddLeadModal, setShowAddLeadModal] = useState(false);
  const [prefillLeadFromMeeting, setPrefillLeadFromMeeting] = useState<Partial<Lead> | null>(null);
  const [viewLeadDetails, setViewLeadDetails] = useState<Lead | null>(null);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [closingLead, setClosingLead] = useState<Lead | null>(null);
  const [deliveringLead, setDeliveringLead] = useState<Lead | null>(null);
  const [showAddAdminModal, setShowAddAdminModal] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState<CalendlyMeeting | null>(null);
  const [cancellingMeeting, setCancellingMeeting] = useState<CalendlyMeeting | null>(null);
  const [cancellationReason, setCancellationReason] = useState<string>("");
  const [isSubmittingCancel, setIsSubmittingCancel] = useState<boolean>(false);
  const [selectedLeadForMsg, setSelectedLeadForMsg] = useState<Lead | null>(null);

  // Real-time Sync & Notification State
  const [lastSyncTime, setLastSyncTime] = useState<Date>(new Date());
  const [refreshCountdown, setRefreshCountdown] = useState<number>(10);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("ai_studio_sound_enabled") !== "false";
  });
  const [newLeadNotification, setNewLeadNotification] = useState<Lead | null>(null);
  const [newOrderNotification, setNewOrderNotification] = useState<Order | null>(null);
  const [highlightedLeadIds, setHighlightedLeadIds] = useState<Set<string>>(new Set());
  const [highlightedOrderIds, setHighlightedOrderIds] = useState<Set<string>>(new Set());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isSuperAdmin = session?.role === "super_admin";

  // Refs for real-time handlers
  const leadsRef = useRef<Lead[]>(leads);
  useEffect(() => {
    leadsRef.current = leads;
  }, [leads]);

  const ordersRef = useRef<Order[]>(orders);
  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  // Session Restore on initial mount
  useEffect(() => {
    const savedSession = localStorage.getItem("ai_studio_auth_session");
    if (savedSession) {
      try {
        const parsed: AuthSession = JSON.parse(savedSession);
        // ─── Session credential version gate ───────────────────────────────
        // Only the 3 authorised accounts are valid. Any old/stale session
        // (e.g. admin@aistudio.com, sa@aistudio.com, etc.) is wiped and the
        // user is forced back to the login screen immediately.
        const VALID_EMAILS = ["sa@aistudio.us", "admin@aistudio.us", "lm@aistudio.us"];
        const sessionEmail = (parsed.email || "").trim().toLowerCase();
        const isValidStaticEmail = VALID_EMAILS.includes(sessionEmail);
        // Dynamic DB users are also allowed (they won't be in VALID_EMAILS)
        // but must have a recognised role set by the server at login time.
        // Static check: if it looks like an old alias, boot them out.
        const isOldAlias =
          sessionEmail.endsWith("@aistudio.com") ||
          sessionEmail === "superadmin@quickuppaistudio.us" ||
          sessionEmail === "sa@quickuppaistudio.us" ||
          sessionEmail === "admin@quickuppaistudio.us" ||
          sessionEmail === "superadmin" ||
          sessionEmail === "admin" ||
          sessionEmail === "qsaistudio@gmail.com";
        if (isOldAlias || (!isValidStaticEmail && !parsed.role)) {
          // Wipe everything and drop to login
          localStorage.removeItem("ai_studio_auth_session");
          localStorage.removeItem("ai_studio_remembered_email");
          return;
        }
        // Migrate stale notification email cache
        const cachedEmail = localStorage.getItem("crm_notification_email");
        if (cachedEmail === "admin@quickuppaistudio.us") {
          localStorage.removeItem("crm_notification_email");
        }
        setSession(parsed);
        fetchAllData(false);
      } catch {
        localStorage.removeItem("ai_studio_auth_session");
      }
    } else {
      const savedEmail = localStorage.getItem("ai_studio_remembered_email");
      if (savedEmail) {
        setEmailInput(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  // URL search params sync (e.g. ?leadId=... or ?tab=...)
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const params = new URLSearchParams(window.location.search);
      const targetLeadId = params.get("leadId") || params.get("lead");
      if (targetLeadId && leads.length > 0) {
        const found = leads.find((l) => l.id === targetLeadId);
        if (found) {
          setViewLeadDetails(found);
        }
      }
      const tabParam = params.get("tab") as TabType | null;
      if (tabParam && tabParam !== activeTab) {
        setActiveTab(tabParam);
      }
    } catch {}
  }, [leads]);

  // Automatic Tab Guard: Ensure standard Admin is never stranded on a Super Admin-only tab
  useEffect(() => {
    if (session && session.role !== "super_admin" && (activeTab === "users" || activeTab === "security" || activeTab === "settings")) {
      setActiveTab("leads");
    }
    // Leads Manager: can only access leads, meta_leads, calendly, activity, recycle_bin, dashboard
    if (session && session.role === "leads_manager" && (activeTab === "orders" || activeTab === "users" || activeTab === "security" || activeTab === "settings")) {
      setActiveTab("leads");
    }
  }, [session, activeTab]);

  // Inactivity Auto-Logout for Super Admin & Admin (Configurable, defaults to 10 Minutes)
  useEffect(() => {
    if (!session) return;
    let timeoutId: NodeJS.Timeout;
    const timeoutMs = (crmInactivityTimeout || 10) * 60 * 1000;

    const resetInactivityTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        handleLogout();
        setAuthError(`You were automatically logged out due to ${crmInactivityTimeout || 10} minutes of inactivity.`);
      }, timeoutMs);
    };

    const activityEvents = ["mousemove", "mousedown", "keydown", "touchstart", "scroll", "click", "wheel"];
    activityEvents.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    resetInactivityTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
    };
  }, [session, crmInactivityTimeout]);

  // Real-Time Incoming Notifications
  const handleIncomingLead = (newLead: Lead) => {
    if (!newLead || !newLead.id) return;

    setLeads((prev) => {
      const exists = prev.some((l) => l.id === newLead.id);
      if (exists) {
        return prev.map((l) => (l.id === newLead.id ? newLead : l));
      }
      return [newLead, ...prev];
    });

    // Add to CRM Notifications Center
    const notifItem: CRMNotification = {
      id: `notif_lead_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: "lead_new",
      title: "New Lead Submitted",
      message: `${newLead.name} (${newLead.phone || "No phone"}) from ${newLead.source || "Website"} - ${newLead.video_type || "AI Video"}`,
      entity_id: newLead.id,
      actor: newLead.name,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notifItem, ...prev.filter((n) => n.entity_id !== newLead.id)]);

    setHighlightedLeadIds((prev) => new Set([...prev, newLead.id]));
    setTimeout(() => {
      setHighlightedLeadIds((prev) => {
        const next = new Set(prev);
        next.delete(newLead.id);
        return next;
      });
    }, 10000);

    if (soundEnabled) playNotificationChime();
    setNewLeadNotification(newLead);
    setLastSyncTime(new Date());

    setTimeout(() => {
      setNewLeadNotification((curr) => (curr?.id === newLead.id ? null : curr));
    }, 7000);
  };

  const handleIncomingOrder = (newOrder: Order) => {
    if (!newOrder || !newOrder.id) return;

    setOrders((prev) => {
      const exists = prev.some((o) => o.id === newOrder.id);
      if (exists) {
        return prev.map((o) => (o.id === newOrder.id ? newOrder : o));
      }
      return [newOrder, ...prev];
    });

    // Add to CRM Notifications Center
    const notifItem: CRMNotification = {
      id: `notif_order_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      type: "order_payment",
      title: "New Payment Received",
      message: `${newOrder.customer_name} completed payment of $${newOrder.amount} for ${newOrder.item_name}`,
      entity_id: newOrder.id,
      actor: newOrder.customer_name,
      is_read: false,
      created_at: new Date().toISOString(),
    };
    setNotifications((prev) => [notifItem, ...prev.filter((n) => n.entity_id !== newOrder.id)]);

    setHighlightedOrderIds((prev) => new Set([...prev, newOrder.id]));
    setTimeout(() => {
      setHighlightedOrderIds((prev) => {
        const next = new Set(prev);
        next.delete(newOrder.id);
        return next;
      });
    }, 10000);

    if (soundEnabled) playNotificationChime();
    setNewOrderNotification(newOrder);
    setLastSyncTime(new Date());

    setTimeout(() => {
      setNewOrderNotification((curr) => (curr?.id === newOrder.id ? null : curr));
    }, 7000);
  };

  // 10-Second Auto-Refresh & Cross-Tab Listeners
  useEffect(() => {
    if (!session) return;

    const countdownTimer = setInterval(() => {
      setRefreshCountdown((prev) => (prev <= 1 ? 10 : prev - 1));
    }, 1000);

    const intervalId = setInterval(() => {
      fetchAllData(true);
      setRefreshCountdown(10);
    }, 10000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchAllData(true);
        setRefreshCountdown(10);
      }
    };
    const handleFocus = () => {
      fetchAllData(true);
      setRefreshCountdown(10);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    let bcLeads: BroadcastChannel | null = null;
    let bcOrders: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bcLeads = new BroadcastChannel("ai_studio_leads_sync");
        bcLeads.onmessage = (event) => {
          if (event.data?.type === "NEW_LEAD" && event.data.lead) {
            handleIncomingLead(event.data.lead);
          } else {
            fetchAllData(true);
          }
        };

        bcOrders = new BroadcastChannel("ai_studio_orders_sync");
        bcOrders.onmessage = (event) => {
          if (event.data?.type === "NEW_ORDER" && event.data.order) {
            handleIncomingOrder(event.data.order);
          } else {
            fetchAllData(true);
          }
        };
      } catch (e) {
        console.warn("BroadcastChannel error:", e);
      }
    }

    const handleCustomLeadEvent = (e: Event) => {
      const ce = e as CustomEvent;
      if (ce.detail?.type === "NEW_LEAD" && ce.detail.lead) {
        handleIncomingLead(ce.detail.lead);
      } else {
        fetchAllData(true);
      }
    };
    window.addEventListener("ai_studio_lead_event", handleCustomLeadEvent);

    return () => {
      clearInterval(countdownTimer);
      clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      if (bcLeads) bcLeads.close();
      if (bcOrders) bcOrders.close();
      window.removeEventListener("ai_studio_lead_event", handleCustomLeadEvent);
    };
  }, [session, soundEnabled]);

  // Data Fetching
  const fetchAllData = async (silent = false) => {
    if (!silent) setLoading(true);
    else setIsSyncing(true);

    try {
      await Promise.all([
        fetchLeadsList(),
        fetchRecycleBinList(),
        fetchOrdersList(),
        fetchMeetingsList(),
        fetchNotificationsList(),
        fetchLogsList(),
        fetchAdminUsersList(),
      ]);
      setLastSyncTime(new Date());
    } finally {
      if (!silent) setLoading(false);
      setIsSyncing(false);
    }
  };

  const fetchLeadsList = async () => {
    try {
      const res = await fetchLeadsServerFn({ data: { includeDeleted: false } });
      if (res.success && res.leads) {
        setLeads(res.leads);
        localStorage.setItem("ai_studio_local_leads", JSON.stringify(res.leads));
      } else {
        const local = localStorage.getItem("ai_studio_local_leads");
        if (local) setLeads(JSON.parse(local));
      }
    } catch {
      const local = localStorage.getItem("ai_studio_local_leads");
      if (local) setLeads(JSON.parse(local));
    }
  };

  const fetchRecycleBinList = async () => {
    try {
      const res = await fetchLeadsServerFn({ data: { includeDeleted: true } });
      if (res.success && res.leads) {
        const deleted = res.leads.filter((l) => Boolean(l.deleted_at));
        setRecycleBinLeads(deleted);
      }
    } catch {}
  };

  const fetchOrdersList = async () => {
    try {
      const res = await fetchOrdersServerFn();
      if (res.success && res.orders) setOrders(res.orders);
    } catch {}
  };

  const [isSyncingCalendly, setIsSyncingCalendly] = useState(false);

  const fetchMeetingsList = async () => {
    try {
      const res = await fetchCalendlyMeetingsServerFn();
      if (res.success && res.meetings) setMeetings(res.meetings);
    } catch {}
  };

  const handleSyncCalendly = async () => {
    setIsSyncingCalendly(true);
    try {
      const res = await syncCalendlyEventsServerFn();
      if (res.success && res.meetings) {
        setMeetings(res.meetings);
        showToast(`Synced ${res.count || 0} scheduled events from Calendly`);
      } else {
        showToast(res.error || "Calendly sync failed", "error");
      }
    } catch (err: any) {
      showToast(err.message || "Failed to sync Calendly", "error");
    } finally {
      setIsSyncingCalendly(false);
    }
  };

  const fetchNotificationsList = async () => {
    try {
      const res = await fetchNotificationsServerFn({ data: { limit: 100 } });
      if (res.success && res.notifications && res.notifications.length > 0) {
        setNotifications(res.notifications);
      } else {
        // Fallback: Populate notifications from existing leads and meetings if DB table was empty
        const fallbackList: CRMNotification[] = [];
        leads.slice(0, 15).forEach((l) => {
          fallbackList.push({
            id: `notif_lead_${l.id}`,
            type: "lead_new",
            title: "Website Lead Recorded",
            message: `${l.name} (${l.phone || "No phone"}) from ${l.source} - ${l.video_type || "AI Video"}`,
            entity_id: l.id,
            actor: l.name,
            is_read: false,
            created_at: l.created_at || new Date().toISOString(),
          });
        });
        meetings.slice(0, 10).forEach((m) => {
          fallbackList.push({
            id: `notif_meet_${m.id}`,
            type: m.meeting_status === "cancelled" ? "meeting_cancelled" : "meeting_new",
            title: m.meeting_status === "cancelled" ? "Calendly Meeting Cancelled" : "Calendly Strategy Call",
            message: `${m.client_name} · ${m.meeting_date} at ${m.meeting_time} (${m.meeting_status})`,
            entity_id: m.id,
            actor: m.client_name,
            is_read: false,
            created_at: m.created_at || new Date().toISOString(),
          });
        });
        fallbackList.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        if (fallbackList.length > 0) {
          setNotifications((curr) => (curr.length > 0 ? curr : fallbackList));
        }
      }
    } catch {}
  };

  const fetchLogsList = async () => {
    try {
      const [actRes, logRes] = await Promise.all([
        fetchActivityLogsServerFn({ data: 100 }),
        fetchLoginLogsServerFn({ data: 100 }),
      ]);
      if (actRes.success && actRes.logs) setActivityLogs(actRes.logs);
      if (logRes.success && logRes.logs) setLoginLogs(logRes.logs);
    } catch {}
  };

  const fetchAdminUsersList = async () => {
    try {
      const res = await fetchAdminUsersServerFn();
      if (res.success && res.users) {
        setAdminUsers(res.users);
      }
    } catch {}
  };

  // Authentication Handler with IP/Security Tracking
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();

    // 1. Static credentials — exactly 3 authorized users
    let authRole: "super_admin" | "admin" | "leads_manager" | null = null;
    let authName = "Admin";

    if (cleanEmail === "sa@aistudio.us" && cleanPass === "Anay@8080") {
      authRole = "super_admin";
      authName = "Super Admin";
    } else if (cleanEmail === "admin@aistudio.us" && cleanPass === "Admin@123") {
      authRole = "admin";
      authName = "Admin";
    } else if (cleanEmail === "lm@aistudio.us" && cleanPass === "leads@123") {
      authRole = "leads_manager";
      authName = "Leads Manager";
    } else {
      // 2. Check dynamically registered admin users in database/local state
      const dynamicUser = adminUsers.find(
        (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass && u.status === "active"
      );
      if (dynamicUser) {
        authRole = dynamicUser.role;
        authName = dynamicUser.name;
      }
    }

    if (authRole) {
      const userSession: AuthSession = {
        email: cleanEmail,
        name: authName,
        role: authRole,
      };

      setSession(userSession);
      setActiveTab("leads");
      localStorage.setItem("ai_studio_auth_session", JSON.stringify(userSession));

      if (rememberMe) {
        localStorage.setItem("ai_studio_remembered_email", cleanEmail);
      } else {
        localStorage.removeItem("ai_studio_remembered_email");
      }

      setAuthError("");
      fetchAllData(false);

      // Record Login Audit Log with Real IP & Geolocation
      try {
        let ipAddress = "127.0.0.1";
        let location = "USA / Web Client";
        try {
          const ipRes = await fetch("https://api.ipify.org?format=json");
          const ipData = await ipRes.json();
          if (ipData?.ip) {
            ipAddress = ipData.ip;
            try {
              const geoRes = await fetch(`https://ipwho.is/${ipAddress}`);
              const geoData = await geoRes.json();
              if (geoData && geoData.success !== false) {
                const parts = [geoData.city, geoData.region, geoData.country].filter(Boolean);
                if (parts.length > 0) {
                  location = parts.join(", ");
                }
              }
            } catch {
              location = "USA / Web Client";
            }
          }
        } catch {}

        await recordLoginLogServerFn({
          data: {
            email: cleanEmail,
            role: authRole,
            ip_address: ipAddress,
            location,
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "Web Browser",
            status: "success",
          },
        });
      } catch {}
    } else {
      setAuthError("Invalid credentials. Please verify your email and password.");
      try {
        await recordLoginLogServerFn({
          data: {
            email: cleanEmail,
            role: "unknown",
            ip_address: "Unknown IP",
            location: "Failed Attempt",
            user_agent: typeof navigator !== "undefined" ? navigator.userAgent : "Web Browser",
            status: "failed",
          },
        });
      } catch {}
    }
  };

  const handleLogout = () => {
    setSession(null);
    setActiveTab("leads");
    setSelectedLeadIds(new Set());
    setMetaSelectedLeadIds(new Set());
    setViewLeadDetails(null);
    setEditLeadModal(null);
    setShowAddLeadModal(null);
    setShowAddAdminModal(false);
    setShowSecurityModal(false);
    localStorage.removeItem("ai_studio_auth_session");
    const savedEmail = localStorage.getItem("ai_studio_remembered_email");
    if (savedEmail) {
      setEmailInput(savedEmail);
      setPasswordInput("");
      setRememberMe(true);
    } else {
      setEmailInput("");
      setPasswordInput("");
      setRememberMe(false);
    }
  };

  // Lead Actions
  const handleUpdateLeadStatus = async (
    lead: Lead,
    newStatus: LeadStatus,
    extra?: { deliveryDate?: string }
  ) => {
    if (newStatus === "Closed" && !extra?.deliveryDate) {
      // Prompt Closed Lead Modal to require Delivery Date
      setClosingLead(lead);
      return;
    }

    const updated = leads.map((l) =>
      l.id === lead.id
        ? {
            ...l,
            status: newStatus,
            closed_by: newStatus === "Closed" ? session?.name || "Admin" : l.closed_by,
            closed_at: newStatus === "Closed" ? new Date().toISOString() : l.closed_at,
            delivery_date: extra?.deliveryDate || l.delivery_date,
          }
        : l
    );
    setLeads(updated);
    localStorage.setItem("ai_studio_local_leads", JSON.stringify(updated));
    broadcastLeadEvent({ type: "UPDATE_LEAD", id: lead.id });

    try {
      await updateLeadStatusServerFn({
        data: {
          id: lead.id,
          status: newStatus,
          closedBy: session?.name || session?.email || "Admin",
          deliveryDate: extra?.deliveryDate,
          userRole: session?.role || "admin",
        },
      });
      showToast(`Lead status changed to ${newStatus}`);
      fetchLogsList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateProjectStatus = async (
    lead: Lead,
    newProjectStatus: ProjectStatus,
    deliveryDate?: string
  ) => {
    if (newProjectStatus === "Delivered" && !lead.delivery_date && !deliveryDate) {
      setDeliveringLead(lead);
      return;
    }

    const updated = leads.map((l) =>
      l.id === lead.id
        ? {
            ...l,
            project_status: newProjectStatus,
            delivered_at: newProjectStatus === "Delivered" ? new Date().toISOString() : l.delivered_at,
            delivery_date: deliveryDate || l.delivery_date,
          }
        : l
    );
    setLeads(updated);
    localStorage.setItem("ai_studio_local_leads", JSON.stringify(updated));
    broadcastLeadEvent({ type: "UPDATE_LEAD", id: lead.id });

    try {
      await updateProjectStatusServerFn({
        data: {
          id: lead.id,
          projectStatus: newProjectStatus,
          deliveryDate: deliveryDate || lead.delivery_date,
          performedBy: session?.name || session?.email || "Admin",
          userRole: session?.role || "admin",
        },
      });
      showToast(`Project status set to ${newProjectStatus}`);
      fetchLogsList();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSoftDeleteLead = async (id: string) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      const target = leads.find((l) => l.id === id);
      const updated = leads.filter((l) => l.id !== id);
      setLeads(updated);
      if (target) setRecycleBinLeads((prev) => [{ ...target, deleted_at: new Date().toISOString() }, ...prev]);
      localStorage.setItem("ai_studio_local_leads", JSON.stringify(updated));
      broadcastLeadEvent({ type: "DELETE_LEAD", id });

      try {
        await softDeleteLeadServerFn({
          data: {
            id,
            performedBy: session?.name || session?.email || "Admin",
            userRole: session?.role || "admin",
          },
        });
        showToast("Lead moved to Recycle Bin");
        fetchLogsList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleRestoreLead = async (id: string) => {
    const target = recycleBinLeads.find((l) => l.id === id);
    setRecycleBinLeads((prev) => prev.filter((l) => l.id !== id));
    if (target) {
      const restored = { ...target, deleted_at: null };
      setLeads((prev) => [restored, ...prev]);
    }
    broadcastLeadEvent({ type: "RESTORE_LEAD", id });

    try {
      await restoreLeadServerFn({
        data: {
          id,
          performedBy: session?.name || session?.email || "Admin",
          userRole: session?.role || "admin",
        },
      });
      showToast("Lead restored successfully");
      fetchLogsList();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePermanentDeleteLead = async (id: string) => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can permanently delete records.");
      return;
    }
    if (confirm("WARNING: This will permanently delete this lead from the database. This action cannot be undone. Continue?")) {
      setRecycleBinLeads((prev) => prev.filter((l) => l.id !== id));
      try {
        await permanentDeleteLeadServerFn({
          data: {
            id,
            performedBy: session?.name || session?.email || "Super Admin",
            userRole: "super_admin",
          },
        });
        showToast("Lead permanently deleted");
        fetchLogsList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Recycle Bin Bulk Handlers
  const handleSelectAllRecycleBin = (checked: boolean) => {
    if (checked) {
      setSelectedRecycleBinIds(new Set(recycleBinLeads.map((l) => l.id)));
    } else {
      setSelectedRecycleBinIds(new Set());
    }
  };

  const handleToggleSelectRecycleBin = (id: string) => {
    setSelectedRecycleBinIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkRestoreRecycleBin = async () => {
    if (selectedRecycleBinIds.size === 0) return;
    const ids = Array.from(selectedRecycleBinIds);
    if (confirm(`Restore ${ids.length} selected leads back to active leads?`)) {
      const restored = recycleBinLeads.filter((l) => selectedRecycleBinIds.has(l.id));
      setRecycleBinLeads((prev) => prev.filter((l) => !selectedRecycleBinIds.has(l.id)));
      setLeads((prev) => [...restored.map((l) => ({ ...l, deleted_at: null })), ...prev]);
      setSelectedRecycleBinIds(new Set());
      try {
        await bulkRestoreLeadsServerFn({
          data: {
            ids,
            performedBy: session?.name || "Admin",
            userRole: session?.role || "admin",
          },
        });
        showToast(`Restored ${ids.length} leads from Recycle Bin`);
        fetchLeadsList();
        fetchLogsList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleBulkPermanentDeleteRecycleBin = async () => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can permanently delete records.");
      return;
    }
    if (selectedRecycleBinIds.size === 0) return;
    const ids = Array.from(selectedRecycleBinIds);
    if (confirm(`WARNING: Permanently erase ${ids.length} selected leads from the database? This action CANNOT be undone.`)) {
      setRecycleBinLeads((prev) => prev.filter((l) => !selectedRecycleBinIds.has(l.id)));
      setSelectedRecycleBinIds(new Set());
      try {
        await bulkPermanentDeleteLeadsServerFn({
          data: {
            ids,
            performedBy: session?.name || "Super Admin",
            userRole: "super_admin",
          },
        });
        showToast(`Permanently deleted ${ids.length} leads`);
        fetchLogsList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEmptyRecycleBin = async () => {
    if (!isSuperAdmin) {
      alert("Only Super Admin can empty the Recycle Bin.");
      return;
    }
    if (recycleBinLeads.length === 0) return;
    if (confirm(`CRITICAL WARNING: This will permanently erase ALL ${recycleBinLeads.length} leads currently in the Recycle Bin. This action CANNOT be recovered. Proceed?`)) {
      const total = recycleBinLeads.length;
      setRecycleBinLeads([]);
      setSelectedRecycleBinIds(new Set());
      try {
        await emptyRecycleBinServerFn({
          data: {
            performedBy: session?.name || "Super Admin",
            userRole: "super_admin",
          },
        });
        showToast(`Recycle Bin emptied (${total} records permanently erased)`);
        fetchLogsList();
      } catch (err) {
        console.error(err);
      }
    }
  };

  // Bulk Actions
  const handleSelectAllLeads = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredLeads.map((l) => l.id));
      setSelectedLeadIds(allIds);
    } else {
      setSelectedLeadIds(new Set());
    }
  };

  const handleToggleSelectLead = (id: string) => {
    setSelectedLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkStatusChange = async (newStatus: LeadStatus) => {
    if (selectedLeadIds.size === 0) return;
    if (confirm(`Change status of ${selectedLeadIds.size} selected leads to "${newStatus}"?`)) {
      for (const id of Array.from(selectedLeadIds)) {
        const lead = leads.find((l) => l.id === id);
        if (lead) await handleUpdateLeadStatus(lead, newStatus);
      }
      setSelectedLeadIds(new Set());
      showToast(`Updated ${selectedLeadIds.size} leads to ${newStatus}`);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedLeadIds.size === 0) return;
    if (confirm(`Move ${selectedLeadIds.size} selected leads to Recycle Bin?`)) {
      for (const id of Array.from(selectedLeadIds)) {
        await softDeleteLeadLeadServerFnWrapper(id);
      }
      setSelectedLeadIds(new Set());
      showToast(`Moved ${selectedLeadIds.size} leads to Recycle Bin`);
    }
  };

  // Meta Leads Bulk Handlers
  const handleSelectAllMetaLeads = (checked: boolean) => {
    if (checked) {
      const allIds = new Set(filteredMetaLeads.map((l) => l.id));
      setSelectedMetaLeadIds(allIds);
    } else {
      setSelectedMetaLeadIds(new Set());
    }
  };

  const handleToggleSelectMetaLead = (id: string) => {
    setSelectedMetaLeadIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBulkMetaStatusChange = async (newStatus: LeadStatus) => {
    if (selectedMetaLeadIds.size === 0) return;
    if (confirm(`Change status of ${selectedMetaLeadIds.size} selected Meta leads to "${newStatus}"?`)) {
      for (const id of Array.from(selectedMetaLeadIds)) {
        const lead = leads.find((l) => l.id === id);
        if (lead) await handleUpdateLeadStatus(lead, newStatus);
      }
      setSelectedMetaLeadIds(new Set());
      showToast(`Updated ${selectedMetaLeadIds.size} Meta leads to ${newStatus}`);
    }
  };

  const handleBulkMetaDelete = async () => {
    if (selectedMetaLeadIds.size === 0) return;
    if (confirm(`Move ${selectedMetaLeadIds.size} selected Meta leads to Recycle Bin?`)) {
      for (const id of Array.from(selectedMetaLeadIds)) {
        await softDeleteLeadLeadServerFnWrapper(id);
      }
      setSelectedMetaLeadIds(new Set());
      showToast(`Moved ${selectedMetaLeadIds.size} Meta leads to Recycle Bin`);
    }
  };

  const softDeleteLeadLeadServerFnWrapper = async (id: string) => {
    const target = leads.find((l) => l.id === id);
    setLeads((prev) => prev.filter((l) => l.id !== id));
    if (target) setRecycleBinLeads((prev) => [{ ...target, deleted_at: new Date().toISOString() }, ...prev]);
    try {
      await softDeleteLeadServerFn({
        data: {
          id,
          performedBy: session?.name || "Admin",
          userRole: session?.role || "admin",
        },
      });
    } catch {}
  };

  // Helper Functions
  const isLeadUsa = (_lead: Lead | null | undefined): boolean => {
    return true;
  };

  const sanitizePhoneNumber = (phone: string, _isUsa: boolean = true) => {
    let clean = (phone || "").replace(/[^0-9]/g, "");
    if (clean.length === 10) {
      clean = `1${clean}`;
    }
    return clean;
  };

  const getAdminWhatsAppPlainText = (lead: Lead) => {
    let msg = `Hi ${lead.name},\n\nThank you for reaching out to Quickupp AI Studio USA.\n\nWe have received your AI Video Production inquiry with the following details:\n\nClient Name: ${lead.name}`;
    if (lead.business) msg += `\nBusiness / Brand: ${lead.business}`;
    if (lead.video_type) msg += `\nVideo Format: ${lead.video_type}`;
    if (lead.video_quantity) msg += `\nVideo Quantity: ${lead.video_quantity}`;
    if (lead.location) msg += `\nLocation: ${lead.location}`;
    if (lead.requirement || lead.additional) msg += `\nProject Scope: ${lead.requirement || lead.additional}`;

    msg += `\n\nOur team is reviewing your requirements and preparing custom sample concepts, video reels, and a tailored quote for your project.\n\nCould you please confirm if you have a target turnaround timeline or any reference video links in mind?\n\nQuickupp AI Studio USA\nWebsite: https://quickuppaistudio.us\nAddress: 8 The Green, Suite A, Dover, Delaware - 19901, USA\nEmail: info@quickuppaistudio.us`;
    return msg;
  };

  const handleOpenWhatsApp = (lead: Lead) => {
    setSelectedLeadForMsg(lead);
    const text = getAdminWhatsAppPlainText(lead);
    const phone = sanitizePhoneNumber(lead.phone, true);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const exportCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly
      ? filteredLeads.filter((l) => selectedLeadIds.has(l.id))
      : filteredLeads;

    if (!listToExport.length) return alert("No leads to export.");
    const headers = [
      "ID",
      "Source",
      "Client Name",
      "Business Name",
      "Phone",
      "Email",
      "Video Type",
      "Video Quantity",
      "Location",
      "Lead Status",
      "Project Status",
      "Closed By",
      "Closed Date",
      "Delivery Date",
      "Meeting Date",
      "Internal Notes",
      "Created At",
    ];
    const rows = listToExport.map((l) => [
      l.id,
      `"${l.source}"`,
      `"${l.name}"`,
      `"${l.business}"`,
      `"${l.phone}"`,
      `"${l.email || ""}"`,
      `"${l.video_type}"`,
      `"${l.video_quantity || 1}"`,
      `"${l.location || ""}"`,
      l.status,
      l.project_status || "In Progress",
      `"${l.closed_by || ""}"`,
      `"${l.closed_at ? new Date(l.closed_at).toLocaleDateString() : ""}"`,
      `"${l.delivery_date || ""}"`,
      `"${l.meeting_date || ""}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      new Date(l.created_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai_studio_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportMetaCSV = (selectedOnly = false) => {
    const listToExport = selectedOnly
      ? filteredMetaLeads.filter((l) => selectedMetaLeadIds.has(l.id))
      : filteredMetaLeads;

    if (!listToExport.length) return alert("No Meta leads to export.");
    const headers = [
      "ID",
      "Source",
      "Client Name",
      "Business Name",
      "Phone",
      "Email",
      "Video Type",
      "Video Quantity",
      "Location",
      "Lead Status",
      "Project Status",
      "Closed By",
      "Closed Date",
      "Delivery Date",
      "Internal Notes",
      "Created At",
    ];
    const rows = listToExport.map((l) => [
      l.id,
      `"${l.source}"`,
      `"${l.name}"`,
      `"${l.business}"`,
      `"${l.phone}"`,
      `"${l.email || ""}"`,
      `"${l.video_type}"`,
      `"${l.video_quantity || 1}"`,
      `"${l.location || ""}"`,
      l.status,
      l.project_status || "In Progress",
      `"${l.closed_by || ""}"`,
      `"${l.closed_at ? new Date(l.closed_at).toLocaleDateString() : ""}"`,
      `"${l.delivery_date || ""}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      new Date(l.created_at).toLocaleString(),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `meta_leads_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${listToExport.length} Meta leads`);
  };

  // 1-Click Complete System Export Center Handlers
  const exportOrdersCSV = () => {
    if (!orders.length) return alert("No payment orders found to export.");
    const headers = [
      "Order ID",
      "Customer Name",
      "Customer Email",
      "Customer Phone",
      "Service Name",
      "Amount",
      "Currency",
      "Payment Status",
      "PayPal Order ID",
      "Created At",
    ];
    const rows = orders.map((o) => [
      `"${o.id}"`,
      `"${o.customer_name || ""}"`,
      `"${o.customer_email || ""}"`,
      `"${o.customer_phone || ""}"`,
      `"${o.service_name || ""}"`,
      o.amount,
      `"${o.currency || "USD"}"`,
      `"${o.payment_status || ""}"`,
      `"${o.paypal_order_id || ""}"`,
      `"${new Date(o.created_at).toLocaleString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ai_studio_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${orders.length} orders to CSV`);
  };

  const exportMeetingsCSV = () => {
    if (!meetings.length) return alert("No Calendly meetings found to export.");
    const headers = [
      "Meeting ID",
      "Event Name",
      "Invitee Name",
      "Invitee Email",
      "Start Time",
      "End Time",
      "Status",
      "Assigned Admin",
      "Join URL",
      "Created At",
    ];
    const rows = meetings.map((m) => [
      `"${m.id}"`,
      `"${m.event_name || "Strategy Session"}"`,
      `"${m.invitee_name || ""}"`,
      `"${m.invitee_email || ""}"`,
      `"${m.start_time ? new Date(m.start_time).toLocaleString() : ""}"`,
      `"${m.end_time ? new Date(m.end_time).toLocaleString() : ""}"`,
      `"${m.status || "active"}"`,
      `"${m.assigned_admin || ""}"`,
      `"${m.join_url || ""}"`,
      `"${new Date(m.created_at).toLocaleString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `calendly_meetings_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${meetings.length} scheduled meetings`);
  };

  const exportActivityCSV = () => {
    if (!activityLogs.length) return alert("No activity history logs found to export.");
    const headers = [
      "Log ID",
      "Action Type",
      "Details / Description",
      "Admin Email",
      "IP Address",
      "Timestamp",
    ];
    const rows = activityLogs.map((log) => [
      `"${log.id}"`,
      `"${log.action || ""}"`,
      `"${(log.details || "").replace(/"/g, '""')}"`,
      `"${log.performed_by || log.admin_email || ""}"`,
      `"${log.ip_address || ""}"`,
      `"${new Date(log.timestamp).toLocaleString()}"`,
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `activity_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported ${activityLogs.length} audit trail logs`);
  };

  const exportAllLeadsMasterCSV = () => {
    if (!leads.length) return alert("No leads found in database to export.");
    const headers = [
      "ID",
      "Source",
      "Client Name",
      "Business Name",
      "Phone",
      "Email",
      "Video Type",
      "Video Quantity",
      "Location",
      "Lead Status",
      "Project Status",
      "Closed By",
      "Closed Date",
      "Delivery Date",
      "Meeting Date",
      "Internal Notes",
      "Created At",
    ];
    const rows = leads.map((l) => [
      l.id,
      `"${l.source}"`,
      `"${l.name}"`,
      `"${l.business}"`,
      `"${l.phone}"`,
      `"${l.email || ""}"`,
      `"${l.video_type}"`,
      `"${l.video_quantity || 1}"`,
      `"${l.location || ""}"`,
      l.status,
      l.project_status || "In Progress",
      `"${l.closed_by || ""}"`,
      `"${l.closed_at ? new Date(l.closed_at).toLocaleDateString() : ""}"`,
      `"${l.delivery_date || ""}"`,
      `"${l.meeting_date || ""}"`,
      `"${(l.notes || "").replace(/"/g, '""')}"`,
      new Date(l.created_at).toLocaleString(),
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `all_inbound_leads_master_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Exported all ${leads.length} master leads`);
  };

  const exportFullBackupJSON = () => {
    const backupData = {
      system: "AI STUDIO USA CRM - Enterprise Production Database Snapshot",
      exported_at: new Date().toISOString(),
      exported_by: session?.email || "Super Admin",
      version: "2.4.0",
      database_engine: "SQLite Enterprise Local DB",
      counts: {
        total_active_leads: leads.length,
        recycle_bin_leads: recycleBinLeads.length,
        total_payment_orders: orders.length,
        total_calendly_meetings: meetings.length,
        total_activity_logs: activityLogs.length,
        total_login_logs: loginLogs.length,
        admin_users: adminUsers.length,
      },
      collections: {
        leads,
        recycle_bin: recycleBinLeads,
        orders,
        meetings,
        activity_logs: activityLogs,
        login_logs: loginLogs,
        admin_users: adminUsers.map((u) => ({
          id: u.id,
          email: u.email,
          role: u.role,
          status: u.status,
          created_at: u.created_at,
        })),
      },
    };

    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const link = document.createElement("a");
    link.setAttribute("href", jsonStr);
    link.setAttribute("download", `ai_studio_master_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast("Master Database JSON Backup downloaded successfully");
  };

  const playTestChime = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) {
        showToast("Audio playback not supported in browser");
        return;
      }
      const audioCtx = new AudioCtx();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      osc.frequency.setValueAtTime(880, audioCtx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
      showToast("Notification chime test played");
    } catch {
      showToast("Could not play audio chime preview");
    }
  };

  const handleSaveCrmSettings = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("crm_platform_title", crmPlatformTitle);
      localStorage.setItem("crm_notification_email", crmNotificationEmail);
      localStorage.setItem("crm_currency", crmCurrency);
      localStorage.setItem("crm_sync_interval", crmSyncInterval.toString());
      localStorage.setItem("crm_audio_enabled", crmAudioEnabled ? "true" : "false");
      localStorage.setItem("crm_accent_theme", crmAccentTheme);
      localStorage.setItem("crm_density", crmDensity);
      localStorage.setItem("crm_high_contrast", crmHighContrast ? "true" : "false");
      localStorage.setItem("crm_inactivity_timeout", crmInactivityTimeout.toString());
      localStorage.setItem("crm_login_attempts", crmLoginAttempts.toString());
      localStorage.setItem("crm_broadcast_banner", crmBroadcastBanner);
    }
    setCrmSettingsSaved(true);
    setTimeout(() => setCrmSettingsSaved(false), 3000);
    showToast("CRM Settings saved successfully");
  };

  const handlePublishBroadcastBanner = () => {
    setCrmBroadcastBanner(crmBroadcastDraft);
    if (typeof window !== "undefined") {
      localStorage.setItem("crm_broadcast_banner", crmBroadcastDraft);
    }
    showToast(crmBroadcastDraft ? "Broadcast alert published across CRM" : "Broadcast alert cleared");
  };

  const isToday = (dateStr?: string) => {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    const today = new Date();
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  };

  // Status Badge Colors (Matching Document Specification)
  const getLeadStatusBadge = (status: LeadStatus) => {
    switch (status) {
      case "New":
        return isDark
          ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
          : "bg-blue-50 text-blue-700 border-blue-200";
      case "Contacted":
        return isDark
          ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/40"
          : "bg-yellow-50 text-yellow-800 border-yellow-300";
      case "In Progress":
        return isDark
          ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
          : "bg-orange-50 text-orange-700 border-orange-200";
      case "Hold":
        return isDark
          ? "bg-gray-500/20 text-gray-300 border-gray-500/40"
          : "bg-slate-100 text-slate-700 border-slate-300";
      case "Closed":
        return isDark
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  const getProjectStatusBadge = (status?: ProjectStatus) => {
    switch (status) {
      case "Hold":
        return isDark
          ? "bg-gray-500/20 text-gray-300 border-gray-500/40"
          : "bg-slate-100 text-slate-700 border-slate-300";
      case "In Progress":
        return isDark
          ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
          : "bg-orange-50 text-orange-700 border-orange-200";
      case "Delivered":
        return isDark
          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
          : "bg-emerald-50 text-emerald-700 border-emerald-200";
      default:
        return isDark
          ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
          : "bg-orange-50 text-orange-700 border-orange-200";
    }
  };

  const getLeadSourceDisplay = (source: string): "USA Website" | "Meta" | "Manual" | "Calendly" => {
    if (!source) return "USA Website";
    const s = source.toLowerCase();
    if (s.includes("meta") || s.includes("facebook") || s.includes("instagram")) return "Meta";
    if (s.includes("manual")) return "Manual";
    if (s.includes("calendly")) return "Calendly";
    return "USA Website";
  };

  const getLeadSourceBadgeClass = (source: string) => {
    const type = getLeadSourceDisplay(source);
    switch (type) {
      case "USA Website":
        return isDark
          ? "border-blue-500/40 bg-blue-500/15 text-blue-300"
          : "border-blue-200 bg-blue-50 text-blue-700";
      case "Meta":
        return isDark
          ? "border-sky-500/40 bg-sky-500/15 text-sky-300"
          : "border-sky-200 bg-sky-50 text-sky-700";
      case "Manual":
        return isDark
          ? "border-purple-500/40 bg-purple-500/15 text-purple-300"
          : "border-purple-200 bg-purple-50 text-purple-700";
      case "Calendly":
        return isDark
          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-300"
          : "border-emerald-200 bg-emerald-50 text-emerald-700";
    }
  };

  // Helper to identify Meta Leads
  const isMetaLead = (lead: Lead) => {
    const s = (lead.source || "").toLowerCase().trim();
    return (
      s.includes("meta") ||
      s.includes("facebook") ||
      s.includes("instagram") ||
      s.includes("fb_") ||
      s.includes("ig_")
    );
  };

  // Helper to identify India Leads (never convert, strictly remove from USA CRM)
  const isIndiaLead = (lead: Lead) => {
    const s = (lead.source || "").toLowerCase().trim();
    const loc = (lead.location || "").toLowerCase().trim();
    const phone = (lead.phone || "").replace(/\D/g, "");
    return (
      s.includes("india") ||
      s.includes("in -") ||
      s === "contact form" ||
      s === "popup modal" ||
      loc.includes("india") ||
      loc.includes("bharat") ||
      (phone.startsWith("91") && phone.length === 12 && !lead.phone.startsWith("+1"))
    );
  };

  // Helper to match a Calendly meeting to an existing lead by Email, Phone, or Client Name (Section 14)
  const findMatchingLeadForMeeting = (meeting: CalendlyMeeting): Lead | undefined => {
    const meetingEmail = (meeting.email || "").toLowerCase().trim();
    const meetingPhone = (meeting.phone || "").replace(/\D/g, "").slice(-10);
    const meetingName = (meeting.client_name || "").toLowerCase().trim();

    return leads.find((l) => {
      if (isIndiaLead(l)) return false;
      const leadEmail = (l.email || "").toLowerCase().trim();
      const leadPhone = (l.phone || "").replace(/\D/g, "").slice(-10);
      const leadName = (l.name || "").toLowerCase().trim();

      // 1. Match by Email
      if (meetingEmail && leadEmail && meetingEmail === leadEmail) return true;
      // 2. Match by Phone (last 10 digits)
      if (meetingPhone && meetingPhone.length >= 7 && leadPhone && leadPhone.length >= 7 && meetingPhone === leadPhone) return true;
      // 3. Match by Client Name
      if (meetingName && leadName && (meetingName === leadName || leadName.includes(meetingName) || meetingName.includes(leadName))) return true;

      return false;
    });
  };

  // Distinct Leads Collections: Website Leads (Tab 1) and Meta Leads (Tab 2) - strictly excluding India leads
  const websiteLeads = useMemo(() => {
    return leads.filter((l) => !isMetaLead(l) && !isIndiaLead(l));
  }, [leads]);

  const metaLeads = useMemo(() => {
    return leads.filter((l) => isMetaLead(l) && !isIndiaLead(l));
  }, [leads]);

  // Filtered Website Leads Calculation (Tab 1: Leads Management)
  const filteredLeads = useMemo(() => {
    return websiteLeads
      .filter((lead) => {
        // 1. Source Filter (USA Website, Manual, Calendly)
        let matchesSource = true;
        if (filterSource !== "All" && filterSource.trim() !== "") {
          const rawSrc = (lead.source || "").toLowerCase().trim();
          const targetSrc = filterSource.toLowerCase().trim();
          const categorySrc = getLeadSourceDisplay(lead.source).toLowerCase();
          matchesSource =
            rawSrc === targetSrc ||
            categorySrc === targetSrc ||
            (targetSrc.includes("usa") && (rawSrc.includes("usa") || categorySrc.includes("usa"))) ||
            (targetSrc.includes("manual") && rawSrc.includes("manual")) ||
            (targetSrc.includes("calendly") && rawSrc.includes("calendly"));
        }

        // 2. Lead Status Filter
        let matchesStatus = true;
        if (filterStatus !== "All" && filterStatus.trim() !== "") {
          const st = (lead.status || "").toLowerCase().replace(/[\s_-]/g, "");
          const fst = filterStatus.toLowerCase().replace(/[\s_-]/g, "");
          matchesStatus = st === fst || (st.includes("progress") && fst.includes("progress"));
        }

        // 3. Project Status Filter
        let matchesProjStatus = true;
        if (filterProjectStatus !== "All" && filterProjectStatus.trim() !== "") {
          const ps = (lead.project_status || "In Progress").toLowerCase().replace(/[\s_-]/g, "");
          const fps = filterProjectStatus.toLowerCase().replace(/[\s_-]/g, "");
          matchesProjStatus = ps === fps || (ps.includes("progress") && fps.includes("progress"));
        }

        // 4. Video Type Filter
        let matchesVideoType = true;
        if (filterVideoType !== "All" && filterVideoType.trim() !== "") {
          const vt = (lead.video_type || "").toLowerCase().replace(/ai\s+/g, "").replace(/[\s_-]/g, "");
          const fvt = filterVideoType.toLowerCase().replace(/ai\s+/g, "").replace(/[\s_-]/g, "");
          matchesVideoType =
            vt === fvt ||
            vt.includes(fvt) ||
            fvt.includes(vt) ||
            (lead.video_type || "").toLowerCase().includes(filterVideoType.toLowerCase().trim());
        }

        // 5. Business Location Filter
        let matchesLocation = true;
        if (filterLocation && filterLocation.trim() !== "" && filterLocation !== "All") {
          const loc = filterLocation.toLowerCase().trim();
          const leadLoc = (lead.location || "").toLowerCase();
          const leadBiz = (lead.business || "").toLowerCase();
          const leadNotes = (lead.notes || "").toLowerCase();
          matchesLocation = leadLoc.includes(loc) || leadBiz.includes(loc) || leadNotes.includes(loc);
        }

        // 6. Lead Closed By Filter
        let matchesClosedBy = true;
        if (filterClosedBy !== "All" && filterClosedBy.trim() !== "") {
          const cb = (lead.closed_by || "").toLowerCase().trim();
          const fcb = filterClosedBy.toLowerCase().trim();
          matchesClosedBy = cb.includes(fcb) || fcb.includes(cb);
        }

        // 7. Text Search (Client Name, Business Name, Phone, Email, Video Type, Location, Notes)
        let matchesSearch = true;
        if (searchTerm && searchTerm.trim() !== "") {
          const q = searchTerm.toLowerCase().trim();
          const qDigits = q.replace(/\D/g, "");
          const leadPhoneDigits = (lead.phone || "").replace(/\D/g, "");
          
          matchesSearch =
            (lead.name || "").toLowerCase().includes(q) ||
            (lead.business || "").toLowerCase().includes(q) ||
            (lead.phone || "").toLowerCase().includes(q) ||
            (qDigits.length > 2 && leadPhoneDigits.includes(qDigits)) ||
            (lead.email || "").toLowerCase().includes(q) ||
            (lead.video_type || "").toLowerCase().includes(q) ||
            (lead.source || "").toLowerCase().includes(q) ||
            (lead.location || "").toLowerCase().includes(q) ||
            (lead.notes || "").toLowerCase().includes(q);
        }

        // 8. Date Range Filtering
        let matchesDate = true;
        if (fromDate || toDate) {
          let dateValue: string | undefined = undefined;
          if (filterDateType === "created_at") dateValue = lead.created_at;
          else if (filterDateType === "meeting_date") dateValue = lead.meeting_date;
          else if (filterDateType === "closed_at") dateValue = lead.closed_at;
          else if (filterDateType === "delivery_date") dateValue = lead.delivery_date;

          if (dateValue) {
            const leadD = new Date(dateValue).getTime();
            if (fromDate) {
              const fD = new Date(fromDate + "T00:00:00").getTime();
              if (!isNaN(fD) && leadD < fD) matchesDate = false;
            }
            if (toDate) {
              const tD = new Date(toDate + "T23:59:59.999").getTime();
              if (!isNaN(tD) && leadD > tD) matchesDate = false;
            }
          } else {
            matchesDate = false;
          }
        }

        return (
          matchesSource &&
          matchesStatus &&
          matchesProjStatus &&
          matchesVideoType &&
          matchesLocation &&
          matchesClosedBy &&
          matchesSearch &&
          matchesDate
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [
    websiteLeads,
    searchTerm,
    filterSource,
    filterStatus,
    filterProjectStatus,
    filterVideoType,
    filterLocation,
    filterClosedBy,
    filterDateType,
    fromDate,
    toDate,
  ]);

  // Filtered Meta Leads Calculation (Tab 2: Dedicated Meta Leads)
  const filteredMetaLeads = useMemo(() => {
    return metaLeads
      .filter((lead) => {
        // 1. Meta Source Filter
        let matchesSource = true;
        if (metaFilterSource !== "All" && metaFilterSource.trim() !== "") {
          const rawSrc = (lead.source || "").toLowerCase();
          const targetSrc = metaFilterSource.toLowerCase();
          matchesSource = rawSrc.includes(targetSrc) || targetSrc.includes(rawSrc);
        }

        // 2. Status Filter
        let matchesStatus = true;
        if (metaFilterStatus !== "All" && metaFilterStatus.trim() !== "") {
          const st = (lead.status || "").toLowerCase().replace(/[\s_-]/g, "");
          const fst = metaFilterStatus.toLowerCase().replace(/[\s_-]/g, "");
          matchesStatus = st === fst || (st.includes("progress") && fst.includes("progress"));
        }

        // 3. Project Status Filter
        let matchesProjStatus = true;
        if (metaFilterProjectStatus !== "All" && metaFilterProjectStatus.trim() !== "") {
          const ps = (lead.project_status || "In Progress").toLowerCase().replace(/[\s_-]/g, "");
          const fps = metaFilterProjectStatus.toLowerCase().replace(/[\s_-]/g, "");
          matchesProjStatus = ps === fps || (ps.includes("progress") && fps.includes("progress"));
        }

        // 4. Video Type Filter
        let matchesVideoType = true;
        if (metaFilterVideoType !== "All" && metaFilterVideoType.trim() !== "") {
          const vt = (lead.video_type || "").toLowerCase().replace(/ai\s+/g, "").replace(/[\s_-]/g, "");
          const fvt = metaFilterVideoType.toLowerCase().replace(/ai\s+/g, "").replace(/[\s_-]/g, "");
          matchesVideoType =
            vt === fvt ||
            vt.includes(fvt) ||
            fvt.includes(vt) ||
            (lead.video_type || "").toLowerCase().includes(metaFilterVideoType.toLowerCase().trim());
        }

        // 5. Location Filter
        let matchesLocation = true;
        if (metaFilterLocation && metaFilterLocation.trim() !== "" && metaFilterLocation !== "All") {
          const loc = metaFilterLocation.toLowerCase().trim();
          const leadLoc = (lead.location || "").toLowerCase();
          const leadBiz = (lead.business || "").toLowerCase();
          const leadNotes = (lead.notes || "").toLowerCase();
          matchesLocation = leadLoc.includes(loc) || leadBiz.includes(loc) || leadNotes.includes(loc);
        }

        // 6. Lead Closed By Filter
        let matchesClosedBy = true;
        if (metaFilterClosedBy !== "All" && metaFilterClosedBy.trim() !== "") {
          const cb = (lead.closed_by || "").toLowerCase().trim();
          const fcb = metaFilterClosedBy.toLowerCase().trim();
          matchesClosedBy = cb.includes(fcb) || fcb.includes(cb);
        }

        // 7. Search Filter
        let matchesSearch = true;
        if (metaSearchTerm && metaSearchTerm.trim() !== "") {
          const q = metaSearchTerm.toLowerCase().trim();
          const qDigits = q.replace(/\D/g, "");
          const leadPhoneDigits = (lead.phone || "").replace(/\D/g, "");
          matchesSearch =
            (lead.name || "").toLowerCase().includes(q) ||
            (lead.business || "").toLowerCase().includes(q) ||
            (lead.phone || "").toLowerCase().includes(q) ||
            (qDigits.length > 2 && leadPhoneDigits.includes(qDigits)) ||
            (lead.email || "").toLowerCase().includes(q) ||
            (lead.video_type || "").toLowerCase().includes(q) ||
            (lead.source || "").toLowerCase().includes(q) ||
            (lead.location || "").toLowerCase().includes(q) ||
            (lead.notes || "").toLowerCase().includes(q);
        }

        // 8. Date Range
        let matchesDate = true;
        if (metaFromDate || metaToDate) {
          let dateValue: string | undefined = undefined;
          if (metaFilterDateType === "created_at") dateValue = lead.created_at;
          else if (metaFilterDateType === "closed_at") dateValue = lead.closed_at;
          else if (metaFilterDateType === "delivery_date") dateValue = lead.delivery_date;

          if (dateValue) {
            const leadD = new Date(dateValue).getTime();
            if (metaFromDate) {
              const fD = new Date(metaFromDate + "T00:00:00").getTime();
              if (!isNaN(fD) && leadD < fD) matchesDate = false;
            }
            if (metaToDate) {
              const tD = new Date(metaToDate + "T23:59:59.999").getTime();
              if (!isNaN(tD) && leadD > tD) matchesDate = false;
            }
          } else {
            matchesDate = false;
          }
        }

        return (
          matchesSource &&
          matchesStatus &&
          matchesProjStatus &&
          matchesVideoType &&
          matchesLocation &&
          matchesClosedBy &&
          matchesSearch &&
          matchesDate
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [
    metaLeads,
    metaSearchTerm,
    metaFilterSource,
    metaFilterStatus,
    metaFilterProjectStatus,
    metaFilterVideoType,
    metaFilterLocation,
    metaFilterClosedBy,
    metaFilterDateType,
    metaFromDate,
    metaToDate,
  ]);

  const uniqueLocations = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.location && l.location.trim()) {
        set.add(l.location.trim());
      }
    });
    return Array.from(set).sort();
  }, [leads]);

  const uniqueClosedByAdmins = useMemo(() => {
    const set = new Set<string>();
    leads.forEach((l) => {
      if (l.closed_by && l.closed_by.trim()) {
        set.add(l.closed_by.trim());
      }
    });
    return Array.from(set).sort();
  }, [leads]);

  // Overall & Source-Wise Summary Counts (§17 & §18)
  const allCrmLeads = useMemo(() => leads.filter((l) => !isIndiaLead(l)), [leads]);
  const sourceWebsiteCount = useMemo(() => allCrmLeads.filter((l) => !isMetaLead(l) && (l.source || "").toLowerCase().trim() !== "manual").length, [allCrmLeads]);
  const sourceManualCount = useMemo(() => allCrmLeads.filter((l) => (l.source || "").toLowerCase().trim() === "manual").length, [allCrmLeads]);
  const sourceMetaCount = useMemo(() => allCrmLeads.filter((l) => isMetaLead(l)).length, [allCrmLeads]);

  // Overall Lead Summary Counts (§17)
  const allTotalLeadsCount = allCrmLeads.length;
  const allNewLeadsCount = allCrmLeads.filter((l) => l.status === "New").length;
  const allContactedCount = allCrmLeads.filter((l) => l.status === "Contacted").length;
  const allInProgressCount = allCrmLeads.filter((l) => l.status === "In Progress").length;
  const allHoldCount = allCrmLeads.filter((l) => l.status === "Hold").length;
  const allClosedCount = allCrmLeads.filter((l) => l.status === "Closed").length;
  const allProjectsInProgressCount = allCrmLeads.filter((l) => (l.project_status || "In Progress") === "In Progress" && l.status !== "Closed").length;
  const allProjectsDeliveredCount = allCrmLeads.filter((l) => l.project_status === "Delivered").length;

  // Website Leads KPI Summary Counts (Tab 1)
  const totalLeadsCount = websiteLeads.length;
  const newLeadsCount = websiteLeads.filter((l) => l.status === "New").length;
  const contactedCount = websiteLeads.filter((l) => l.status === "Contacted").length;
  const inProgressCount = websiteLeads.filter((l) => l.status === "In Progress").length;
  const holdCount = websiteLeads.filter((l) => l.status === "Hold").length;
  const closedCount = websiteLeads.filter((l) => l.status === "Closed").length;
  const projectsDeliveredCount = websiteLeads.filter((l) => l.project_status === "Delivered").length;
  const projectsInProgressCount = websiteLeads.filter((l) => (l.project_status || "In Progress") === "In Progress" && l.status !== "Closed").length;

  // Meta Leads KPI Summary Counts (Tab 2)
  const metaTotalCount = metaLeads.length;
  const metaNewCount = metaLeads.filter((l) => l.status === "New").length;
  const metaContactedCount = metaLeads.filter((l) => l.status === "Contacted").length;
  const metaInProgressCount = metaLeads.filter((l) => l.status === "In Progress").length;
  const metaHoldCount = metaLeads.filter((l) => l.status === "Hold").length;
  const metaClosedCount = metaLeads.filter((l) => l.status === "Closed").length;
  const metaDeliveredCount = metaLeads.filter((l) => l.project_status === "Delivered").length;
  const metaProjectsInProgressCount = metaLeads.filter((l) => (l.project_status || "In Progress") === "In Progress" && l.status !== "Closed").length;

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders
      .filter((order) => {
        const status = (order.payment_status || "").toUpperCase();
        if (filterOrderStatus === "COMPLETED") return status === "COMPLETED";
        if (filterOrderStatus === "PENDING") return status === "PENDING";
        if (filterOrderStatus === "FAILED") return status === "FAILED" || status === "CANCELLED";
        if (filterOrderStatus === "REFUNDED") return status === "REFUNDED";
        if (filterOrderStatus === "All") return true;
        return status === filterOrderStatus.toUpperCase();
      })
      .filter((order) => {
        const q = orderSearchTerm.toLowerCase().trim();
        if (!q) return true;
        return (
          order.customer_name?.toLowerCase().includes(q) ||
          order.customer_email?.toLowerCase().includes(q) ||
          order.paypal_order_id?.toLowerCase().includes(q) ||
          (order.paypal_capture_id && order.paypal_capture_id.toLowerCase().includes(q)) ||
          order.item_name?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [orders, filterOrderStatus, orderSearchTerm]);

  const totalRevenue = orders
    .filter((o) => o.payment_status === "COMPLETED")
    .reduce((sum, o) => sum + (Number(o.amount) || 0), 0);

  // =========================================================================
  // LOGIN SCREEN
  // =========================================================================
  if (!session) {
    return (
      <div className={`flex min-h-screen items-center justify-center p-4 transition-colors ${
        isDark ? "bg-[#0b0a12] text-white" : "bg-slate-50 text-slate-900"
      }`}>
        <div className={`relative w-full max-w-md rounded-2xl border p-8 shadow-2xl transition-all ${
          isDark ? "border-slate-800 bg-[#12101e]" : "border-slate-200 bg-white"
        }`}>
          {/* Logo & Header */}
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center">
              <img
                src="/images/LOGO 1.png"
                alt="Quickupp AI Studio logo"
                className="h-10 w-auto object-contain"
                width={140}
                height={44}
              />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight">CRM Admin Portal</h2>
            <p className={`mt-1 text-xs ${isDark ? "text-slate-400" : "text-slate-500"}`}>
              Quickupp AI Studio Lead & Client Management
            </p>
          </div>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            {authError ? (
              <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-600 dark:text-red-400">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{authError}</span>
              </div>
            ) : null}

            <div>
              <label className="block text-xs font-semibold">Admin Email</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="sa@aistudio.com"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-white placeholder-slate-500"
                      : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400"
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold">Password</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full rounded-xl border py-2.5 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark
                      ? "border-slate-700 bg-slate-900 text-white placeholder-slate-500"
                      : "border-slate-200 bg-slate-50 text-slate-900 placeholder-slate-400"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={isDark ? "text-slate-300" : "text-slate-600"}>Remember email</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-lg hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="h-4 w-4" />
              <span>Sign In to CRM Portal</span>
            </button>
          </form>

          <div className="mt-6 border-t border-slate-200 dark:border-slate-800 pt-4 text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-slate-500">
              <Shield className="h-3.5 w-3.5" />
              <span>Super Admin & Admin Role Protected</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // AUTHENTICATED CRM DASHBOARD
  // =========================================================================
  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-slate-900 antialiased">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-md shadow-xs">
        <div className="mx-auto flex w-full max-w-[1750px] items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 gap-2 sm:gap-4">
          {/* Brand & Role Badge */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
              title="View Public Website"
            >
              <ArrowLeft className="h-4 w-4" />
            </a>

            <div className="flex items-center gap-2 sm:gap-3">
              <a href="/" className="flex items-center transition-opacity hover:opacity-85">
                <img
                  src="/images/LOGO 1.png"
                  alt="Quickupp AI Studio logo"
                  className="h-7 sm:h-8 md:h-9 w-auto object-contain"
                  width={125}
                  height={38}
                />
              </a>

              {isSuperAdmin ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/15 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-purple-700">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Super Admin</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/15 px-2 sm:px-2.5 py-0.5 text-[10px] sm:text-[11px] font-bold text-blue-700">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Admin</span>
                </span>
              )}
            </div>
          </div>

          {/* Controls: Auto-Sync, Sound, Notifications, User Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
              <span>Auto-sync in</span>
              <span className="font-mono font-bold text-blue-600">{refreshCountdown}s</span>
            </div>

            <button
              onClick={() => {
                fetchAllData(false);
                setRefreshCountdown(10);
              }}
              className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Refresh Data Now"
            >
              <RefreshCw className={`h-4 w-4 ${loading || isSyncing ? "animate-spin text-blue-500" : ""}`} />
            </button>

            {/* Sound Toggle */}
            <button
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                localStorage.setItem("ai_studio_sound_enabled", String(next));
                if (next) playNotificationChime();
              }}
              className="rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
              title={soundEnabled ? "Mute notification sounds" : "Enable notification sounds"}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-500" /> : <VolumeX className="h-4 w-4 text-slate-400" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotificationsPopover(!showNotificationsPopover)}
                className={`relative rounded-lg border p-2 transition-colors cursor-pointer ${
                  showNotificationsPopover
                    ? "border-blue-500 bg-blue-50 text-blue-600"
                    : "border-slate-200 bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
                title="Notifications Center"
              >
                <Bell className="h-4 w-4" />
                {unreadNotifsCount > 0 ? (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-extrabold text-white shadow-md animate-pulse">
                    {unreadNotifsCount > 99 ? "99+" : unreadNotifsCount}
                  </span>
                ) : notifications.length > 0 ? (
                  <span className="absolute -top-1 -right-1 flex h-3.5 min-w-[14px] items-center justify-center rounded-full bg-slate-400 px-1 text-[8px] font-bold text-white shadow">
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </span>
                ) : null}
              </button>

              {/* Notification Popover Dropdown */}
              {showNotificationsPopover && (
                <div className="absolute right-0 top-11 z-50 w-[calc(100vw-24px)] max-w-sm sm:w-[420px] rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl space-y-3 animate-in fade-in text-slate-900">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                    <div className="flex items-center gap-2">
                      <BellRing className="h-4 w-4 text-blue-500" />
                      <span className="text-xs font-bold text-slate-800">CRM Notifications</span>
                      <span className="rounded-full bg-blue-50 border border-blue-200 px-2 py-0.5 text-[10px] font-bold text-blue-700">
                        {notifications.length} Total {unreadNotifsCount > 0 ? `(${unreadNotifsCount} unread)` : ""}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {unreadNotifsCount > 0 && (
                        <button
                          onClick={async () => {
                            await markAllNotificationsReadServerFn();
                            setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
                            showToast("All notifications marked as read");
                          }}
                          className="text-[10px] font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer px-1 py-0.5"
                        >
                          Mark all read
                        </button>
                      )}
                      {notifications.length > 0 && (
                        <button
                          onClick={async () => {
                            await clearNotificationsServerFn();
                            setNotifications([]);
                            showToast("Notifications cleared");
                          }}
                          className="text-[10px] text-slate-400 hover:text-red-500 cursor-pointer px-1 py-0.5"
                          title="Clear all notifications"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Filter Pills with dynamic counts */}
                  <div className="flex items-center gap-1.5 text-[10px] overflow-x-auto pb-1 scrollbar-none">
                    <button
                      onClick={() => setNotificationFilter("all")}
                      className={`rounded-full px-2.5 py-1 font-bold cursor-pointer shrink-0 transition-colors ${
                        notificationFilter === "all" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      All ({notifications.length})
                    </button>
                    <button
                      onClick={() => setNotificationFilter("unread")}
                      className={`rounded-full px-2.5 py-1 font-bold cursor-pointer shrink-0 transition-colors ${
                        notificationFilter === "unread" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Unread ({unreadNotifsCount})
                    </button>
                    <button
                      onClick={() => setNotificationFilter("lead")}
                      className={`rounded-full px-2.5 py-1 font-bold cursor-pointer shrink-0 transition-colors ${
                        notificationFilter === "lead" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Leads ({leadNotifs.length})
                    </button>
                    <button
                      onClick={() => setNotificationFilter("meeting")}
                      className={`rounded-full px-2.5 py-1 font-bold cursor-pointer shrink-0 transition-colors ${
                        notificationFilter === "meeting" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Meetings ({meetingNotifs.length})
                    </button>
                    <button
                      onClick={() => setNotificationFilter("order")}
                      className={`rounded-full px-2.5 py-1 font-bold cursor-pointer shrink-0 transition-colors ${
                        notificationFilter === "order" ? "bg-blue-600 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      Orders ({orderNotifs.length})
                    </button>
                  </div>

                  {/* Notification List */}
                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100 text-xs">
                    {filteredNotificationsList.length === 0 ? (
                      <div className="py-8 text-center text-xs text-slate-400">
                        No notifications found for this filter.
                      </div>
                    ) : (
                      filteredNotificationsList.map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 transition-colors flex items-start justify-between gap-2.5 hover:bg-slate-50 rounded-lg ${
                            !n.is_read ? "bg-blue-50/60 font-medium" : ""
                          }`}
                        >
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`h-2 w-2 rounded-full shrink-0 ${!n.is_read ? "bg-blue-600 animate-pulse" : "bg-slate-300"}`} />
                              <span className="font-bold text-[11px] text-slate-900 truncate">{n.title}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded font-mono font-bold uppercase bg-slate-100 text-slate-500">
                                {n.type.replace(/_/g, " ")}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">{n.message}</p>
                            <div className="flex items-center gap-2 pt-0.5 text-[9px] text-slate-400 font-mono">
                              <span>{new Date(n.created_at).toLocaleDateString([], { month: "short", day: "numeric" })} {new Date(n.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                              <span>•</span>
                              <span className="truncate">{n.actor}</span>
                            </div>
                          </div>

                          {!n.is_read && (
                            <button
                              onClick={async () => {
                                await markNotificationReadServerFn({ data: { id: n.id } });
                                setNotifications((prev) => prev.map((item) => (item.id === n.id ? { ...item, is_read: true } : item)));
                              }}
                              className="text-slate-400 hover:text-blue-600 hover:bg-blue-50 p-1.5 rounded-md cursor-pointer shrink-0 transition-colors"
                              title="Mark as read"
                            >
                              <Check className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* User Profile & Logout */}
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-2.5 sm:px-3 py-1.5">
              <div className="hidden sm:block text-right">
                <p className="text-xs font-bold leading-none">{session.name}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-0.5">{session.email}</p>
              </div>

              <button
                onClick={handleLogout}
                className="rounded-lg p-1 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                title="Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="overflow-x-auto border-t border-slate-200 bg-white scrollbar-none">
          <div className="mx-auto flex w-full max-w-[1750px] items-center gap-1 sm:gap-1.5 px-3 sm:px-6 py-1.5 min-w-max">
            <button
              onClick={() => { setActiveTab("dashboard"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "dashboard"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </button>

            <button
              onClick={() => { setActiveTab("leads"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "leads"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Layers className="h-4 w-4" />
              <span>Leads Management</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === "leads" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {websiteLeads.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("meta_leads"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "meta_leads"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Megaphone className="h-4 w-4" />
              <span>Meta Leads</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === "meta_leads" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-600"
              }`}>
                {metaLeads.length}
              </span>
            </button>

            {session?.role !== "leads_manager" && (
            <button
              onClick={() => handleSelectOrdersTab()}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "orders"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <DollarSign className="h-4 w-4" />
              <span>Orders & Payments</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === "orders" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}>
                {orders.length}
              </span>
            </button>
            )}

            <button
              onClick={() => { setActiveTab("calendly"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "calendly"
                  ? "bg-blue-600 text-white shadow-sm"
                  : isDark
                  ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Calendar className="h-4 w-4" />
              <span>Calendly (USA)</span>
              <span className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                activeTab === "calendly" ? "bg-white/20 text-white" : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              }`}>
                {meetings.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab("activity"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "activity"
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Clock className="h-4 w-4" />
              <span>Activity History</span>
            </button>

            {/* Super Admin Tabs */}
            {isSuperAdmin && (
              <>
                <button
                  onClick={() => { setActiveTab("users"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "users"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <Users className="h-4 w-4" />
                  <span>User Management</span>
                </button>

                <button
                  onClick={() => { setActiveTab("security"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "security"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <ShieldAlert className="h-4 w-4" />
                  <span>Login / IP Tracking</span>
                </button>

                <button
                  onClick={() => { setActiveTab("settings"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
                  className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                    activeTab === "settings"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-purple-700 hover:bg-purple-50"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>CRM Settings</span>
                </button>
              </>
            )}

            <button
              onClick={() => { setActiveTab("recycle_bin"); setIsPaymentUnlocked(false); setShowPaymentPinModal(false); }}
              className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                activeTab === "recycle_bin"
                  ? "bg-red-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              }`}
            >
              <Trash2 className="h-4 w-4" />
              <span>Recycle Bin</span>
              {recycleBinLeads.length > 0 && (
                <span className="rounded-full bg-red-100 px-1.5 py-0.2 text-[10px] font-extrabold text-red-700">
                  {recycleBinLeads.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="w-full max-w-[1750px] mx-auto flex-1 p-3 sm:p-5 lg:p-7 space-y-5 sm:space-y-6">
        {/* System-Wide Operational Broadcast Banner (Super Admin Controlled) */}
        {crmBroadcastBanner && (
          <div className="rounded-2xl border border-amber-300 bg-amber-50/90 px-4 py-3 text-xs text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-xs animate-in fade-in">
            <div className="flex items-center gap-2.5">
              <Megaphone className="h-4 w-4 text-amber-600 shrink-0" />
              <span className="font-bold text-amber-900 uppercase tracking-wider text-[10px] bg-amber-200/80 px-2 py-0.5 rounded-md">System Notice</span>
              <span className="font-semibold">{crmBroadcastBanner}</span>
            </div>
            {isSuperAdmin && (
              <button
                onClick={() => {
                  setCrmBroadcastBanner("");
                  if (typeof window !== "undefined") {
                    localStorage.removeItem("crm_broadcast_banner");
                  }
                  showToast("Broadcast banner dismissed");
                }}
                className="text-[11px] font-bold text-amber-800 hover:text-amber-950 underline cursor-pointer shrink-0 self-end sm:self-center"
              >
                Dismiss Notice
              </button>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 0: EXECUTIVE DASHBOARD & CRM OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === "dashboard" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Dashboard Header with Quick Actions */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <LayoutDashboard className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">Executive CRM Dashboard</h2>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Real-time overview of inbound leads across sources, video production pipelines, and revenue.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal("Website")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal("Meta Ads")}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-purple-200 bg-purple-50 px-3.5 py-2 text-xs font-bold text-purple-700 hover:bg-purple-100 transition-all cursor-pointer"
                >
                  <Megaphone className="h-3.5 w-3.5" />
                  <span>Add Meta Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportCSV(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* KPI Metrics Cards (6 Metrics) */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
              {/* Total Leads */}
              <div
                onClick={() => { setActiveTab("leads"); setFilterSource("All"); }}
                className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-xs hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Total Leads</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Layers className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900">{allTotalLeadsCount}</p>
                <p className="mt-1 text-[11px] text-slate-500">All Sources</p>
              </div>

              {/* Total Revenue */}
              <div
                onClick={() => handleSelectOrdersTab()}
                className="rounded-2xl border border-emerald-200/90 bg-white p-4 shadow-xs hover:border-emerald-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Revenue</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                    <DollarSign className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-emerald-600 font-mono">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{orders.filter((o) => o.payment_status === "COMPLETED").length} Paid Orders</p>
              </div>

              {/* Active Productions */}
              <div
                onClick={() => { setActiveTab("leads"); setFilterProjectStatus("In Progress"); }}
                className="rounded-2xl border border-orange-200/90 bg-white p-4 shadow-xs hover:border-orange-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>In Production</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    <Video className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-orange-600">{allProjectsInProgressCount}</p>
                <p className="mt-1 text-[11px] text-slate-500">Active Videos</p>
              </div>

              {/* Delivered Videos */}
              <div
                onClick={() => { setActiveTab("leads"); setFilterProjectStatus("Delivered"); }}
                className="rounded-2xl border border-purple-200/90 bg-white p-4 shadow-xs hover:border-purple-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Delivered</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
                    <CheckCircle2 className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-purple-600">{allProjectsDeliveredCount}</p>
                <p className="mt-1 text-[11px] text-slate-500">Completed Orders</p>
              </div>

              {/* Calendly Meetings */}
              <div
                onClick={() => setActiveTab("calendly")}
                className="rounded-2xl border border-indigo-200/90 bg-white p-4 shadow-xs hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Calls / Meets</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                    <Calendar className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-indigo-600">{meetings.length}</p>
                <p className="mt-1 text-[11px] text-slate-500">USA Calendly</p>
              </div>

              {/* Closed Conversion Rate */}
              <div
                onClick={() => { setActiveTab("leads"); setFilterStatus("Closed"); }}
                className="rounded-2xl border border-teal-200/90 bg-white p-4 shadow-xs hover:border-teal-400 hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Closed Leads</span>
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-50 text-teal-600">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-teal-600">{allClosedCount}</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  {allTotalLeadsCount > 0 ? `${Math.round((allClosedCount / allTotalLeadsCount) * 100)}% Conversion` : "0%"}
                </p>
              </div>
            </div>

            {/* Source-Wise Lead Attribution Cards (§18) */}
            <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-4">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-blue-600" />
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Source-Wise Lead Reporting (§18)
                  </h3>
                </div>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {allTotalLeadsCount} Total Leads Attribution
                </span>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {/* Website Leads */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition-all hover:bg-blue-50/20 hover:border-blue-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600 font-bold">
                        <Globe className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Website Inbound</p>
                        <p className="text-xs text-slate-500">Landing Page Inquiries</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-blue-600 font-mono">{sourceWebsiteCount}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {allTotalLeadsCount > 0 ? `${Math.round((sourceWebsiteCount / allTotalLeadsCount) * 100)}% of total` : "0%"}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("leads"); setFilterSource("USA Website"); }}
                      className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Leads</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Manual Leads */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition-all hover:bg-amber-50/20 hover:border-amber-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 font-bold">
                        <UserPlus className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Manual Entry</p>
                        <p className="text-xs text-slate-500">Admin Direct Creation</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-amber-600 font-mono">{sourceManualCount}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {allTotalLeadsCount > 0 ? `${Math.round((sourceManualCount / allTotalLeadsCount) * 100)}% of total` : "0%"}
                    </span>
                    <button
                      type="button"
                      onClick={() => { setActiveTab("leads"); setFilterSource("Manual"); }}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Leads</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>

                {/* Meta Leads */}
                <div className="flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/50 p-4 transition-all hover:bg-purple-50/20 hover:border-purple-300">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-600 font-bold">
                        <Megaphone className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Meta Ads</p>
                        <p className="text-xs text-slate-500">Facebook & IG Campaigns</p>
                      </div>
                    </div>
                    <span className="text-3xl font-black text-purple-600 font-mono">{sourceMetaCount}</span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500 font-medium">
                      {allTotalLeadsCount > 0 ? `${Math.round((sourceMetaCount / allTotalLeadsCount) * 100)}% of total` : "0%"}
                    </span>
                    <button
                      type="button"
                      onClick={() => setActiveTab("meta_leads")}
                      className="text-xs font-bold text-purple-600 hover:text-purple-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
                    >
                      <span>Manage Meta Leads</span>
                      <span>→</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Split Grid: Recent Leads & Recent Activity */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {/* Recent Inbound Leads */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-blue-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Latest Inbound Leads</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("leads")}
                      className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                    >
                      View All →
                    </button>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {leads.slice(0, 5).map((l) => (
                      <div
                        key={l.id}
                        onClick={() => setViewLeadDetails(l)}
                        className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors cursor-pointer"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <div className="flex items-center gap-2">
                            <p className="text-xs font-bold text-slate-900 truncate">{l.name}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[9px] font-bold ${
                              l.source?.includes("Meta")
                                ? "bg-purple-50 text-purple-700 border border-purple-200"
                                : l.source === "Manual"
                                ? "bg-amber-50 text-amber-700 border border-amber-200"
                                : "bg-blue-50 text-blue-700 border border-blue-200"
                            }`}>
                              {l.source || "Website"}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {l.business_name || l.email || l.phone || "Direct Lead"} • {l.video_type || "AI Video"}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className={`inline-flex rounded-md px-2 py-0.5 text-[10px] font-bold ${
                            l.status === "Closed"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : l.status === "In Progress"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : l.status === "Contacted"
                              ? "bg-amber-50 text-amber-700 border border-amber-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}>
                            {l.status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {leads.length === 0 && (
                      <p className="py-6 text-center text-xs text-slate-400">No leads received yet.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("leads")}
                    className="text-xs font-bold text-slate-600 hover:text-blue-600 cursor-pointer"
                  >
                    Open Complete Leads Management Table →
                  </button>
                </div>
              </div>

              {/* Recent CRM Activity Logs */}
              <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-purple-600" />
                      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">Recent CRM Activity</h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("activity")}
                      className="text-xs font-bold text-purple-600 hover:underline cursor-pointer"
                    >
                      View All Logs →
                    </button>
                  </div>

                  <div className="mt-3 divide-y divide-slate-100">
                    {activityLogs.slice(0, 5).map((log) => (
                      <div key={log.id} className="py-2.5 flex items-start justify-between gap-3 text-xs">
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate">{log.action}</p>
                          <p className="text-[11px] text-slate-500 truncate mt-0.5">
                            {log.details} • by <span className="font-medium text-slate-700">{log.performed_by}</span>
                          </p>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0 whitespace-nowrap">
                          {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                    {activityLogs.length === 0 && (
                      <p className="py-6 text-center text-xs text-slate-400">No activity recorded yet.</p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 text-center">
                  <button
                    type="button"
                    onClick={() => setActiveTab("activity")}
                    className="text-xs font-bold text-slate-600 hover:text-purple-600 cursor-pointer"
                  >
                    Open Full Activity Audit Trail →
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: LEADS MANAGEMENT (WEBSITE & MANUAL LEADS ONLY) */}
        {/* ========================================================================= */}
        {activeTab === "leads" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Clean Section Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-blue-600" />
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">Website & Inbound Leads</h2>
                  <span className="rounded-full bg-blue-50 border border-blue-200 px-2.5 py-0.5 text-xs font-bold text-blue-700 font-mono">
                    {websiteLeads.length} Leads
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Managing client inquiries from website landing page forms and direct admin manual entries.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal("Website")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-blue-700 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportCSV(false)}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Section 17: Lead & Project Real-Time Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 sm:gap-3.5">
              {/* Total Leads */}
              <button
                type="button"
                onClick={() => {
                  setFilterStatus("All");
                  setFilterProjectStatus("All");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterStatus === "All" && filterProjectStatus === "All"
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
                title="Click to view all leads"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Total Leads</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-100 text-blue-600">
                    <Layers className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900">{totalLeadsCount}</p>
              </button>

              {/* New */}
              <button
                type="button"
                onClick={() => {
                  setFilterStatus(filterStatus === "New" ? "All" : "New");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterStatus === "New"
                    ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/30"
                    : "border-slate-200/90 hover:border-blue-300"
                }`}
                title="Click to filter by New status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>New</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-blue-600">{newLeadsCount}</p>
              </button>

              {/* Contacted */}
              <button
                type="button"
                onClick={() => {
                  setFilterStatus(filterStatus === "Contacted" ? "All" : "Contacted");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterStatus === "Contacted"
                    ? "border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/30"
                    : "border-slate-200/90 hover:border-amber-300"
                }`}
                title="Click to filter by Contacted status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Contacted</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-amber-600">{contactedCount}</p>
              </button>

              {/* In Progress */}
              <button
                type="button"
                onClick={() => {
                  setFilterStatus(filterStatus === "In Progress" ? "All" : "In Progress");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterStatus === "In Progress"
                    ? "border-orange-500 ring-2 ring-orange-500/30 bg-orange-50/30"
                    : "border-slate-200/90 hover:border-orange-300"
                }`}
                title="Click to filter by In Progress status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>In Progress</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-orange-600">{inProgressCount}</p>
              </button>

              {/* Hold */}
              <button
                type="button"
                onClick={() => {
                  setFilterStatus(filterStatus === "Hold" ? "All" : "Hold");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterStatus === "Hold"
                    ? "border-slate-500 ring-2 ring-slate-500/30 bg-slate-100/50"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
                title="Click to filter by On Hold status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Hold</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-slate-700">{holdCount}</p>
              </button>

              {/* Closed */}
              <button
                type="button"
                onClick={() => {
                  setFilterStatus(filterStatus === "Closed" ? "All" : "Closed");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterStatus === "Closed"
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/30"
                    : "border-slate-200/90 hover:border-emerald-300"
                }`}
                title="Click to filter by Closed status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Closed</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-emerald-600">{closedCount}</p>
              </button>

              {/* Projects In Progress */}
              <button
                type="button"
                onClick={() => {
                  setFilterProjectStatus(filterProjectStatus === "In Progress" ? "All" : "In Progress");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterProjectStatus === "In Progress"
                    ? "border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-50/30"
                    : "border-slate-200/90 hover:border-cyan-300"
                }`}
                title="Click to filter by Projects in progress"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Proj. Active</span>
                  <Clock className="h-4 w-4 text-cyan-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-cyan-600">{projectsInProgressCount}</p>
              </button>

              {/* Delivered */}
              <button
                type="button"
                onClick={() => {
                  setFilterProjectStatus(filterProjectStatus === "Delivered" ? "All" : "Delivered");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  filterProjectStatus === "Delivered"
                    ? "border-purple-500 ring-2 ring-purple-500/30 bg-purple-50/30"
                    : "border-slate-200/90 hover:border-purple-300"
                }`}
                title="Click to filter by Delivered projects"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Delivered</span>
                  <Package className="h-4 w-4 text-purple-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-purple-600">{projectsDeliveredCount}</p>
              </button>
            </div>

            {/* Actions & Filters Bar (Section 11: Filters & Search) */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5 transition-colors">
              {/* Top Row: Search + Quick Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 min-w-0 max-w-lg">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by Client Name, Business Name, Phone, Notes..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyFilters();
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => setSearchTerm("")}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Add Lead</span>
                  </button>

                  <button
                    onClick={() => exportCSV(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="h-4 w-4 text-slate-800" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Detailed Filters Grid */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                {/* Source Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Source:</span>
                  <select
                    value={filterSource}
                    onChange={(e) => setFilterSource(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Sources</option>
                    <option value="USA Website">USA Website</option>
                    <option value="Manual">Manual</option>
                    <option value="Calendly">Calendly</option>
                  </select>
                </div>

                {/* Lead Status Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Lead Status:</span>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Lead Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Project Status Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Project Status:</span>
                  <select
                    value={filterProjectStatus}
                    onChange={(e) => setFilterProjectStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Project Statuses</option>
                    <option value="Hold">Hold</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Video Type Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Video Type:</span>
                  <select
                    value={filterVideoType}
                    onChange={(e) => setFilterVideoType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Video Types</option>
                    {VIDEO_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Business Location Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Location:</span>
                  <select
                    value={filterLocation}
                    onChange={(e) => setFilterLocation(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Lead Closed By Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Closed By:</span>
                  <select
                    value={filterClosedBy}
                    onChange={(e) => setFilterClosedBy(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Admins</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    {uniqueClosedByAdmins.map((adm) => (
                      <option key={adm} value={adm}>{adm}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter Selection */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select
                    value={filterDateType}
                    onChange={(e) => setFilterDateType(e.target.value as any)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="created_at">Created Date</option>
                    <option value="meeting_date">Meeting Date</option>
                    <option value="closed_at">Closed Date</option>
                    <option value="delivery_date">Delivery Date</option>
                  </select>

                  <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-xs text-slate-900 focus:outline-none"
                    title="From Date"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-xs text-slate-900 focus:outline-none"
                    title="To Date"
                  />
                </div>

                {/* Apply Filter and Clear Filter Buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={handleApplyFilters}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                    title="Apply Filters"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Apply Filter</span>
                  </button>

                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Clear Filters"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Clear Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar (Appears when 1+ selected) */}
            {selectedLeadIds.size > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/40 bg-blue-50 dark:bg-blue-950/40 p-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900 dark:text-blue-200">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>{selectedLeadIds.size} lead(s) selected</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-500">Bulk Status:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleBulkStatusChange(e.target.value as LeadStatus);
                    }}
                    defaultValue=""
                    className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-2.5 py-1 text-xs font-semibold cursor-pointer"
                  >
                    <option value="" disabled>Change Status to...</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <button
                    onClick={() => exportCSV(true)}
                    className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Export Selected
                  </button>

                  <button
                    onClick={handleBulkDelete}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-500/20 cursor-pointer"
                  >
                    Move to Recycle Bin
                  </button>

                  <button
                    onClick={() => setSelectedLeadIds(new Set())}
                    className="text-xs text-slate-500 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* Main Leads Table (Desktop Table & Mobile Cards) */}
            <div className={`overflow-hidden rounded-2xl border shadow-sm transition-colors ${
              isDark ? "border-slate-800 bg-[#12101e]" : "border-slate-200 bg-white"
            }`}>
              {/* Desktop Table with Horizontal Scroll */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full min-w-[1200px] text-left text-xs">
                  <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                    isDark ? "border-slate-800 bg-[#171427] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
                  }`}>
                    <tr>
                      <th className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={filteredLeads.length > 0 && selectedLeadIds.size === filteredLeads.length}
                          onChange={(e) => handleSelectAllLeads(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3.5">Source</th>
                      <th className="px-4 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5">Client & Business</th>
                      <th className="px-4 py-3.5">WhatsApp / Phone</th>
                      <th className="px-4 py-3.5">Video Scope</th>
                      <th className="px-4 py-3.5">Lead Status</th>
                      <th className="px-4 py-3.5">Project Status</th>
                      <th className="px-4 py-3.5">Notes</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {filteredLeads.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-16 text-center text-xs text-slate-500">
                          <Layers className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                          <p className="font-bold text-sm">No leads match current filter criteria</p>
                          <p className="mt-1 text-slate-400">New website submissions will automatically appear here.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredLeads.map((lead) => {
                        const isSelected = selectedLeadIds.has(lead.id);
                        const isNewlyArrived = highlightedLeadIds.has(lead.id);

                        return (
                          <tr
                            key={lead.id}
                            className={`transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.02] ${
                              isSelected ? "bg-blue-50/60 dark:bg-blue-950/30" : ""
                            } ${isNewlyArrived ? "bg-blue-100 dark:bg-blue-900/30 ring-1 ring-blue-500" : ""}`}
                          >
                            {/* Checkbox */}
                            <td className="px-4 py-3.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectLead(lead.id)}
                                className="rounded border-slate-300 text-blue-600 cursor-pointer"
                              />
                            </td>

                            {/* Source */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${getLeadSourceBadgeClass(lead.source)}`}>
                                {getLeadSourceDisplay(lead.source)}
                              </span>
                            </td>

                            {/* Timestamp */}
                            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">
                              {isToday(lead.created_at) ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600 dark:text-blue-300">
                                  <Calendar className="h-3 w-3" />
                                  Today, {new Date(lead.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              ) : (
                                <div>
                                  <div>{new Date(lead.created_at).toLocaleDateString()}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {new Date(lead.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Client & Business */}
                            <td className="px-4 py-3.5">
                              <button
                                type="button"
                                onClick={() => setViewLeadDetails(lead)}
                                className="text-left font-bold text-sm flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Click to view full lead details"
                              >
                                <span>{lead.name}</span>
                                {isNewlyArrived && (
                                  <span className="rounded bg-blue-600 px-1 py-0.2 text-[8px] font-black text-white animate-pulse">
                                    JUST NOW
                                  </span>
                                )}
                              </button>
                              <div className="text-xs text-slate-500 font-medium">
                                {lead.business}
                                {lead.location ? ` · ${lead.location}` : ""}
                              </div>
                              {lead.email && <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>}
                            </td>

                            {/* WhatsApp / Phone */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <a
                                href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                                className="font-mono text-xs font-semibold hover:text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Phone className="h-3 w-3 text-slate-400" />
                                <span>{lead.phone}</span>
                              </a>
                            </td>

                            {/* Video Scope */}
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-xs flex items-center gap-1">
                                <Video className="h-3 w-3 text-blue-500" />
                                <span>{lead.video_type}</span>
                                {lead.video_quantity && (
                                  <span className="rounded bg-slate-100 dark:bg-slate-800 px-1.5 py-0.2 text-[10px] font-bold">
                                    x{lead.video_quantity}
                                  </span>
                                )}
                              </div>
                              {(lead.requirement || lead.additional) && (
                                <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1 max-w-xs" title={lead.requirement || lead.additional}>
                                  {lead.requirement || lead.additional}
                                </p>
                              )}
                            </td>

                            {/* Lead Status Dropdown */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead, e.target.value as LeadStatus)}
                                className={`rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer focus:outline-none ${getLeadStatusBadge(lead.status)}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Hold">Hold</option>
                                <option value="Closed">Closed</option>
                              </select>
                              {lead.closed_by && lead.status === "Closed" && (
                                <div className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5">
                                  By: {lead.closed_by}
                                </div>
                              )}
                            </td>

                            {/* Project Status Dropdown */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <select
                                value={lead.project_status || "In Progress"}
                                onChange={(e) => handleUpdateProjectStatus(lead, e.target.value as ProjectStatus)}
                                className={`rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer focus:outline-none ${getProjectStatusBadge(lead.project_status)}`}
                              >
                                <option value="Hold">Hold</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              {lead.delivery_date && (
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Due: {lead.delivery_date}
                                </div>
                              )}
                            </td>

                            {/* Notes Snippet */}
                            <td className="px-4 py-3.5 max-w-[150px]">
                              {lead.notes ? (
                                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2" title={lead.notes}>
                                  {lead.notes}
                                </p>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">No notes</span>
                              )}
                            </td>

                            {/* Actions (Section 09: Action Buttons) */}
                            <td className="whitespace-nowrap px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 1. Call */}
                                <a
                                  href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Call Client"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>

                                {/* 2. WhatsApp */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenWhatsApp(lead)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Chat on WhatsApp"
                                >
                                  <WhatsAppIcon className="h-3.5 w-3.5" />
                                </button>

                                {/* 3. View Details */}
                                <button
                                  type="button"
                                  onClick={() => setViewLeadDetails(lead)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="View Full Profile"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>

                                {/* 4. Edit Lead */}
                                <button
                                  type="button"
                                  onClick={() => setEditingLead(lead)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Edit Lead"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>

                                {/* 5. Delete Lead */}
                                <button
                                  type="button"
                                  onClick={() => handleSoftDeleteLead(lead.id)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800 p-3 space-y-4">
                {filteredLeads.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    No leads found matching criteria.
                  </div>
                ) : (
                  filteredLeads.map((lead) => (
                    <div key={lead.id} className="pt-3 first:pt-0 space-y-2.5 text-xs">
                      {/* Header with Name & Source */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="font-bold text-sm text-slate-900 dark:text-white truncate">
                          {lead.name}
                        </div>
                        <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold ${getLeadSourceBadgeClass(lead.source)}`}>
                          {getLeadSourceDisplay(lead.source)}
                        </span>
                      </div>

                      {/* Business & Location */}
                      <div className="text-slate-500">
                        <span className="font-semibold text-slate-700 dark:text-slate-300">{lead.business}</span>
                        {lead.location ? ` · ${lead.location}` : ""}
                        {lead.email && <div className="text-[11px] font-mono text-slate-400">{lead.email}</div>}
                      </div>

                      {/* Phone & Scope */}
                      <div className="flex items-center justify-between gap-2 bg-slate-50 dark:bg-slate-800/50 p-2 rounded-lg">
                        <a href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`} className="font-mono text-slate-900 font-semibold flex items-center gap-1">
                          <Phone className="h-3 w-3 text-slate-500" /> {lead.phone}
                        </a>
                        <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                          <Video className="h-3 w-3 text-slate-600" /> {lead.video_type}
                          {lead.video_quantity && ` (x${lead.video_quantity})`}
                        </span>
                      </div>

                      {/* Status selectors */}
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Lead Status</label>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead, e.target.value as LeadStatus)}
                            className={`w-full rounded-lg px-2 py-1 text-[11px] font-bold ${getLeadStatusBadge(lead.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Hold">Hold</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-slate-400 block mb-0.5">Project Status</label>
                          <select
                            value={lead.project_status || "In Progress"}
                            onChange={(e) => handleUpdateProjectStatus(lead, e.target.value as ProjectStatus)}
                            className={`w-full rounded-lg px-2 py-1 text-[11px] font-bold ${getProjectStatusBadge(lead.project_status)}`}
                          >
                            <option value="Hold">Hold</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div className="text-[10px] text-slate-400">
                          {new Date(lead.created_at).toLocaleDateString()}
                        </div>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Call"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(lead)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="WhatsApp"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewLeadDetails(lead)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLead(lead)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSoftDeleteLead(lead.id)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: META LEADS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === "meta_leads" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Clean Section Header */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <Megaphone className="h-5 w-5 text-purple-600" />
                  <h2 className="text-base font-bold text-slate-900 sm:text-lg">Meta Ads Leads Management</h2>
                  <span className="rounded-full bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-xs font-bold text-purple-700 font-mono">
                    {metaLeads.length} Leads
                  </span>
                </div>
                <p className="mt-0.5 text-xs text-slate-500">
                  Managing client inquiries from Facebook Ads and Instagram lead generation forms.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal("Meta Ads")}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-purple-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-purple-700 transition-all cursor-pointer"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>Add Meta Lead</span>
                </button>
                <button
                  type="button"
                  onClick={() => exportMetaCSV()}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Section 17: Meta Lead & Project Real-Time Summary Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8 sm:gap-3.5">
              {/* Total Meta */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterStatus("All");
                  setMetaFilterProjectStatus("All");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterStatus === "All" && metaFilterProjectStatus === "All"
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
                title="Click to view all Meta leads"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Total Meta</span>
                  <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Megaphone className="h-3.5 w-3.5" />
                  </div>
                </div>
                <p className="mt-2 text-2xl font-black text-slate-900">{metaTotalCount}</p>
              </button>

              {/* New */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterStatus(metaFilterStatus === "New" ? "All" : "New");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterStatus === "New"
                    ? "border-blue-500 ring-2 ring-blue-500/30 bg-blue-50/30"
                    : "border-slate-200/90 hover:border-blue-300"
                }`}
                title="Click to filter by New status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>New</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-500 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-blue-600">{metaNewCount}</p>
              </button>

              {/* Contacted */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterStatus(metaFilterStatus === "Contacted" ? "All" : "Contacted");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterStatus === "Contacted"
                    ? "border-amber-500 ring-2 ring-amber-500/30 bg-amber-50/30"
                    : "border-slate-200/90 hover:border-amber-300"
                }`}
                title="Click to filter by Contacted status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Contacted</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-500 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-amber-600">{metaContactedCount}</p>
              </button>

              {/* In Progress */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterStatus(metaFilterStatus === "In Progress" ? "All" : "In Progress");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterStatus === "In Progress"
                    ? "border-orange-500 ring-2 ring-orange-500/30 bg-orange-50/30"
                    : "border-slate-200/90 hover:border-orange-300"
                }`}
                title="Click to filter by In Progress status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>In Progress</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-orange-600">{metaInProgressCount}</p>
              </button>

              {/* Hold */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterStatus(metaFilterStatus === "Hold" ? "All" : "Hold");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterStatus === "Hold"
                    ? "border-slate-500 ring-2 ring-slate-500/30 bg-slate-100/50"
                    : "border-slate-200/90 hover:border-slate-300"
                }`}
                title="Click to filter by On Hold status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Hold</span>
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400 shadow-xs" />
                </div>
                <p className="mt-2 text-2xl font-black text-slate-700">{metaHoldCount}</p>
              </button>

              {/* Closed */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterStatus(metaFilterStatus === "Closed" ? "All" : "Closed");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterStatus === "Closed"
                    ? "border-emerald-500 ring-2 ring-emerald-500/30 bg-emerald-50/30"
                    : "border-slate-200/90 hover:border-emerald-300"
                }`}
                title="Click to filter by Closed status"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Closed</span>
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-emerald-600">{metaClosedCount}</p>
              </button>

              {/* Projects In Progress */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterProjectStatus(metaFilterProjectStatus === "In Progress" ? "All" : "In Progress");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterProjectStatus === "In Progress"
                    ? "border-cyan-500 ring-2 ring-cyan-500/30 bg-cyan-50/30"
                    : "border-slate-200/90 hover:border-cyan-300"
                }`}
                title="Click to filter by Projects in progress"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Proj. Active</span>
                  <Clock className="h-4 w-4 text-cyan-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-cyan-600">{metaProjectsInProgressCount}</p>
              </button>

              {/* Delivered */}
              <button
                type="button"
                onClick={() => {
                  setMetaFilterProjectStatus(metaFilterProjectStatus === "Delivered" ? "All" : "Delivered");
                }}
                className={`rounded-2xl border bg-white p-3.5 shadow-xs transition-all hover:shadow-md text-left cursor-pointer ${
                  metaFilterProjectStatus === "Delivered"
                    ? "border-purple-500 ring-2 ring-purple-500/30 bg-purple-50/30"
                    : "border-slate-200/90 hover:border-purple-300"
                }`}
                title="Click to filter by Delivered projects"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>Delivered</span>
                  <Package className="h-4 w-4 text-purple-500" />
                </div>
                <p className="mt-2 text-2xl font-black text-purple-600">{metaDeliveredCount}</p>
              </button>
            </div>

            {/* Actions & Filters Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-xs space-y-3.5 transition-colors">
              {/* Top Row: Search + Quick Action Buttons */}
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative flex-1 min-w-0 max-w-lg">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search Meta leads by Name, Business, Phone, Notes..."
                    value={metaSearchTerm}
                    onChange={(e) => setMetaSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleApplyMetaFilters();
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2 pl-9 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  {metaSearchTerm && (
                    <button
                      type="button"
                      onClick={() => setMetaSearchTerm("")}
                      className="absolute right-2.5 top-2.5 text-xs text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      ✕
                    </button>
                  )}
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => setShowAddLeadModal(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-900 bg-slate-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-black transition-all cursor-pointer shadow-xs"
                  >
                    <Plus className="h-4 w-4" />
                    <span>+ Add Meta Lead</span>
                  </button>

                  <button
                    onClick={() => exportMetaCSV(false)}
                    className="flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer shadow-xs"
                  >
                    <Download className="h-4 w-4 text-slate-800" />
                    <span>Export CSV</span>
                  </button>
                </div>
              </div>

              {/* Bottom Row: Detailed Filters Grid */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
                {/* Meta Source Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Meta Channel:</span>
                  <select
                    value={metaFilterSource}
                    onChange={(e) => setMetaFilterSource(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Meta Channels</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Facebook">Facebook Ads</option>
                    <option value="Instagram">Instagram Ads</option>
                  </select>
                </div>

                {/* Lead Status Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Status:</span>
                  <select
                    value={metaFilterStatus}
                    onChange={(e) => setMetaFilterStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Lead Statuses</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                {/* Project Status Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Project:</span>
                  <select
                    value={metaFilterProjectStatus}
                    onChange={(e) => setMetaFilterProjectStatus(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Project Statuses</option>
                    <option value="Hold">Hold</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                {/* Video Type Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Video Type:</span>
                  <select
                    value={metaFilterVideoType}
                    onChange={(e) => setMetaFilterVideoType(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Video Types</option>
                    {VIDEO_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                {/* Location Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Location:</span>
                  <select
                    value={metaFilterLocation}
                    onChange={(e) => setMetaFilterLocation(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="">All Locations</option>
                    {uniqueLocations.map((loc) => (
                      <option key={loc} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>

                {/* Lead Closed By Filter */}
                <div className="flex items-center gap-1">
                  <span className="text-[11px] font-semibold text-slate-400">Closed By:</span>
                  <select
                    value={metaFilterClosedBy}
                    onChange={(e) => setMetaFilterClosedBy(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="All">All Admins</option>
                    <option value="Super Admin">Super Admin</option>
                    <option value="Admin">Admin</option>
                    {uniqueClosedByAdmins.map((adm) => (
                      <option key={adm} value={adm}>{adm}</option>
                    ))}
                  </select>
                </div>

                {/* Date Filter Selection */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <select
                    value={metaFilterDateType}
                    onChange={(e) => setMetaFilterDateType(e.target.value as any)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none cursor-pointer"
                  >
                    <option value="created_at">Created Date</option>
                    <option value="closed_at">Closed Date</option>
                    <option value="delivery_date">Delivery Date</option>
                  </select>

                  <input
                    type="date"
                    value={metaFromDate}
                    onChange={(e) => setMetaFromDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-xs text-slate-900 focus:outline-none"
                    title="From Date"
                  />
                  <span className="text-slate-400">to</span>
                  <input
                    type="date"
                    value={metaToDate}
                    onChange={(e) => setMetaToDate(e.target.value)}
                    className="rounded-lg border border-slate-200 bg-slate-50/80 px-2 py-1 text-xs text-slate-900 focus:outline-none"
                    title="To Date"
                  />
                </div>

                {/* Apply Filter and Clear Filter Buttons */}
                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={handleApplyMetaFilters}
                    className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
                    title="Apply Filters"
                  >
                    <Filter className="h-3.5 w-3.5" />
                    <span>Apply Filter</span>
                  </button>

                  <button
                    onClick={handleClearMetaFilters}
                    className="flex items-center gap-1 rounded-lg border border-slate-200 bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                    title="Clear Filters"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-slate-400" />
                    <span>Clear Filter</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bulk Actions Bar for Meta Leads */}
            {selectedMetaLeadIds.size > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-blue-500/40 bg-blue-50 p-3 shadow-md">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                  <CheckCircle2 className="h-4 w-4 text-blue-600" />
                  <span>{selectedMetaLeadIds.size} Meta lead(s) selected</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="text-slate-500">Bulk Status:</span>
                  <select
                    onChange={(e) => {
                      if (e.target.value) handleBulkMetaStatusChange(e.target.value as LeadStatus);
                    }}
                    defaultValue=""
                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold cursor-pointer"
                  >
                    <option value="" disabled>Change Status to...</option>
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                  </select>

                  <button
                    onClick={() => exportMetaCSV(true)}
                    className="rounded-lg bg-blue-600 px-3 py-1 text-xs font-bold text-white hover:bg-blue-700 cursor-pointer"
                  >
                    Export Selected
                  </button>

                  <button
                    onClick={handleBulkMetaDelete}
                    className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-1 text-xs font-bold text-red-600 hover:bg-red-500/20 cursor-pointer"
                  >
                    Move to Recycle Bin
                  </button>

                  <button
                    onClick={() => setSelectedMetaLeadIds(new Set())}
                    className="text-xs text-slate-500 hover:underline cursor-pointer"
                  >
                    Deselect All
                  </button>
                </div>
              </div>
            )}

            {/* Main Meta Leads Table */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-colors">
              {/* Desktop Table with Horizontal Scroll */}
              <div className="hidden md:block overflow-x-auto w-full">
                <table className="w-full min-w-[1200px] text-left text-xs">
                  <thead className="border-b border-slate-200 bg-slate-50 text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                    <tr>
                      <th className="px-4 py-3.5">
                        <input
                          type="checkbox"
                          checked={filteredMetaLeads.length > 0 && selectedMetaLeadIds.size === filteredMetaLeads.length}
                          onChange={(e) => handleSelectAllMetaLeads(e.target.checked)}
                          className="rounded border-slate-300 text-blue-600 cursor-pointer"
                        />
                      </th>
                      <th className="px-4 py-3.5">Channel</th>
                      <th className="px-4 py-3.5">Timestamp</th>
                      <th className="px-4 py-3.5">Client & Business</th>
                      <th className="px-4 py-3.5">WhatsApp / Phone</th>
                      <th className="px-4 py-3.5">Video Scope</th>
                      <th className="px-4 py-3.5">Lead Status</th>
                      <th className="px-4 py-3.5">Project Status</th>
                      <th className="px-4 py-3.5">Notes</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredMetaLeads.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-16 text-center text-xs text-slate-500">
                          <Megaphone className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                          <p className="font-bold text-sm">No Meta leads match current filter criteria</p>
                          <p className="mt-1 text-slate-400">Incoming leads from Meta Ads, Instagram & Facebook forms will appear here.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredMetaLeads.map((lead) => {
                        const isSelected = selectedMetaLeadIds.has(lead.id);
                        const isNewlyArrived = highlightedLeadIds.has(lead.id);

                        return (
                          <tr
                            key={lead.id}
                            className={`transition-colors hover:bg-slate-50/50 ${
                              isSelected ? "bg-blue-50/60" : ""
                            } ${isNewlyArrived ? "bg-blue-100 ring-1 ring-blue-500" : ""}`}
                          >
                            {/* Checkbox */}
                            <td className="px-4 py-3.5">
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleToggleSelectMetaLead(lead.id)}
                                className="rounded border-slate-300 text-blue-600 cursor-pointer"
                              />
                            </td>

                            {/* Source */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold ${getLeadSourceBadgeClass(lead.source)}`}>
                                {getLeadSourceDisplay(lead.source)}
                              </span>
                            </td>

                            {/* Timestamp */}
                            <td className="whitespace-nowrap px-4 py-3.5 text-xs text-slate-500">
                              {isToday(lead.created_at) ? (
                                <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/40 bg-blue-500/10 px-2 py-0.5 text-[10px] font-bold text-blue-600">
                                  <Calendar className="h-3 w-3" />
                                  Today, {new Date(lead.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                </span>
                              ) : (
                                <div>
                                  <div>{new Date(lead.created_at).toLocaleDateString()}</div>
                                  <div className="text-[10px] text-slate-400">
                                    {new Date(lead.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Client & Business */}
                            <td className="px-4 py-3.5">
                              <button
                                type="button"
                                onClick={() => setViewLeadDetails(lead)}
                                className="text-left font-bold text-sm flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer"
                                title="Click to view full lead details"
                              >
                                <span>{lead.name}</span>
                                {isNewlyArrived && (
                                  <span className="rounded bg-blue-600 px-1 py-0.2 text-[8px] font-black text-white animate-pulse">
                                    JUST NOW
                                  </span>
                                )}
                              </button>
                              <div className="text-xs text-slate-500 font-medium">
                                {lead.business}
                                {lead.location ? ` · ${lead.location}` : ""}
                              </div>
                              {lead.email && <div className="text-[11px] text-slate-400 font-mono">{lead.email}</div>}
                              {lead.is_duplicate && (
                                <div className="mt-1">
                                  <span className="inline-flex items-center gap-1 rounded bg-amber-50 px-1.5 py-0.5 text-[9px] font-bold text-amber-700 border border-amber-200">
                                    Duplicate Flagged
                                  </span>
                                </div>
                              )}
                              {(lead.campaign_name || lead.ad_name || lead.form_name) && (
                                <div className="mt-1 flex flex-wrap gap-1 text-[10px]">
                                  {lead.campaign_name && (
                                    <span className="rounded bg-indigo-50 border border-indigo-200/60 px-1.5 py-0.2 text-indigo-700 font-semibold" title={`Campaign: ${lead.campaign_name}`}>
                                      Camp: {lead.campaign_name}
                                    </span>
                                  )}
                                  {lead.ad_name && (
                                    <span className="rounded bg-purple-50 border border-purple-200/60 px-1.5 py-0.2 text-purple-700 font-semibold" title={`Ad: ${lead.ad_name}`}>
                                      Ad: {lead.ad_name}
                                    </span>
                                  )}
                                  {lead.form_name && (
                                    <span className="rounded bg-slate-100 border border-slate-200 px-1.5 py-0.2 text-slate-600 font-medium" title={`Form: ${lead.form_name}`}>
                                      Form: {lead.form_name}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* WhatsApp / Phone */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <a
                                href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                                className="font-mono text-xs font-semibold hover:text-blue-600 hover:underline flex items-center gap-1"
                              >
                                <Phone className="h-3 w-3 text-slate-400" />
                                <span>{lead.phone}</span>
                              </a>
                            </td>

                            {/* Video Scope */}
                            <td className="px-4 py-3.5">
                              <div className="font-semibold text-xs flex items-center gap-1">
                                <Video className="h-3 w-3 text-blue-500" />
                                <span>{lead.video_type}</span>
                                {lead.video_quantity && (
                                  <span className="rounded bg-slate-100 px-1.5 py-0.2 text-[10px] font-bold">
                                    x{lead.video_quantity}
                                  </span>
                                )}
                              </div>
                              {(lead.requirement || lead.additional) && (
                                <p className="mt-0.5 text-[11px] text-slate-400 line-clamp-1 max-w-xs" title={lead.requirement || lead.additional}>
                                  {lead.requirement || lead.additional}
                                </p>
                              )}
                            </td>

                            {/* Lead Status Dropdown */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <select
                                value={lead.status}
                                onChange={(e) => handleUpdateLeadStatus(lead, e.target.value as LeadStatus)}
                                className={`rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer focus:outline-none ${getLeadStatusBadge(lead.status)}`}
                              >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Hold">Hold</option>
                                <option value="Closed">Closed</option>
                              </select>
                              {lead.closed_by && lead.status === "Closed" && (
                                <div className="text-[10px] text-emerald-600 mt-0.5">
                                  By: {lead.closed_by}
                                </div>
                              )}
                            </td>

                            {/* Project Status Dropdown */}
                            <td className="whitespace-nowrap px-4 py-3.5">
                              <select
                                value={lead.project_status || "In Progress"}
                                onChange={(e) => handleUpdateProjectStatus(lead, e.target.value as ProjectStatus)}
                                className={`rounded-lg border px-2.5 py-1 text-xs font-bold cursor-pointer focus:outline-none ${getProjectStatusBadge(lead.project_status)}`}
                              >
                                <option value="Hold">Hold</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Delivered">Delivered</option>
                              </select>
                              {lead.delivery_date && (
                                <div className="text-[10px] text-slate-400 mt-0.5">
                                  Due: {lead.delivery_date}
                                </div>
                              )}
                            </td>

                            {/* Notes Snippet */}
                            <td className="px-4 py-3.5 max-w-[150px]">
                              {lead.notes ? (
                                <p className="text-xs text-slate-600 line-clamp-2" title={lead.notes}>
                                  {lead.notes}
                                </p>
                              ) : (
                                <span className="text-[11px] text-slate-400 italic">No notes</span>
                              )}
                            </td>

                            {/* Actions (Section 09: Action Buttons) */}
                            <td className="whitespace-nowrap px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* 1. Call */}
                                <a
                                  href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Call Client"
                                >
                                  <Phone className="h-3.5 w-3.5" />
                                </a>

                                {/* 2. WhatsApp */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenWhatsApp(lead)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Chat on WhatsApp"
                                >
                                  <WhatsAppIcon className="h-3.5 w-3.5" />
                                </button>

                                {/* 3. View Details */}
                                <button
                                  type="button"
                                  onClick={() => setViewLeadDetails(lead)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="View Full Profile"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>

                                {/* 4. Edit Lead */}
                                <button
                                  type="button"
                                  onClick={() => setEditingLead(lead)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Edit Lead"
                                >
                                  <Edit className="h-3.5 w-3.5" />
                                </button>

                                {/* 5. Delete Lead */}
                                <button
                                  type="button"
                                  onClick={() => handleSoftDeleteLead(lead.id)}
                                  className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all cursor-pointer inline-flex items-center justify-center"
                                  title="Delete Lead"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards View */}
              <div className="divide-y divide-slate-100 md:hidden">
                {filteredMetaLeads.length === 0 ? (
                  <div className="py-12 text-center text-xs text-slate-500">
                    <Megaphone className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="font-bold text-sm">No Meta leads match filters</p>
                  </div>
                ) : (
                  filteredMetaLeads.map((lead) => (
                    <div key={lead.id} className="p-4 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedMetaLeadIds.has(lead.id)}
                              onChange={() => handleToggleSelectMetaLead(lead.id)}
                              className="rounded border-slate-300 text-blue-600 cursor-pointer"
                            />
                            <h4 className="font-bold text-sm text-slate-900">{lead.name}</h4>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">{lead.business}</p>
                        </div>
                        <span className={`shrink-0 rounded border px-2 py-0.5 text-[10px] font-bold ${getLeadSourceBadgeClass(lead.source)}`}>
                          {getLeadSourceDisplay(lead.source)}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Lead Status:</span>
                          <select
                            value={lead.status}
                            onChange={(e) => handleUpdateLeadStatus(lead, e.target.value as LeadStatus)}
                            className={`w-full mt-1 rounded-lg border px-2 py-1 text-xs font-bold ${getLeadStatusBadge(lead.status)}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Hold">Hold</option>
                            <option value="Closed">Closed</option>
                          </select>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">Project Status:</span>
                          <select
                            value={lead.project_status || "In Progress"}
                            onChange={(e) => handleUpdateProjectStatus(lead, e.target.value as ProjectStatus)}
                            className={`w-full mt-1 rounded-lg border px-2 py-1 text-xs font-bold ${getProjectStatusBadge(lead.project_status)}`}
                          >
                            <option value="Hold">Hold</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Delivered">Delivered</option>
                          </select>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                        <a
                          href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                          className="text-xs font-mono font-semibold text-slate-900 hover:underline flex items-center gap-1"
                        >
                          <Phone className="h-3 w-3 text-slate-500" />
                          <span>{lead.phone}</span>
                        </a>

                        <div className="flex items-center gap-1.5">
                          <a
                            href={`tel:${lead.phone.replace(/[^0-9+]/g, "")}`}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Call"
                          >
                            <Phone className="h-3.5 w-3.5" />
                          </a>
                          <button
                            type="button"
                            onClick={() => handleOpenWhatsApp(lead)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="WhatsApp"
                          >
                            <WhatsAppIcon className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setViewLeadDetails(lead)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="View"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingLead(lead)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Edit"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSoftDeleteLead(lead.id)}
                            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer inline-flex items-center justify-center"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: ORDERS & PAYPAL PAYMENTS */}
        {/* ========================================================================= */}
        {activeTab === "orders" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Orders KPI Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              <div className={`rounded-xl border p-4 shadow-sm ${
                isDark ? "border-slate-800 bg-[#12101e]" : "border-slate-200 bg-white"
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
                  <span>Total Orders</span>
                  <Package className="h-4 w-4 text-purple-500" />
                </div>
                <p className="mt-2 text-2xl font-extrabold">{orders.length}</p>
              </div>

              <div className={`rounded-xl border p-4 shadow-sm ${
                isDark ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-300" : "border-emerald-200 bg-emerald-50/70 text-emerald-900"
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Total Revenue</span>
                  <DollarSign className="h-4 w-4 text-emerald-500" />
                </div>
                <p className="mt-2 text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                  ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>

              <div className={`rounded-xl border p-4 shadow-sm ${
                isDark ? "border-blue-500/30 bg-blue-950/20 text-blue-300" : "border-blue-200 bg-blue-50/70 text-blue-900"
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Completed (Paid)</span>
                  <CheckCircle2 className="h-4 w-4 text-blue-500" />
                </div>
                <p className="mt-2 text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                  {orders.filter((o) => o.payment_status === "COMPLETED").length}
                </p>
              </div>

              <div className={`rounded-xl border p-4 shadow-sm ${
                isDark ? "border-amber-500/30 bg-amber-950/20 text-amber-300" : "border-amber-200 bg-amber-50/70 text-amber-900"
              }`}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span>Pending</span>
                  <Clock className="h-4 w-4 text-amber-500" />
                </div>
                <p className="mt-2 text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                  {orders.filter((o) => o.payment_status === "PENDING").length}
                </p>
              </div>
            </div>

            {/* Orders Search & Filter */}
            <div className={`rounded-2xl border p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isDark ? "border-slate-800 bg-[#12101e]" : "border-slate-200 bg-white"
            }`}>
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search customer name, email, order ID..."
                  value={orderSearchTerm}
                  onChange={(e) => setOrderSearchTerm(e.target.value)}
                  className={`w-full rounded-xl border py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={filterOrderStatus}
                  onChange={(e) => setFilterOrderStatus(e.target.value)}
                  className={`rounded-lg border px-3 py-2 text-xs font-semibold focus:outline-none cursor-pointer ${
                    isDark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <option value="COMPLETED">Completed (Paid)</option>
                  <option value="All">All Statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="FAILED">Failed / Cancelled</option>
                  <option value="REFUNDED">Refunded</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className={`overflow-x-auto w-full rounded-2xl border shadow-sm ${
              isDark ? "border-slate-800 bg-[#12101e]" : "border-slate-200 bg-white"
            }`}>
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead className={`border-b text-[11px] font-bold uppercase tracking-wider ${
                  isDark ? "border-slate-800 bg-[#171427] text-slate-400" : "border-slate-200 bg-slate-50 text-slate-600"
                }`}>
                  <tr>
                    <th className="px-4 py-3.5">Customer</th>
                    <th className="px-4 py-3.5">Package / Item</th>
                    <th className="px-4 py-3.5 text-center">Amount</th>
                    <th className="px-4 py-3.5 text-center">Payment Status</th>
                    <th className="px-4 py-3.5">PayPal Order ID</th>
                    <th className="px-4 py-3.5">Date</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-slate-500">
                        No PayPal orders found matching criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.02]">
                        <td className="px-4 py-3.5">
                          <div className="font-bold">{order.customer_name}</div>
                          <div className="text-[11px] text-slate-500 font-mono">{order.customer_email}</div>
                          {order.customer_phone && <div className="text-[10px] text-slate-400">{order.customer_phone}</div>}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="font-semibold">{order.item_name}</div>
                          <span className="inline-block rounded bg-purple-500/10 text-purple-600 dark:text-purple-300 px-1.5 py-0.2 text-[9px] font-bold uppercase mt-0.5">
                            {order.item_type}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          ${Number(order.amount).toFixed(2)} {order.currency}
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                            order.payment_status === "COMPLETED"
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                              : "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300"
                          }`}>
                            {order.payment_status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-slate-500 select-all">
                          {order.paypal_order_id}
                        </td>
                        <td className="px-4 py-3.5 text-xs text-slate-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <button
                            onClick={() => setSelectedOrderDetails(order)}
                            className="rounded-lg border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                          >
                            Details
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: CALENDLY MEETINGS (USA FOCUS & CRM INTEGRATION) */}
        {/* ========================================================================= */}
        {activeTab === "calendly" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header & Quick Action Bar */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <h3 className="text-base font-bold text-slate-900">Calendly Strategy Calls & Meetings (USA)</h3>
                  <span className="rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-extrabold text-blue-700">
                    {meetings.length} Total
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Connect Calendly directly with the CRM. Live auto-sync with Calendly scheduled events, track meeting dates, client contact, meeting links, and statuses.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSyncCalendly}
                  disabled={isSyncingCalendly}
                  className="rounded-xl border border-blue-500/40 bg-blue-500/10 px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-500/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
                  title="Sync latest meetings from Calendly API"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isSyncingCalendly ? "animate-spin text-blue-600" : ""}`} />
                  <span>{isSyncingCalendly ? "Syncing Calendly..." : "Sync from Calendly"}</span>
                </button>

                <a
                  href="https://calendly.com/qsaistudio/quickupp-ai-studio-30-min-strategy-call"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Calendly Page</span>
                </a>
              </div>
            </div>

            {/* KPI Summary Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                type="button"
                onClick={() => setMeetingStatusFilter("all")}
                className={`rounded-xl border p-3.5 text-left cursor-pointer transition-all ${
                  meetingStatusFilter === "all"
                    ? "border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20"
                    : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <p className="text-[11px] font-bold text-slate-500 uppercase">Total Meetings</p>
                <p className="text-xl font-extrabold text-blue-600 mt-1">{meetings.length}</p>
              </button>

              <button
                type="button"
                onClick={() => setMeetingStatusFilter(meetingStatusFilter === "scheduled" ? "all" : "scheduled")}
                className={`rounded-xl border p-3.5 text-left cursor-pointer transition-all ${
                  meetingStatusFilter === "scheduled"
                    ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-50/20"
                    : "border-slate-200 bg-white hover:border-purple-300"
                }`}
              >
                <p className="text-[11px] font-bold text-slate-500 uppercase">Upcoming / Scheduled</p>
                <p className="text-xl font-extrabold text-purple-600 mt-1">
                  {meetings.filter((m) => m.meeting_status === "scheduled" || m.meeting_status === "upcoming").length}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMeetingStatusFilter(meetingStatusFilter === "completed" ? "all" : "completed")}
                className={`rounded-xl border p-3.5 text-left cursor-pointer transition-all ${
                  meetingStatusFilter === "completed"
                    ? "border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/20"
                    : "border-slate-200 bg-white hover:border-emerald-300"
                }`}
              >
                <p className="text-[11px] font-bold text-slate-500 uppercase">Completed Calls</p>
                <p className="text-xl font-extrabold text-emerald-600 mt-1">
                  {meetings.filter((m) => m.meeting_status === "completed").length}
                </p>
              </button>

              <button
                type="button"
                onClick={() => setMeetingStatusFilter(meetingStatusFilter === "cancelled" ? "all" : "cancelled")}
                className={`rounded-xl border p-3.5 text-left cursor-pointer transition-all ${
                  meetingStatusFilter === "cancelled"
                    ? "border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/20"
                    : "border-slate-200 bg-white hover:border-amber-300"
                }`}
              >
                <p className="text-[11px] font-bold text-slate-500 uppercase">Rescheduled / Cancelled</p>
                <p className="text-xl font-extrabold text-amber-600 mt-1">
                  {meetings.filter((m) => m.meeting_status === "rescheduled" || m.meeting_status === "cancelled").length}
                </p>
              </button>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search meetings by client, email, phone..."
                  value={meetingSearchTerm}
                  onChange={(e) => setMeetingSearchTerm(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white pl-9 pr-4 py-2 text-xs text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto text-xs">
                {["all", "scheduled", "upcoming", "completed", "rescheduled", "cancelled"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setMeetingStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 font-bold capitalize transition-colors cursor-pointer text-[11px] whitespace-nowrap ${
                      meetingStatusFilter === st
                        ? "bg-blue-600 text-white shadow-xs"
                        : "text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    {st === "all" ? "All Statuses" : st}
                  </button>
                ))}
              </div>
            </div>

            {/* Meetings Table (Matching Section 14 in Document) */}
            <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 bg-white shadow-xs">
              <table className="w-full min-w-[950px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-4 py-3.5">Meeting Date & Time</th>
                    <th className="px-4 py-3.5">Client Name & Contact</th>
                    <th className="px-4 py-3.5">Meeting Type</th>
                    <th className="px-4 py-3.5">Meeting Status</th>
                    <th className="px-4 py-3.5">Meeting Link</th>
                    <th className="px-4 py-3.5">Handling User</th>
                    <th className="px-4 py-3.5">Created Date</th>
                    <th className="px-4 py-3.5 text-right">Workflow Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {meetings
                    .filter((m) => {
                      const matchSearch =
                        m.client_name.toLowerCase().includes(meetingSearchTerm.toLowerCase()) ||
                        m.email.toLowerCase().includes(meetingSearchTerm.toLowerCase()) ||
                        (m.phone && m.phone.includes(meetingSearchTerm));
                      const matchStatus =
                        meetingStatusFilter === "all" ? true : m.meeting_status === meetingStatusFilter;
                      return matchSearch && matchStatus;
                    })
                    .length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-12 text-center text-xs text-slate-500">
                        <Calendar className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="font-bold">No Calendly meetings match your search or filter.</p>
                        <p className="text-[11px] text-slate-400 mt-1">New strategy calls booked via Calendly will appear here automatically.</p>
                      </td>
                    </tr>
                  ) : (
                      meetings
                        .filter((m) => {
                          const matchSearch =
                            m.client_name.toLowerCase().includes(meetingSearchTerm.toLowerCase()) ||
                            m.email.toLowerCase().includes(meetingSearchTerm.toLowerCase()) ||
                            (m.phone && m.phone.includes(meetingSearchTerm));
                          const matchStatus =
                            meetingStatusFilter === "all" ? true : m.meeting_status === meetingStatusFilter;
                          return matchSearch && matchStatus;
                        })
                        .map((m) => {
                          const matchedLead = findMatchingLeadForMeeting(m);
                          return (
                          <tr key={m.id} className="hover:bg-slate-50/75 transition-colors border-b border-slate-100">
                            {/* 1. Meeting Date & Time */}
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-blue-600">{m.meeting_date}</div>
                              <div className="text-[11px] text-slate-500 font-mono mt-0.5">{m.meeting_time}</div>
                            </td>

                            {/* 2. Client Name & Contact & Matching Lead (§14) */}
                            <td className="px-4 py-3.5">
                              <div className="font-bold text-sm text-slate-900">{m.client_name}</div>
                              <div className="text-[11px] text-slate-500 font-mono">{m.email}</div>
                              {m.phone && <div className="text-[10px] text-slate-400 font-mono">{m.phone}</div>}

                              {/* Lead Matching Badge (§14) */}
                              <div className="mt-1.5 flex items-center gap-1.5">
                                {matchedLead ? (
                                  <button
                                    type="button"
                                    onClick={() => setViewLeadDetails(matchedLead)}
                                    className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors cursor-pointer"
                                    title="Matching lead found! Click to view lead details & update status"
                                  >
                                    <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                                    <span>CRM Lead: {matchedLead.status}</span>
                                  </button>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setPrefillLeadFromMeeting({
                                        name: m.client_name,
                                        email: m.email,
                                        phone: m.phone || "",
                                        business: `Inbound Call - ${m.client_name}`,
                                        source: "USA Website - Calendly",
                                        notes: `Calendly meeting on ${m.meeting_date} at ${m.meeting_time}.\nMeeting Link: ${m.meeting_link || "N/A"}`,
                                      });
                                      setShowAddLeadModal(true);
                                    }}
                                    className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                                    title="No existing lead matched by email/phone/name. Click to create a new lead."
                                  >
                                    <Plus className="h-3 w-3 text-blue-600" />
                                    <span>+ Create Lead</span>
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* 3. Meeting Type */}
                            <td className="px-4 py-3.5 font-medium text-slate-800 text-xs">
                              <span>{m.meeting_type || "Quickupp AI Studio - 30 Min Strategy Call"}</span>
                            </td>

                            {/* 4. Meeting Status (Locked Badge if Cancelled, Dropdown if Active) */}
                            <td className="px-4 py-3.5">
                              {m.meeting_status === "cancelled" ? (
                                <div className="space-y-1 inline-block">
                                  <div className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-extrabold tracking-wide uppercase bg-red-50 text-red-700 border border-red-200 select-none cursor-not-allowed shadow-xs">
                                    <Lock className="h-3 w-3 text-red-500 shrink-0" />
                                    <span>CANCELLED</span>
                                  </div>
                                  <div className="text-[10px] text-red-600 font-semibold leading-tight">
                                    <div className="text-[9px] uppercase tracking-wider text-red-500 font-bold">CANCELLED ON:</div>
                                    <div className="font-mono text-[10px] text-red-600">
                                      {m.cancelled_at
                                        ? new Date(m.cancelled_at).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })
                                        : new Date(m.created_at || Date.now()).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <select
                                  value={m.meeting_status || "scheduled"}
                                  onChange={async (e) => {
                                    const newStatus = e.target.value;
                                    if (newStatus === "cancelled") {
                                      setCancellingMeeting(m);
                                      setCancellationReason("");
                                      return;
                                    }
                                    await updateCalendlyMeetingServerFn({
                                      id: m.id,
                                      meeting_status: newStatus,
                                      performedBy: session?.name || "Admin",
                                    });
                                    setMeetings((prev) =>
                                      prev.map((item) =>
                                        item.id === m.id ? { ...item, meeting_status: newStatus } : item
                                      )
                                    );
                                    showToast(`Meeting status updated to ${newStatus}`);
                                    await fetchMeetingsList();
                                    await fetchNotificationsList();
                                    await fetchLogsList();
                                  }}
                                  className={`rounded-lg px-2.5 py-1 text-[11px] font-bold uppercase border cursor-pointer ${
                                    m.meeting_status === "completed"
                                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                      : m.meeting_status === "rescheduled"
                                      ? "bg-amber-50 text-amber-700 border-amber-200"
                                      : "bg-blue-50 text-blue-700 border-blue-200"
                                  }`}
                                >
                                  <option value="scheduled">Scheduled</option>
                                  <option value="upcoming">Upcoming</option>
                                  <option value="completed">Completed</option>
                                  <option value="rescheduled">Rescheduled</option>
                                  <option value="cancelled">❌ Cancel Meeting...</option>
                                </select>
                              )}
                            </td>

                            {/* 5. Meeting Link */}
                            <td className="px-4 py-3.5">
                              {m.meeting_status === "cancelled" ? (
                                <span className="inline-flex items-center gap-1 rounded-md bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600 border border-red-200">
                                  Link Removed
                                </span>
                              ) : m.meeting_link ? (
                                <a
                                  href={m.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:underline font-mono text-xs font-semibold"
                                >
                                  <span>Join Call</span>
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              ) : (
                                <span className="text-slate-400 italic">No link</span>
                              )}
                            </td>

                            {/* 6. Admin / Handling User */}
                            <td className="px-4 py-3.5">
                              <select
                                value={m.assigned_admin || ""}
                                onChange={async (e) => {
                                  const newAdmin = e.target.value;
                                  await updateCalendlyMeetingServerFn({
                                    id: m.id,
                                    assigned_admin: newAdmin,
                                    performedBy: session?.name || "Admin",
                                  });
                                  setMeetings((prev) =>
                                    prev.map((item) => (item.id === m.id ? { ...item, assigned_admin: newAdmin } : item))
                                  );
                                  showToast("Handling admin assigned");
                                }}
                                className="rounded-lg px-2 py-1 text-[11px] font-medium border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer outline-none"
                              >
                                <option value="">Unassigned</option>
                                <option value="superadmin@aistudio.com">Super Admin</option>
                                <option value="admin@aistudio.com">Admin</option>
                                {adminUsers.map((u) => (
                                  <option key={u.id} value={u.email}>
                                    {u.name} ({u.email})
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* 7. Meeting Created Date */}
                            <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                              {new Date(m.created_at).toLocaleDateString()}
                            </td>

                            {/* 8. Workflow Actions (§14) */}
                            <td className="px-4 py-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {matchedLead ? (
                                  <button
                                    onClick={() => setViewLeadDetails(matchedLead)}
                                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors"
                                    title="View & Update Matching CRM Lead"
                                  >
                                    View Lead
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => {
                                      setPrefillLeadFromMeeting({
                                        name: m.client_name,
                                        email: m.email,
                                        phone: m.phone || "",
                                        business: `Inbound Call - ${m.client_name}`,
                                        source: "USA Website - Calendly",
                                        notes: `Calendly meeting on ${m.meeting_date} at ${m.meeting_time}.\nMeeting Link: ${m.meeting_link || "N/A"}`,
                                      });
                                      setShowAddLeadModal(true);
                                    }}
                                    className="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors"
                                    title="Create CRM Lead from this meeting"
                                  >
                                    + Lead
                                  </button>
                                )}

                                {m.meeting_status !== "cancelled" && (
                                  <button
                                    onClick={() => setEditingMeeting(m)}
                                    className="rounded-lg border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors inline-flex items-center justify-center"
                                    title="Edit Meeting Details"
                                  >
                                    <Edit className="h-3.5 w-3.5" />
                                  </button>
                                )}

                                {m.meeting_status !== "cancelled" && (
                                  <button
                                    onClick={() => {
                                      setCancellingMeeting(m);
                                      setCancellationReason("");
                                    }}
                                    className="rounded-lg border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors inline-flex items-center justify-center"
                                    title="Cancel Meeting"
                                  >
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                )}

                                <button
                                  onClick={async () => {
                                    if (confirm(`Permanently delete meeting record for ${m.client_name}?`)) {
                                      setMeetings((prev) => prev.filter((item) => item.id !== m.id));
                                      try {
                                        const res = await deleteCalendlyMeetingServerFn({
                                          id: m.id,
                                          client_name: m.client_name,
                                          performedBy: session?.name || "Admin",
                                        });
                                        if (res.success) {
                                          showToast("Meeting record removed");
                                        } else {
                                          showToast("Meeting deleted from list");
                                        }
                                      } catch (err: any) {
                                        showToast("Meeting removed");
                                      }
                                      await fetchMeetingsList();
                                      await fetchNotificationsList();
                                      await fetchLogsList();
                                    }
                                  }}
                                  className="rounded-lg border border-slate-300 bg-white p-1 text-slate-700 hover:bg-slate-900 hover:text-white cursor-pointer transition-colors inline-flex items-center justify-center"
                                  title="Delete Meeting Record"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          );
                        })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: ACTIVITY HISTORY / AUDIT LOG (CALENDLY, LEADS, USER ACTIVITY) */}
        {/* ========================================================================= */}
        {activeTab === "activity" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header Card with Category Pills & Search */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-slate-900">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <span>Activity History & Audit Logs</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Real-time audit log categorized across Calendly bookings, Leads lifecycle, and User administrative actions.
                  </p>
                </div>

                {/* Search Input */}
                <div className="relative w-full md:w-72">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={activitySearchTerm}
                    onChange={(e) => setActivitySearchTerm(e.target.value)}
                    placeholder="Search logs, actions, users..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-8 py-2 text-xs text-slate-900 focus:bg-white focus:border-blue-500 focus:outline-none transition-colors"
                  />
                  {activitySearchTerm && (
                    <button
                      onClick={() => setActivitySearchTerm("")}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 3 Categories + All Filter Bar */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-slate-100 scrollbar-none">
                <button
                  onClick={() => setActivityCategoryFilter("all")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activityCategoryFilter === "all"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                  }`}
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>All Activities</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activityCategoryFilter === "all" ? "bg-white/20 text-white" : "bg-slate-200 text-slate-700"
                  }`}>
                    {activityLogs.length}
                  </span>
                </button>

                {/* 1. Calendly Category */}
                <button
                  onClick={() => setActivityCategoryFilter("calendly")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activityCategoryFilter === "calendly"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                  }`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Calendly</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activityCategoryFilter === "calendly" ? "bg-white/20 text-white" : "bg-indigo-200 text-indigo-900"
                  }`}>
                    {calendlyActivityLogs.length}
                  </span>
                </button>

                {/* 2. Leads Category */}
                <button
                  onClick={() => setActivityCategoryFilter("leads")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activityCategoryFilter === "leads"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-100"
                  }`}
                >
                  <Users className="h-3.5 w-3.5" />
                  <span>Leads</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activityCategoryFilter === "leads" ? "bg-white/20 text-white" : "bg-emerald-200 text-emerald-900"
                  }`}>
                    {leadsActivityLogs.length}
                  </span>
                </button>

                {/* 3. User Activity Category */}
                <button
                  onClick={() => setActivityCategoryFilter("user_activity")}
                  className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    activityCategoryFilter === "user_activity"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-100"
                  }`}
                >
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>User Activity</span>
                  <span className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                    activityCategoryFilter === "user_activity" ? "bg-white/20 text-white" : "bg-purple-200 text-purple-900"
                  }`}>
                    {userActivityLogs.length}
                  </span>
                </button>
              </div>

              {/* 2 Segregation Sub-tabs under Leads Activity: Website/Manual Leads vs Meta Leads */}
              {activityCategoryFilter === "leads" && (
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100 overflow-x-auto scrollbar-none">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                    Segregate Leads:
                  </span>
                  <button
                    onClick={() => setLeadsActivitySubTab("website_manual")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      leadsActivitySubTab === "website_manual"
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    <Users className="h-3 w-3" />
                    <span>Website & Manual Leads</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                        leadsActivitySubTab === "website_manual"
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-700"
                      }`}
                    >
                      {websiteLeadsActivityLogs.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setLeadsActivitySubTab("meta")}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer shrink-0 ${
                      leadsActivitySubTab === "meta"
                        ? "bg-indigo-600 text-white shadow-xs"
                        : "bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100"
                    }`}
                  >
                    <Megaphone className="h-3 w-3" />
                    <span>Meta Leads</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                        leadsActivitySubTab === "meta"
                          ? "bg-white/20 text-white"
                          : "bg-indigo-200 text-indigo-900"
                      }`}
                    >
                      {metaLeadsActivityLogs.length}
                    </span>
                  </button>

                  <button
                    onClick={() => setLeadsActivitySubTab("all")}
                    className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                      leadsActivitySubTab === "all"
                        ? "bg-slate-800 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}
                  >
                    <span>All Leads</span>
                    <span
                      className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                        leadsActivitySubTab === "all"
                          ? "bg-white/20 text-white"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {leadsActivityLogs.length}
                    </span>
                  </button>
                </div>
              )}
            </div>

            {/* Activity Feed List */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="divide-y divide-slate-100">
                {filteredActivityLogs.length === 0 ? (
                  <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                    <Clock className="mx-auto h-8 w-8 text-slate-300" />
                    <p className="font-bold text-slate-700 text-sm">No activity logs found</p>
                    <p className="text-slate-400 max-w-sm mx-auto">
                      {activitySearchTerm
                        ? `No logs match "${activitySearchTerm}". Try clearing your search.`
                        : activityCategoryFilter === "leads"
                        ? `No activity recorded under ${leadsActivitySubTab === "meta" ? "Meta Leads" : leadsActivitySubTab === "website_manual" ? "Website & Manual Leads" : "Leads"}.`
                        : `No activity recorded under category "${activityCategoryFilter}".`}
                    </p>
                    {(activitySearchTerm || activityCategoryFilter !== "all") && (
                      <button
                        onClick={() => {
                          setActivitySearchTerm("");
                          setActivityCategoryFilter("all");
                        }}
                        className="mt-2 text-xs font-bold text-blue-600 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                ) : (
                  filteredActivityLogs.map((log) => {
                    const isCalendly = calendlyActivityLogs.some((c) => c.id === log.id);
                    const isUserAct = !isCalendly && userActivityLogs.some((u) => u.id === log.id);
                    const isMetaLead = !isCalendly && !isUserAct && metaLeadsActivityLogs.some((m) => m.id === log.id);

                    return (
                      <div
                        key={log.id}
                        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          {/* Category Icon Badge */}
                          <div className="mt-0.5 shrink-0">
                            {isCalendly ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                                <Calendar className="h-4 w-4" />
                              </div>
                            ) : isUserAct ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-200">
                                <Shield className="h-4 w-4" />
                              </div>
                            ) : isMetaLead ? (
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-200">
                                <Megaphone className="h-4 w-4" />
                              </div>
                            ) : (
                              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                                <Users className="h-4 w-4" />
                              </div>
                            )}
                          </div>

                          {/* Content */}
                          <div className="space-y-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-bold text-xs text-slate-900">{log.action}</span>
                              
                              {/* Category tag */}
                              <span className={`rounded px-1.5 py-0.2 text-[9px] font-extrabold uppercase ${
                                isCalendly
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : isUserAct
                                  ? "bg-purple-50 text-purple-700 border border-purple-200"
                                  : isMetaLead
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              }`}>
                                {isCalendly ? "Calendly" : isUserAct ? "User Activity" : isMetaLead ? "Meta Lead" : "Lead"}
                              </span>

                              {/* Performer role tag */}
                              <span className={`rounded-full px-2 py-0.2 text-[9px] font-extrabold uppercase ${
                                log.user_role === "super_admin"
                                  ? "bg-purple-100 text-purple-800"
                                  : "bg-blue-100 text-blue-800"
                              }`}>
                                {log.performed_by}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 leading-relaxed">{log.details}</p>
                          </div>
                        </div>

                        {/* Timestamp */}
                        <div className="text-[11px] text-slate-400 font-mono shrink-0 pl-11 sm:pl-0 sm:text-right">
                          <div>{new Date(log.created_at).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}</div>
                          <div className="text-[10px] text-slate-400">{new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* If User Activity is Selected: Display Admin Login Audit Log Table */}
            {activityCategoryFilter === "user_activity" && loginLogs.length > 0 && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-purple-600" />
                    <span>Admin Login & Access Audit Trail ({loginLogs.length})</span>
                  </h4>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
                  <table className="w-full min-w-[650px] text-left text-xs">
                    <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                      <tr>
                        <th className="px-4 py-3">Admin Email</th>
                        <th className="px-4 py-3">Role</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">IP Address</th>
                        <th className="px-4 py-3">Device / Agent</th>
                        <th className="px-4 py-3 text-right">Login Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loginLogs.map((ll) => (
                        <tr key={ll.id} className="hover:bg-slate-50/75 transition-colors">
                          <td className="px-4 py-3 font-bold font-mono text-slate-900">{ll.email}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-extrabold uppercase text-slate-700">
                              {ll.role}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              ll.status === "failed"
                                ? "bg-red-100 text-red-700"
                                : "bg-emerald-100 text-emerald-700"
                            }`}>
                              {ll.status === "failed" ? "Failed" : "Success"}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-slate-500 text-[11px]">{ll.ip_address || "127.0.0.1"}</td>
                          <td className="px-4 py-3 text-slate-500 truncate max-w-[200px]" title={ll.user_agent}>
                            {ll.user_agent || "Web Browser"}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-slate-400 text-[11px]">
                            {new Date(ll.created_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: USER MANAGEMENT (SUPER ADMIN ONLY) */}
        {/* ========================================================================= */}
        {activeTab === "users" && isSuperAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-purple-900">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Admin User Management (Super Admin Exclusive)</span>
                </h3>
                <p className="text-xs text-purple-700/80 mt-0.5">
                  Create, configure, activate, and deactivate operational Admin accounts. Super Admin accounts remain permanently protected.
                </p>
              </div>

              <button
                onClick={() => setShowAddAdminModal(true)}
                className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-purple-700 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
              >
                <UserPlus className="h-4 w-4" />
                <span>+ Create Admin Account</span>
              </button>
            </div>

            {/* Admin Users Table (Deduplicated, Protected Super Admin) */}
            <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[750px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-4 py-3.5">Name</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-4 py-3.5">Created At</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {uniqueAdminUsers.map((user) => {
                    const isSuper = user.role === "super_admin" || user.email.toLowerCase() === "sa@aistudio.com";

                    return (
                      <tr key={user.email} className="hover:bg-slate-50/75 transition-colors">
                        <td className="px-4 py-3.5 font-bold text-slate-900">{user.name}</td>
                        <td className="px-4 py-3.5 font-mono text-slate-600">{user.email}</td>
                        <td className="px-4 py-3.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            isSuper
                              ? "bg-purple-100 text-purple-800 border border-purple-200"
                              : "bg-blue-100 text-blue-800 border border-blue-200"
                          }`}>
                            {isSuper ? "Super Admin" : "Admin"}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase ${
                            user.status === "active" || isSuper
                              ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                              : "bg-red-100 text-red-800 border border-red-200"
                          }`}>
                            {isSuper ? "Active" : user.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 font-mono text-[11px]">
                          {user.created_at.includes("-") ? new Date(user.created_at).toLocaleDateString() : user.created_at}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          {isSuper ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 border border-purple-200 px-2.5 py-1 text-[11px] font-bold text-purple-700 select-none cursor-not-allowed">
                              <Lock className="h-3 w-3 text-purple-500" />
                              <span>Protected</span>
                            </span>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={async () => {
                                  const nextStatus = user.status === "active" ? "inactive" : "active";
                                  const res = await toggleAdminUserStatusServerFn({
                                    data: {
                                      id: user.id,
                                      status: nextStatus,
                                      email: user.email,
                                      performedBy: session.name,
                                    },
                                  });
                                  if (res.success) {
                                    fetchAdminUsersList();
                                    showToast(`Admin ${user.email} status updated to ${nextStatus}`);
                                  } else {
                                    showToast(res.error || "Failed to update admin status");
                                  }
                                }}
                                className={`rounded-lg px-2.5 py-1 text-xs font-bold border cursor-pointer transition-colors ${
                                  user.status === "active"
                                    ? "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100"
                                    : "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                }`}
                              >
                                {user.status === "active" ? "Deactivate" : "Activate"}
                              </button>

                              <button
                                onClick={async () => {
                                  if (confirm(`Delete admin account for ${user.email}?`)) {
                                    const res = await deleteAdminUserServerFn({
                                      data: { id: user.id, email: user.email, performedBy: session.name },
                                    });
                                    if (res.success) {
                                      fetchAdminUsersList();
                                      showToast(`Admin ${user.email} deleted`);
                                    } else {
                                      showToast(res.error || "Failed to delete admin account");
                                    }
                                  }
                                }}
                                className="rounded-lg border border-red-200 p-1.5 text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
                                title="Delete Admin Account"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: LOGIN & SECURITY LOGS (SUPER ADMIN ONLY) */}
        {/* ========================================================================= */}
        {activeTab === "security" && isSuperAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                <ShieldAlert className="h-5 w-5 text-purple-600" />
                <span>IP / GPS Login Security Tracking</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit log of all login attempts, IP addresses, location metrics, and device user agents.
              </p>
            </div>

            <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[900px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-4 py-3.5">Timestamp</th>
                    <th className="px-4 py-3.5">User Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">IP Address</th>
                    <th className="px-4 py-3.5">Approx Location</th>
                    <th className="px-4 py-3.5">Browser & Device</th>
                    <th className="px-4 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loginLogs.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-slate-500">
                        No login attempts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    loginLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/75 transition-colors">
                        <td className="px-4 py-3.5 text-slate-500 font-mono">
                          {new Date(log.created_at).toLocaleString()}
                        </td>
                        <td className="px-4 py-3.5 font-bold text-slate-900">{log.email}</td>
                        <td className="px-4 py-3.5">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-slate-700">
                            {log.role}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono text-blue-600 font-semibold select-all">
                          {log.ip_address}
                        </td>
                        <td className="px-4 py-3.5 text-slate-600">
                          {log.location || "USA / Web Client"}
                        </td>
                        <td className="px-4 py-3.5 text-slate-400 max-w-xs truncate" title={log.user_agent}>
                          {log.user_agent}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            log.status === "success"
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-red-100 text-red-700"
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: RECYCLE BIN (SOFT-DELETED LEADS WITH BULK ACTIONS) */}
        {/* ========================================================================= */}
        {activeTab === "recycle_bin" && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Header Card with Empty Recycle Bin Action */}
            <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-2 text-red-900">
                  <Trash2 className="h-5 w-5 text-red-600" />
                  <span>Recycle Bin (Soft-Deleted Leads)</span>
                  <span className="rounded-full bg-red-100 border border-red-200 px-2 py-0.5 text-[10px] font-extrabold text-red-700">
                    {recycleBinLeads.length} Total
                  </span>
                </h3>
                <p className="text-xs text-red-700/80 mt-0.5">
                  Soft-deleted leads remain recoverable here. Super Admin can perform bulk restoration, bulk permanent deletion, or empty the entire bin.
                </p>
              </div>

              {isSuperAdmin && recycleBinLeads.length > 0 && (
                <button
                  onClick={handleEmptyRecycleBin}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:bg-red-700 flex items-center gap-1.5 cursor-pointer shrink-0 transition-colors"
                  title="Permanently erase all items in Recycle Bin"
                >
                  <Trash className="h-4 w-4" />
                  <span>⚠️ Empty Recycle Bin</span>
                </button>
              )}
            </div>

            {/* Bulk Actions Floating/Top Toolbar */}
            {selectedRecycleBinIds.size > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs text-red-900 animate-in fade-in shadow-sm">
                <div className="flex items-center gap-2 font-bold">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-[10px] text-white">
                    {selectedRecycleBinIds.size}
                  </span>
                  <span>{selectedRecycleBinIds.size} lead(s) selected</span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleBulkRestoreRecycleBin}
                    className="flex items-center gap-1.5 rounded-lg border border-blue-300 bg-white px-3 py-1 text-xs font-bold text-blue-700 hover:bg-blue-50 shadow-xs cursor-pointer transition-colors"
                  >
                    <RotateCcw className="h-3.5 w-3.5 text-blue-600" />
                    <span>Restore Selected ({selectedRecycleBinIds.size})</span>
                  </button>

                  {isSuperAdmin && (
                    <button
                      onClick={handleBulkPermanentDeleteRecycleBin}
                      className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1 text-xs font-bold text-white hover:bg-red-700 shadow-xs cursor-pointer transition-colors"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>Permanently Delete Selected ({selectedRecycleBinIds.size})</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedRecycleBinIds(new Set())}
                    className="rounded-lg px-2 py-1 text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
                  >
                    Clear selection
                  </button>
                </div>
              </div>
            )}

            {/* Recycle Bin Table */}
            <div className="overflow-x-auto w-full rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="w-full min-w-[850px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                  <tr>
                    <th className="px-4 py-3.5 w-10">
                      <input
                        type="checkbox"
                        checked={recycleBinLeads.length > 0 && selectedRecycleBinIds.size === recycleBinLeads.length}
                        onChange={(e) => handleSelectAllRecycleBin(e.target.checked)}
                        className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                      />
                    </th>
                    <th className="px-4 py-3.5">Client Name</th>
                    <th className="px-4 py-3.5">Phone / Email</th>
                    <th className="px-4 py-3.5">Original Source</th>
                    <th className="px-4 py-3.5">Deleted Date</th>
                    <th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recycleBinLeads.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-14 text-center text-xs text-slate-500">
                        <Trash className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                        <p className="font-bold text-sm text-slate-700">Recycle Bin is empty</p>
                        <p className="text-slate-400 mt-1">Soft-deleted leads will appear here for recovery or permanent erase.</p>
                      </td>
                    </tr>
                  ) : (
                    recycleBinLeads.map((lead) => {
                      const isSelected = selectedRecycleBinIds.has(lead.id);

                      return (
                        <tr
                          key={lead.id}
                          className={`transition-colors ${
                            isSelected ? "bg-red-50/60" : "hover:bg-slate-50/75"
                          }`}
                        >
                          <td className="px-4 py-3.5">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleSelectRecycleBin(lead.id)}
                              className="rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer"
                            />
                          </td>
                          <td className="px-4 py-3.5 font-bold text-slate-900">{lead.name}</td>
                          <td className="px-4 py-3.5">
                            <div className="font-mono text-slate-800">{lead.phone || "N/A"}</div>
                            <div className="text-slate-400 text-[11px] font-mono">{lead.email}</div>
                          </td>
                          <td className="px-4 py-3.5 text-slate-600">{lead.source}</td>
                          <td className="px-4 py-3.5 text-slate-500 font-mono text-[11px]">
                            {lead.deleted_at ? new Date(lead.deleted_at).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "Recently"}
                          </td>
                          <td className="px-4 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleRestoreLead(lead.id)}
                                className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                                title="Restore Lead to Active Leads"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>Restore</span>
                              </button>

                              {isSuperAdmin && (
                                <button
                                  onClick={() => handlePermanentDeleteLead(lead.id)}
                                  className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                                  title="Permanently Erase from Database"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Permanent Erase</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: CRM SETTINGS & SUPER ADMIN SYSTEM CONTROLS */}
        {/* ========================================================================= */}
        {activeTab === "settings" && isSuperAdmin && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Header Hero Card */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <div className="rounded-xl bg-slate-900 p-2 text-white">
                    <Settings className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                      <span>CRM Settings & Super Admin Control Center</span>
                      <span className="rounded-md bg-purple-100 text-purple-800 text-[10px] font-extrabold px-2 py-0.5 border border-purple-200">
                        SUPER ADMIN ONLY
                      </span>
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Configure platform rules, personalize interface colors, export data streams, inspect RBAC permissions, review database counts, view analytics reports, and adjust security policies.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={handleSaveCrmSettings}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer shadow-xs"
                >
                  <Check className="h-3.5 w-3.5" />
                  <span>Save All Settings</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation Bar for the 7 Modules */}
            <div className="flex flex-wrap items-center gap-1.5 border-b border-slate-200 pb-3">
              <button
                onClick={() => setCrmSettingsSubTab("crm_config")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "crm_config"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Sliders className="h-4 w-4" />
                <span>1. CRM Settings</span>
              </button>

              <button
                onClick={() => setCrmSettingsSubTab("colors")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "colors"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Palette className="h-4 w-4" />
                <span>2. Interface Colors</span>
              </button>

              <button
                onClick={() => setCrmSettingsSubTab("export")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "export"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Download className="h-4 w-4" />
                <span>3. Export CRM Data</span>
              </button>

              <button
                onClick={() => setCrmSettingsSubTab("permissions")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "permissions"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <ShieldCheck className="h-4 w-4" />
                <span>4. Permissions Matrix</span>
              </button>

              <button
                onClick={() => setCrmSettingsSubTab("records")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "records"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Database className="h-4 w-4" />
                <span>5. Access All Records</span>
              </button>

              <button
                onClick={() => setCrmSettingsSubTab("reports")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "reports"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <BarChart3 className="h-4 w-4" />
                <span>6. Dashboard Reports</span>
              </button>

              <button
                onClick={() => setCrmSettingsSubTab("security")}
                className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all cursor-pointer ${
                  crmSettingsSubTab === "security"
                    ? "bg-slate-900 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
                }`}
              >
                <Lock className="h-4 w-4" />
                <span>7. Security Settings</span>
              </button>
            </div>

            {/* Saved Notification Banner */}
            {crmSettingsSaved && (
              <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-3.5 text-xs text-emerald-900 flex items-center gap-2 shadow-xs animate-in fade-in">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span className="font-semibold">All Super Admin CRM settings have been successfully updated and persisted.</span>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 1: MANAGE CRM SETTINGS */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "crm_config" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Sliders className="h-4 w-4 text-slate-800" />
                      <span>General Platform & Operational Settings</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure base CRM branding, system notification recipient, default currency, and real-time syncing frequency.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Platform / CRM Title</label>
                      <input
                        type="text"
                        value={crmPlatformTitle}
                        onChange={(e) => setCrmPlatformTitle(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="AI STUDIO USA - Enterprise CRM"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Displayed on the admin portal navigation header and page title.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">System Alert Notification Email</label>
                      <input
                        type="email"
                        value={crmNotificationEmail}
                        onChange={(e) => setCrmNotificationEmail(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900"
                        placeholder="info@quickuppaistudio.us"
                      />
                      <p className="text-[11px] text-slate-400 mt-1">Designated email for high-priority lead and payment notifications.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Default Platform Currency</label>
                      <select
                        value={crmCurrency}
                        onChange={(e) => setCrmCurrency(e.target.value)}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                      >
                        <option value="USD ($)">USD ($) - United States Dollar</option>
                        <option value="EUR (€)">EUR (€) - Euro</option>
                        <option value="GBP (£)">GBP (£) - British Pound</option>
                        <option value="CAD (C$)">CAD (C$) - Canadian Dollar</option>
                        <option value="AUD (A$)">AUD (A$) - Australian Dollar</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1">Applied to revenue calculations and order financial summaries.</p>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Real-Time Data Polling Interval</label>
                      <select
                        value={crmSyncInterval}
                        onChange={(e) => setCrmSyncInterval(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                      >
                        <option value={10}>10 Seconds (Recommended • Real-Time High Precision)</option>
                        <option value={30}>30 Seconds (Balanced Frequency)</option>
                        <option value={60}>60 Seconds (Low Bandwidth Mode)</option>
                        <option value={0}>Manual Refresh Only (No Polling)</option>
                      </select>
                      <p className="text-[11px] text-slate-400 mt-1">Background polling cycle for incoming website leads, Meta leads, and meetings.</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id="audio_chimes_toggle"
                        checked={crmAudioEnabled}
                        onChange={(e) => setCrmAudioEnabled(e.target.checked)}
                        className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                      />
                      <div>
                        <label htmlFor="audio_chimes_toggle" className="text-xs font-bold text-slate-800 cursor-pointer block">
                          Audio Sound Alerts for Inbound Leads & New Orders
                        </label>
                        <span className="text-[11px] text-slate-400">Play an audible chime when real-time leads or checkout events arrive.</span>
                      </div>
                    </div>

                    <button
                      onClick={playTestChime}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer shrink-0"
                    >
                      <Volume2 className="h-3.5 w-3.5" />
                      <span>Test Audio Chime</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 2: CHANGE CRM / INTERFACE COLORS */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "colors" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Palette className="h-4 w-4 text-slate-800" />
                      <span>CRM Interface Appearance & Color Schemes</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Select primary accent highlights, adjust data density modes, and configure visual layout parameters.
                    </p>
                  </div>

                  {/* Accent Color Palettes */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">Primary Theme Accent Palette</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                      {[
                        { id: "slate", name: "Slate Minimal", desc: "Clean Monochrome (System Default)", color: "bg-slate-900" },
                        { id: "royal_blue", name: "Royal Blue", desc: "Classic Corporate Blue", color: "bg-blue-600" },
                        { id: "purple", name: "Electric Purple", desc: "Super Admin Amethyst", color: "bg-purple-600" },
                        { id: "emerald", name: "Emerald Green", desc: "High Conversion Forest", color: "bg-emerald-600" },
                        { id: "indigo", name: "Executive Indigo", desc: "Deep Modern SaaS", color: "bg-indigo-600" },
                      ].map((item) => (
                        <div
                          key={item.id}
                          onClick={() => setCrmAccentTheme(item.id)}
                          className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                            crmAccentTheme === item.id
                              ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/20 shadow-xs"
                              : "border-slate-200 hover:border-slate-300 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-2.5 mb-2">
                            <span className={`h-4 w-4 rounded-full ${item.color}`} />
                            <span className="text-xs font-bold text-slate-900">{item.name}</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Layout Density */}
                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <label className="block text-xs font-bold text-slate-700">Interface Row Density</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl">
                      <div
                        onClick={() => setCrmDensity("comfortable")}
                        className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                          crmDensity === "comfortable"
                            ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900 mb-1">Comfortable (Standard)</div>
                        <p className="text-[11px] text-slate-500">Spacious table row heights, standard padding, and optimal readability.</p>
                      </div>

                      <div
                        onClick={() => setCrmDensity("compact")}
                        className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                          crmDensity === "compact"
                            ? "border-slate-900 bg-slate-50 ring-2 ring-slate-900/20 shadow-xs"
                            : "border-slate-200 hover:border-slate-300"
                        }`}
                      >
                        <div className="text-xs font-bold text-slate-900 mb-1">Compact (High Density)</div>
                        <p className="text-[11px] text-slate-500">Tight data row heights, condensed padding for high-volume lead triaging.</p>
                      </div>
                    </div>
                  </div>

                  {/* High Contrast Toggle */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-800">High Contrast Grid Borders</div>
                      <div className="text-[11px] text-slate-400">Enhance outer cell borders across all data tables for maximum visual separation.</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={crmHighContrast}
                      onChange={(e) => setCrmHighContrast(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 3: EXPORT CRM DATA */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "export" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Download className="h-4 w-4 text-slate-800" />
                      <span>1-Click Complete System Export Center</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Export individual data collections as structured CSV spreadsheets or trigger a full master database backup in JSON format.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
                    {/* Card 1: All Inbound Leads */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <FileSpreadsheet className="h-4 w-4 text-slate-700" />
                          <h4 className="text-xs font-bold text-slate-900">All Inbound Leads (Master)</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Complete list of all inbound leads across USA Website, Meta Ads, and Manual sources ({leads.length} total records).
                        </p>
                      </div>
                      <button
                        onClick={exportAllLeadsMasterCSV}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export All Leads CSV</span>
                      </button>
                    </div>

                    {/* Card 2: Meta Ads Leads */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Megaphone className="h-4 w-4 text-slate-700" />
                          <h4 className="text-xs font-bold text-slate-900">Meta Ads Campaign Leads</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Isolated export of leads generated via Facebook & Instagram advertising campaigns ({metaLeads.length} total records).
                        </p>
                      </div>
                      <button
                        onClick={() => exportMetaCSV(false)}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export Meta Leads CSV</span>
                      </button>
                    </div>

                    {/* Card 3: Orders & Financial Transactions */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <DollarSign className="h-4 w-4 text-slate-700" />
                          <h4 className="text-xs font-bold text-slate-900">Orders & Payment Transactions</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Financial records, customer emails, order values, currency, and PayPal transaction IDs ({orders.length} total records).
                        </p>
                      </div>
                      <button
                        onClick={exportOrdersCSV}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export Orders CSV</span>
                      </button>
                    </div>

                    {/* Card 4: Calendly Meetings */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Calendar className="h-4 w-4 text-slate-700" />
                          <h4 className="text-xs font-bold text-slate-900">Calendly Strategy Meetings</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Scheduled client consultation calls, invitee emails, assigned admins, and meeting timestamps ({meetings.length} total records).
                        </p>
                      </div>
                      <button
                        onClick={exportMeetingsCSV}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export Meetings CSV</span>
                      </button>
                    </div>

                    {/* Card 5: Audit Activity History */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3 flex flex-col justify-between hover:border-slate-300 transition-colors">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Clock className="h-4 w-4 text-slate-700" />
                          <h4 className="text-xs font-bold text-slate-900">System Activity Audit Trail</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Comprehensive security audit history containing user actions, status modifications, and timestamps ({activityLogs.length} total records).
                        </p>
                      </div>
                      <button
                        onClick={exportActivityCSV}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-300 bg-white py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Export Audit Trail CSV</span>
                      </button>
                    </div>

                    {/* Card 6: Master Database JSON Snapshot */}
                    <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50/50 p-4 space-y-3 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Database className="h-4 w-4 text-slate-900" />
                          <h4 className="text-xs font-bold text-slate-900">Master Database JSON Backup</h4>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Complete raw snapshot of all collections, schema definitions, settings, and user entries for full disaster recovery.
                        </p>
                      </div>
                      <button
                        onClick={exportFullBackupJSON}
                        className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-slate-900 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer shadow-xs"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Master JSON Snapshot</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 4: MANAGE SYSTEM PERMISSIONS */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "permissions" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-slate-800" />
                      <span>Role-Based Access Control (RBAC) Matrix</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Operational permissions matrix defining authorization levels between Super Admin and standard Admin accounts.
                    </p>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                        <tr>
                          <th className="px-4 py-3">System Module / Capability</th>
                          <th className="px-4 py-3">Super Admin (sa@aistudio.com)</th>
                          <th className="px-4 py-3">Standard Admin (admin@aistudio.com)</th>
                          <th className="px-4 py-3">Security Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {[
                          { cap: "Dashboard & Real-Time Performance Analytics", sa: "Full Access", ad: "Full Access", sec: "Standard" },
                          { cap: "Website Leads Management & Status Updating", sa: "Full CRUD", ad: "Full CRUD", sec: "Standard" },
                          { cap: "Meta Ads Leads Management & Notes", sa: "Full CRUD", ad: "Full CRUD", sec: "Standard" },
                          { cap: "Calendly Strategy Meetings & Rescheduling", sa: "Full Access", ad: "Full Access", sec: "Standard" },
                          { cap: "Soft-Delete Leads to Recycle Bin", sa: "Full Access", ad: "Full Access", sec: "Standard" },
                          { cap: "Permanent Lead Purge & Empty Recycle Bin", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                          { cap: "Orders & Financial Revenue Access", sa: "Full + PIN Protected", ad: "PIN Protected", sec: "Elevated PIN" },
                          { cap: "Change Master Financial Security PIN", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                          { cap: "Export Inbound Leads & Campaign Data", sa: "Allowed", ad: "Allowed", sec: "Standard" },
                          { cap: "Export Master JSON Disaster Backup", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                          { cap: "Create, Suspend, & Delete Admin Users", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                          { cap: "View Live IP Tracking & Login Audit Logs", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                          { cap: "Modify CRM Settings & Theme Preferences", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                          { cap: "Broadcast Operational System Notice", sa: "Allowed", ad: "Restricted 🔒", sec: "Super Admin Only" },
                        ].map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 py-3 font-semibold text-slate-800">{row.cap}</td>
                            <td className="px-4 py-3 font-bold text-purple-700">
                              <span className="inline-flex items-center gap-1 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-200">
                                <Check className="h-3 w-3" />
                                {row.sa}
                              </span>
                            </td>
                            <td className="px-4 py-3 font-medium text-slate-700">
                              {row.ad.includes("Restricted") ? (
                                <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 px-2 py-0.5 rounded-md border border-red-200 font-bold">
                                  {row.ad}
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md border border-blue-200">
                                  <Check className="h-3 w-3" />
                                  {row.ad}
                                </span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                                row.sec === "Super Admin Only"
                                  ? "bg-purple-100 text-purple-800 border-purple-200"
                                  : row.sec === "Elevated PIN"
                                  ? "bg-amber-100 text-amber-800 border-amber-200"
                                  : "bg-slate-100 text-slate-700 border-slate-200"
                              }`}>
                                {row.sec}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 5: ACCESS ALL RECORDS */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "records" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Database className="h-4 w-4 text-slate-800" />
                        <span>Live Database Master Record Counters</span>
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Real-time inspection of total record counts across all system tables and database collections.
                      </p>
                    </div>

                    <button
                      onClick={fetchData}
                      disabled={isSyncing}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer shrink-0"
                    >
                      <RefreshCw className={`h-3.5 w-3.5 ${isSyncing ? "animate-spin" : ""}`} />
                      <span>{isSyncing ? "Syncing..." : "Force Deep Index Refresh"}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2 border-t border-slate-100">
                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Active Leads</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{leads.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Website + Meta leads</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Recycle Bin</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{recycleBinLeads.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Soft-deleted items</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Orders</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{orders.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">PayPal transactions</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Total Revenue</div>
                      <div className="text-2xl font-black text-emerald-700 mt-1">
                        ${orders.filter(o => (o.payment_status || "").toUpperCase() === "COMPLETED").reduce((sum, o) => sum + (Number(o.amount) || 0), 0).toLocaleString()}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Captured payments</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Calendly Calls</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{meetings.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Booked sessions</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admin Accounts</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{adminUsers.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Provisioned users</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Activity Logs</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{activityLogs.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Audit history entries</div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Security Logs</div>
                      <div className="text-2xl font-black text-slate-900 mt-1">{loginLogs.length}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">Login & IP tracking</div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-slate-50/40 p-4 text-xs text-slate-600 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800">Database Engine Architecture:</span> SQLite Local Storage • WAL Journal Mode • Direct Server Function Execution
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                      Status: Online & Healthy
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 6: VIEW ALL DASHBOARD REPORTS */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "reports" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-slate-800" />
                      <span>Master Dashboard Reports & Performance Analytics</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      In-depth breakdown of lead generation sources, video production pipeline velocity, and conversion ratios.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100">
                    {/* Source Attribution Report */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">1. Lead Acquisition Source Breakdown</h4>
                        <span className="text-[11px] font-semibold text-slate-500">{leads.length} Total</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {[
                          { label: "USA Website Direct", count: leads.filter(l => l.source === "USA Website" || l.source === "Website Direct").length, color: "bg-blue-600" },
                          { label: "Meta Ads (FB/IG)", count: leads.filter(l => (l.source || "").toLowerCase().includes("meta")).length, color: "bg-purple-600" },
                          { label: "Calendly Strategy Calls", count: leads.filter(l => (l.source || "").toLowerCase().includes("calendly")).length, color: "bg-emerald-600" },
                          { label: "Manual Direct Entry", count: leads.filter(l => (l.source || "").toLowerCase().includes("manual")).length, color: "bg-amber-500" },
                        ].map((src, idx) => {
                          const pct = leads.length > 0 ? Math.round((src.count / leads.length) * 100) : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-slate-700">
                                <span>{src.label}</span>
                                <span className="font-bold">{src.count} ({pct}%)</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full ${src.color} rounded-full`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Production Pipeline Report */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold text-slate-900">2. Video Production Pipeline Velocity</h4>
                        <span className="text-[11px] font-semibold text-slate-500">Live Stage Distribution</span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {[
                          { label: "Scripting & Conceptualization", count: leads.filter(l => l.project_status === "Scripting").length, color: "bg-blue-500" },
                          { label: "Voiceover & Audio Synthesis", count: leads.filter(l => l.project_status === "Voiceover").length, color: "bg-amber-500" },
                          { label: "AI Video Production & Render", count: leads.filter(l => l.project_status === "Video Production" || l.project_status === "In Progress").length, color: "bg-purple-500" },
                          { label: "Review & Quality Control", count: leads.filter(l => l.project_status === "Review & QC").length, color: "bg-orange-500" },
                          { label: "Delivered & Client Finalized", count: leads.filter(l => l.project_status === "Delivered" || l.status === "Delivered" || l.status === "Closed").length, color: "bg-emerald-500" },
                        ].map((stage, idx) => {
                          const pct = leads.length > 0 ? Math.round((stage.count / leads.length) * 100) : 0;
                          return (
                            <div key={idx} className="space-y-1">
                              <div className="flex justify-between text-[11px] font-medium text-slate-700">
                                <span>{stage.label}</span>
                                <span className="font-bold">{stage.count} ({pct}%)</span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                                <div className={`h-full ${stage.color} rounded-full`} style={{ width: `${pct}%` }} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Funnel Conversion Metrics */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">3. Lead Conversion Funnel</h4>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-slate-50 p-2.5">
                          <div className="text-[10px] text-slate-500 font-bold">TOTAL INBOUND</div>
                          <div className="text-base font-black text-slate-900 mt-0.5">{leads.length}</div>
                        </div>
                        <div className="rounded-lg bg-blue-50 p-2.5">
                          <div className="text-[10px] text-blue-700 font-bold">CONTACTED</div>
                          <div className="text-base font-black text-blue-900 mt-0.5">
                            {leads.filter(l => l.status === "Contacted" || l.status === "In Progress" || l.status === "Meeting Scheduled").length}
                          </div>
                        </div>
                        <div className="rounded-lg bg-emerald-50 p-2.5">
                          <div className="text-[10px] text-emerald-700 font-bold">WON / CLOSED</div>
                          <div className="text-base font-black text-emerald-900 mt-0.5">
                            {leads.filter(l => l.status === "Closed" || l.status === "Delivered").length}
                          </div>
                        </div>
                      </div>
                      <div className="text-[11px] text-slate-500 font-medium text-center">
                        Pipeline Conversion Rate:{" "}
                        <span className="font-bold text-emerald-700">
                          {leads.length > 0
                            ? ((leads.filter(l => l.status === "Closed" || l.status === "Delivered").length / leads.length) * 100).toFixed(1)
                            : "0.0"}%
                        </span>
                      </div>
                    </div>

                    {/* Popular Video Formats */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-3">
                      <h4 className="text-xs font-bold text-slate-900">4. Video Format Market Demand</h4>
                      <div className="space-y-2 text-xs">
                        {[
                          { name: "Digital Twin Videos", count: leads.filter(l => (l.video_type || "").toLowerCase().includes("twin")).length },
                          { name: "UGC Video Ads", count: leads.filter(l => (l.video_type || "").toLowerCase().includes("ugc")).length },
                          { name: "3D Product Renders", count: leads.filter(l => (l.video_type || "").toLowerCase().includes("3d") || (l.video_type || "").toLowerCase().includes("product")).length },
                          { name: "Explainer & Spokesperson", count: leads.filter(l => (l.video_type || "").toLowerCase().includes("explainer") || (l.video_type || "").toLowerCase().includes("spokesperson")).length },
                        ].map((fmt, idx) => (
                          <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-b-0 text-[11px]">
                            <span className="font-medium text-slate-700">{fmt.name}</span>
                            <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md">{fmt.count} requested</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ========================================================================= */}
            {/* MODULE 7: MANAGE SECURITY-RELATED SETTINGS */}
            {/* ========================================================================= */}
            {crmSettingsSubTab === "security" && (
              <div className="space-y-5 animate-in fade-in">
                <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-xs space-y-5">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-slate-800" />
                      <span>Security, Inactivity Timeout, & Access Control Policies</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Configure automated inactivity session expiration, financial PIN requirements, and system-wide broadcast alerts.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2 border-t border-slate-100 text-xs">
                    {/* Inactivity Timeout Setting */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-slate-700" />
                        <label className="font-bold text-slate-800">Inactivity Auto-Logout Timeout</label>
                      </div>
                      <select
                        value={crmInactivityTimeout}
                        onChange={(e) => setCrmInactivityTimeout(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                      >
                        <option value={5}>5 Minutes (Strict Security Mode)</option>
                        <option value={10}>10 Minutes (Default / Recommended)</option>
                        <option value={15}>15 Minutes (Extended Workspace Session)</option>
                        <option value={30}>30 Minutes (Maximum Permitted)</option>
                      </select>
                      <p className="text-[11px] text-slate-400">
                        Automatically terminates the authenticated session if no keyboard, mouse, or touch events are detected within the selected timeframe.
                      </p>
                    </div>

                    {/* Maximum Failed Login Lockout */}
                    <div className="rounded-xl border border-slate-200 p-4 space-y-2.5">
                      <div className="flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-slate-700" />
                        <label className="font-bold text-slate-800">Failed Login Attempt Threshold</label>
                      </div>
                      <select
                        value={crmLoginAttempts}
                        onChange={(e) => setCrmLoginAttempts(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-2.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-slate-900 cursor-pointer"
                      >
                        <option value={3}>3 Failed Attempts (Strict IP Lockout)</option>
                        <option value={5}>5 Failed Attempts (Standard Recommended)</option>
                        <option value={10}>10 Failed Attempts (Relaxed)</option>
                      </select>
                      <p className="text-[11px] text-slate-400">
                        Enforces temporary 15-minute IP address authentication lockdown when consecutive invalid login attempts exceed this threshold.
                      </p>
                    </div>
                  </div>

                  {/* Master Financial PIN Security Information */}
                  <div className="rounded-xl border border-slate-200 p-4 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Key className="h-4 w-4 text-slate-800" />
                        <span className="font-bold text-slate-900">Master Orders & Payment PIN Security</span>
                      </div>
                      <span className="rounded-md bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 text-[10px] border border-emerald-200">
                        PIN ENFORCED
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px]">
                      Access to Orders & Payments tab requires secondary security verification via the master 4-digit PIN code. Both Super Admin and Admin accounts must enter the verified security PIN to unlock financial records.
                    </p>
                  </div>

                  {/* System Broadcast Alert Banner Manager */}
                  <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3 text-xs">
                    <div className="flex items-center gap-2">
                      <Megaphone className="h-4 w-4 text-amber-700" />
                      <span className="font-bold text-amber-950">System-Wide Operational Notice Broadcast</span>
                    </div>
                    <p className="text-[11px] text-amber-900/80">
                      Super Admin can publish a banner notification that instantly displays across the top of all active admin users' screens.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={crmBroadcastDraft}
                        onChange={(e) => setCrmBroadcastDraft(e.target.value)}
                        placeholder="e.g. Scheduled server maintenance tonight at 11:00 PM EST..."
                        className="flex-1 rounded-xl border border-amber-300 bg-white p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900"
                      />
                      <button
                        onClick={handlePublishBroadcastBanner}
                        className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-black transition-colors cursor-pointer shrink-0"
                      >
                        Publish Broadcast
                      </button>
                      {crmBroadcastBanner && (
                        <button
                          onClick={() => {
                            setCrmBroadcastDraft("");
                            setCrmBroadcastBanner("");
                            if (typeof window !== "undefined") {
                              localStorage.removeItem("crm_broadcast_banner");
                            }
                            showToast("Broadcast banner cleared");
                          }}
                          className="rounded-xl border border-red-300 bg-white px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                        >
                          Clear Banner
                        </button>
                      )}
                    </div>
                    {crmBroadcastBanner && (
                      <div className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1.5 pt-1">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Active Broadcast: &ldquo;{crmBroadcastBanner}&rdquo;</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ========================================================================= */}
      {/* MODAL 1: + ADD MANUAL LEAD */}
      {/* ========================================================================= */}
      {showAddLeadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? "border-slate-700 bg-[#151222] text-white" : "border-slate-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="h-5 w-5 text-blue-500" />
                <span>Add New Manual Lead</span>
              </h3>
              <button
                onClick={() => {
                  setShowAddLeadModal(false);
                  setPrefillLeadFromMeeting(null);
                }}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              key={prefillLeadFromMeeting ? `prefill-${prefillLeadFromMeeting.email || prefillLeadFromMeeting.name}` : "fresh"}
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const phone = formData.get("phone") as string;
                const email = formData.get("email") as string;
                const business = formData.get("business") as string;
                const location = formData.get("location") as string;
                const source = (formData.get("source") as string) || "Manual";
                const videoType = formData.get("videoType") as string;
                const videoQuantity = formData.get("videoQuantity") as string;
                const status = formData.get("status") as LeadStatus;
                const projectStatus = formData.get("projectStatus") as ProjectStatus;
                const deliveryDate = formData.get("deliveryDate") as string;
                const notes = formData.get("notes") as string;

                try {
                  const res = await addManualLeadServerFn({
                    data: {
                      source,
                      name,
                      phone,
                      email: email || undefined,
                      business,
                      location: location || undefined,
                      videoType,
                      videoQuantity: videoQuantity || 1,
                      status: status || "New",
                      projectStatus: projectStatus || "In Progress",
                      deliveryDate: deliveryDate || undefined,
                      notes: notes || undefined,
                      createdBy: session.name,
                      userRole: session.role,
                    },
                  });

                  if (res.success && res.lead) {
                    setLeads((prev) => [res.lead, ...prev]);
                    broadcastLeadEvent({ type: "NEW_LEAD", lead: res.lead });
                    showToast(`${source} lead added successfully`);
                    setShowAddLeadModal(false);
                    setPrefillLeadFromMeeting(null);
                    fetchLogsList();
                  }
                } catch (err) {
                  alert("Failed to create lead.");
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Lead Source *</label>
                  <select
                    name="source"
                    defaultValue={prefillLeadFromMeeting?.source || "Manual"}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <option value="USA Website">USA Website</option>
                    <option value="USA Website - Calendly">USA Website - Calendly</option>
                    <option value="Manual">Manual</option>
                    <option value="Meta Ads">Meta Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Client Full Name *</label>
                  <input
                    name="name"
                    required
                    defaultValue={prefillLeadFromMeeting?.name || ""}
                    placeholder="John Doe"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Company / Brand Name *</label>
                  <input
                    name="business"
                    required
                    defaultValue={prefillLeadFromMeeting?.business || ""}
                    placeholder="Acme Studio"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">WhatsApp / Phone *</label>
                  <input
                    name="phone"
                    required
                    defaultValue={prefillLeadFromMeeting?.phone || ""}
                    placeholder="+1 (555) 019-2834"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    defaultValue={prefillLeadFromMeeting?.email || ""}
                    placeholder="client@company.com"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Video Type *</label>
                  <select
                    name="videoType"
                    required
                    defaultValue={prefillLeadFromMeeting?.video_type || "AI UGC"}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {VIDEO_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Video Quantity</label>
                  <input
                    type="number"
                    name="videoQuantity"
                    defaultValue="1"
                    min="1"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Location / City</label>
                  <input
                    name="location"
                    defaultValue={prefillLeadFromMeeting?.location || "United States"}
                    placeholder="New York, USA"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Initial Lead Status</label>
                  <select
                    name="status"
                    defaultValue="New"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Project Status</label>
                  <select
                    name="projectStatus"
                    defaultValue="In Progress"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Hold">Hold</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Delivery Target Date</label>
                  <input
                    type="date"
                    name="deliveryDate"
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Internal Notes & Scope</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={prefillLeadFromMeeting?.notes || ""}
                  placeholder="Add specific requirements, deadlines, or client preferences..."
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddLeadModal(false)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: LEAD DETAILS FULL POPUP (SECTION 8: LEAD DETAILS PAGE) */}
      {/* ========================================================================= */}
      {viewLeadDetails && (() => {
        const leadMeeting = calendlyMeetings.find((m) =>
          (viewLeadDetails.email && m.email && m.email.toLowerCase() === viewLeadDetails.email.toLowerCase()) ||
          (viewLeadDetails.phone && m.phone && m.phone.replace(/\D/g, "").slice(-10) === viewLeadDetails.phone.replace(/\D/g, "").slice(-10)) ||
          (viewLeadDetails.name && m.client_name && viewLeadDetails.name.toLowerCase().trim() === m.client_name.toLowerCase().trim())
        );

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white text-slate-900 p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white font-extrabold text-base">
                    {viewLeadDetails.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-black">{viewLeadDetails.name}</h3>
                      <span className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${getLeadSourceBadgeClass(viewLeadDetails.source)}`}>
                        {getLeadSourceDisplay(viewLeadDetails.source)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{viewLeadDetails.business}</p>
                  </div>
                </div>

                <button
                  onClick={() => setViewLeadDetails(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* 2-Column Grid: Section 1 & Section 2 (Section 8) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {/* 1. Client Information */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5 border-b pb-2">
                    <User className="h-4 w-4 text-slate-800" />
                    <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">
                      Client Information
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Client Name:</span>
                      <span className="font-bold text-slate-900 text-right">{viewLeadDetails.name}</span>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Business Name:</span>
                      <span className="font-semibold text-slate-800 text-right">{viewLeadDetails.business}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Phone:</span>
                      <a
                        href={`tel:${viewLeadDetails.phone.replace(/[^0-9+]/g, "")}`}
                        className="font-mono font-bold text-slate-900 hover:underline flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3 text-slate-500" />
                        <span>{viewLeadDetails.phone}</span>
                      </a>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">WhatsApp:</span>
                      <button
                        type="button"
                        onClick={() => handleOpenWhatsApp(viewLeadDetails)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-800 hover:bg-slate-900 hover:text-white transition-colors cursor-pointer"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" />
                        <span>Chat on WhatsApp</span>
                      </button>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-mono text-slate-700 text-right">
                        {viewLeadDetails.email || "Not provided"}
                      </span>
                    </div>

                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Business Location:</span>
                      <span className="font-semibold text-slate-800 text-right">
                        {viewLeadDetails.location || "USA / Global"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Lead Information */}
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs">
                  <div className="flex items-center gap-1.5 border-b pb-2">
                    <ShieldCheck className="h-4 w-4 text-slate-800" />
                    <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">
                      Lead Information
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Lead Source:</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getLeadSourceBadgeClass(viewLeadDetails.source)}`}>
                        {getLeadSourceDisplay(viewLeadDetails.source)}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Lead Created Date/Time:</span>
                      <span className="font-mono text-slate-700 text-[11px]">
                        {new Date(viewLeadDetails.created_at).toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Lead Status:</span>
                      <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getLeadStatusBadge(viewLeadDetails.status)}`}>
                        {viewLeadDetails.status}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Lead Closed By:</span>
                      <span className="font-bold text-slate-800">
                        {viewLeadDetails.closed_by || (viewLeadDetails.status === "Closed" ? (viewLeadDetails.assigned_admin || "Admin") : "Not closed")}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Closed Date:</span>
                      <span className="font-mono text-[11px] text-slate-700">
                        {viewLeadDetails.closed_at ? new Date(viewLeadDetails.closed_at).toLocaleString() : "Not closed"}
                      </span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Admin/User Handled:</span>
                      <span className="font-bold text-slate-800">
                        {viewLeadDetails.assigned_admin || session?.name || "Admin"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Project Information */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <Video className="h-4 w-4 text-slate-800" />
                    <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">
                      Project Information
                    </span>
                  </div>
                  <span className={`rounded px-2 py-0.5 text-[10px] font-bold ${getProjectStatusBadge(viewLeadDetails.project_status)}`}>
                    {viewLeadDetails.project_status || "In Progress"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Video Type</span>
                    <p className="font-bold text-slate-900 mt-0.5">{viewLeadDetails.video_type}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Video Quantity</span>
                    <p className="font-bold text-slate-900 mt-0.5">x{viewLeadDetails.video_quantity || 1}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Project Status</span>
                    <p className="font-bold text-slate-900 mt-0.5">{viewLeadDetails.project_status || "In Progress"}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase text-slate-400 block">Delivery Date</span>
                    <p className="font-bold text-slate-900 mt-0.5">{viewLeadDetails.delivery_date || "Pending schedule"}</p>
                  </div>
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase text-slate-400 block mb-1">Project Notes</span>
                  <div className="text-slate-700 whitespace-pre-wrap leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
                    {viewLeadDetails.notes || viewLeadDetails.requirement || viewLeadDetails.additional || "No specific project notes recorded."}
                  </div>
                </div>
              </div>

              {/* 4. Meta Information (For Meta leads) */}
              {(viewLeadDetails.source?.toLowerCase().includes("meta") ||
                viewLeadDetails.campaign_name ||
                viewLeadDetails.meta_lead_id) && (
                <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs text-xs">
                  <div className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-1.5">
                      <Megaphone className="h-4 w-4 text-slate-800" />
                      <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">
                        Meta Information
                      </span>
                    </div>
                    {viewLeadDetails.is_duplicate && (
                      <span className="rounded-full bg-slate-100 border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                        Consolidated Duplicate
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Campaign Name</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {viewLeadDetails.campaign_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Ad Set Name</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {viewLeadDetails.adset_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Ad Name</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {viewLeadDetails.ad_name || "N/A"}
                      </p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Form Name</span>
                      <p className="font-semibold text-slate-900 mt-0.5">
                        {viewLeadDetails.form_name || "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Meta Lead ID</span>
                      <p className="font-mono text-[11px] text-slate-800 mt-0.5">
                        {viewLeadDetails.meta_lead_id || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 5. Meeting Information */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-3 shadow-xs text-xs">
                <div className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-800" />
                    <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">
                      Meeting Information
                    </span>
                  </div>
                  <span className="rounded-full bg-slate-100 border border-slate-300 px-2 py-0.5 text-[10px] font-bold text-slate-800">
                    {leadMeeting?.meeting_status || viewLeadDetails.meeting_status || "Not Scheduled"}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-slate-50 p-3 rounded-xl">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Meeting Date</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {leadMeeting?.meeting_date || viewLeadDetails.meeting_date || "Not scheduled"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Meeting Time</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {leadMeeting?.meeting_time || viewLeadDetails.meeting_time || "N/A"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Meeting Status</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {leadMeeting?.meeting_status || viewLeadDetails.meeting_status || "Pending"}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Meeting Type</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {leadMeeting?.meeting_type || viewLeadDetails.meeting_type || "Strategy Call"}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Assigned / Handling Admin</span>
                    <p className="font-semibold text-slate-900 mt-0.5">
                      {leadMeeting?.assigned_admin || viewLeadDetails.assigned_admin || session?.name || "Admin"}
                    </p>
                  </div>
                  {(leadMeeting?.meeting_link || viewLeadDetails.meeting_link) && (
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Meeting Link</span>
                      <a
                        href={leadMeeting?.meeting_link || viewLeadDetails.meeting_link}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-slate-900 hover:underline font-medium mt-0.5"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span className="truncate">{leadMeeting?.meeting_link || viewLeadDetails.meeting_link}</span>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* 6. Live Activity History & Audit Trail */}
              <div className="rounded-2xl border border-slate-200 bg-white p-4 space-y-2 shadow-xs text-xs">
                <div className="flex items-center gap-1.5 border-b pb-2">
                  <Clock className="h-4 w-4 text-slate-800" />
                  <span className="font-extrabold uppercase tracking-wider text-[11px] text-slate-800">
                    Lead Activity History & Audit Trail
                  </span>
                </div>

                <div className="space-y-2 pt-1 max-h-40 overflow-y-auto">
                  {activityLogs.filter((a) => a.lead_id === viewLeadDetails.id).length === 0 ? (
                    <div className="text-slate-400 text-xs italic py-2">
                      Initial lead submission recorded on {new Date(viewLeadDetails.created_at).toLocaleString()}.
                    </div>
                  ) : (
                    activityLogs
                      .filter((a) => a.lead_id === viewLeadDetails.id)
                      .map((log) => (
                        <div key={log.id} className="flex items-start justify-between gap-3 p-2 rounded-lg bg-slate-50 border border-slate-100">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-[11px]">{log.action}</span>
                              <span className="rounded bg-slate-200 text-slate-800 px-1 py-0.2 text-[9px] font-extrabold uppercase">
                                {log.performed_by}
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600">{log.details}</p>
                          </div>
                          <span className="font-mono text-[10px] text-slate-400 shrink-0">
                            {new Date(log.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))
                  )}
                </div>
              </div>

              {/* Quick Actions Footer (Section 09: Action Buttons) */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t">
                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${viewLeadDetails.phone.replace(/[^0-9+]/g, "")}`}
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5" />
                    <span>Call</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleOpenWhatsApp(viewLeadDetails)}
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <WhatsAppIcon className="h-3.5 w-3.5" />
                    <span>WhatsApp</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingLead(viewLeadDetails);
                      setViewLeadDetails(null);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Lead</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const idToDelete = viewLeadDetails.id;
                      setViewLeadDetails(null);
                      handleSoftDeleteLead(idToDelete);
                    }}
                    className="rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs font-bold text-slate-800 hover:bg-slate-900 hover:text-white hover:border-slate-900 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewLeadDetails(null)}
                    className="rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-200 cursor-pointer transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* ========================================================================= */}
      {/* MODAL 3: EDIT LEAD */}
      {/* ========================================================================= */}
      {editingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? "border-slate-700 bg-[#151222] text-white" : "border-slate-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Edit className="h-5 w-5 text-blue-500" />
                <span>Edit Lead Information</span>
              </h3>
              <button
                onClick={() => setEditingLead(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const updates: Partial<Lead> = {
                  name: formData.get("name") as string,
                  business: formData.get("business") as string,
                  phone: formData.get("phone") as string,
                  email: (formData.get("email") as string) || undefined,
                  location: (formData.get("location") as string) || undefined,
                  video_type: formData.get("videoType") as string,
                  video_quantity: formData.get("videoQuantity") as string,
                  delivery_date: (formData.get("deliveryDate") as string) || undefined,
                  notes: (formData.get("notes") as string) || undefined,
                };

                const updatedLeads = leads.map((l) => (l.id === editingLead.id ? { ...l, ...updates } : l));
                setLeads(updatedLeads);
                localStorage.setItem("ai_studio_local_leads", JSON.stringify(updatedLeads));
                broadcastLeadEvent({ type: "UPDATE_LEAD", id: editingLead.id });

                try {
                  await updateLeadDetailsServerFn({
                    data: {
                      id: editingLead.id,
                      updates,
                      updatedBy: session.name,
                      userRole: session.role,
                      changeSummary: `Lead ${editingLead.name} details updated by ${session.name}`,
                    },
                  });
                  showToast("Lead updated successfully");
                  setEditingLead(null);
                  fetchLogsList();
                } catch (err) {
                  alert("Failed to update lead.");
                }
              }}
              className="space-y-3.5 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Client Full Name *</label>
                  <input
                    name="name"
                    required
                    defaultValue={editingLead.name}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Company / Brand *</label>
                  <input
                    name="business"
                    required
                    defaultValue={editingLead.business}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Phone Number *</label>
                  <input
                    name="phone"
                    required
                    defaultValue={editingLead.phone}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Email Address</label>
                  <input
                    name="email"
                    defaultValue={editingLead.email || ""}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Video Type</label>
                  <select
                    name="videoType"
                    defaultValue={editingLead.video_type}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    {VIDEO_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Video Quantity</label>
                  <input
                    name="videoQuantity"
                    defaultValue={editingLead.video_quantity || "1"}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Location</label>
                  <input
                    name="location"
                    defaultValue={editingLead.location || ""}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Delivery Target Date</label>
                <input
                  type="date"
                  name="deliveryDate"
                  defaultValue={editingLead.delivery_date || ""}
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Internal Notes</label>
                <textarea
                  name="notes"
                  rows={3}
                  defaultValue={editingLead.notes || ""}
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingLead(null)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: CLOSE LEAD LOGIC (DOC REQUIREMENT 6.1) */}
      {/* ========================================================================= */}
      {closingLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
            isDark ? "border-slate-700 bg-[#151222] text-white" : "border-slate-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 className="h-5 w-5" />
                <span>Finalize & Close Lead</span>
              </h3>
              <button
                onClick={() => setClosingLead(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              Closing lead for <strong className="text-slate-900 dark:text-white">{closingLead.name}</strong> ({closingLead.business}).
              As per CRM policy, please specify the expected delivery date.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const deliveryDate = formData.get("deliveryDate") as string;
                if (!deliveryDate) return alert("Delivery Date is required to close a lead.");
                handleUpdateLeadStatus(closingLead, "Closed", { deliveryDate });
                setClosingLead(null);
              }}
              className="space-y-4 text-xs"
            >
              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-500">Lead Closed By:</span>
                  <span className="font-bold">{session?.name || "Admin"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Closed Timestamp:</span>
                  <span className="font-mono">{new Date().toLocaleDateString()}</span>
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Expected Delivery Date *</label>
                <input
                  type="date"
                  name="deliveryDate"
                  required
                  defaultValue={closingLead.delivery_date || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)}
                  className={`w-full rounded-xl border p-2.5 font-bold focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900 text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setClosingLead(null)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 px-4 py-2 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-emerald-600 px-5 py-2 font-bold text-white shadow-md hover:bg-emerald-700 cursor-pointer"
                >
                  Confirm Lead Closed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 5: DELIVER PROJECT LOGIC (DOC REQUIREMENT 7.1) */}
      {/* ========================================================================= */}
      {deliveringLead && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
            isDark ? "border-slate-700 bg-[#151222] text-white" : "border-slate-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-base font-bold flex items-center gap-2 text-slate-900">
                <Package className="h-5 w-5 text-slate-800" />
                <span>Mark Project Delivered</span>
              </h3>
              <button
                onClick={() => setDeliveringLead(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Confirm project delivery for <strong>{deliveringLead.name}</strong> ({deliveringLead.video_type}).
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const deliveryDate = formData.get("deliveryDate") as string;
                handleUpdateProjectStatus(deliveringLead, "Delivered", deliveryDate);
                setDeliveringLead(null);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-bold text-slate-800 mb-1">Actual Delivery Date *</label>
                <input
                  type="date"
                  name="deliveryDate"
                  required
                  defaultValue={new Date().toISOString().slice(0, 10)}
                  className="w-full rounded-xl border border-slate-300 bg-white p-2.5 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setDeliveringLead(null)}
                  className="rounded-xl border border-slate-300 bg-white px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-slate-900 px-5 py-2 font-bold text-white shadow-md hover:bg-black cursor-pointer transition-colors"
                >
                  Mark Delivered
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 6: CREATE ADMIN ACCOUNT (SUPER ADMIN ONLY) */}
      {/* ========================================================================= */}
      {showAddAdminModal && isSuperAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
            isDark ? "border-purple-900/50 bg-[#151026] text-white" : "border-purple-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-purple-600">
                <UserPlus className="h-5 w-5" />
                <span>Create New Admin Account</span>
              </h3>
              <button
                onClick={() => setShowAddAdminModal(false)}
                className="rounded-lg p-1 text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const name = formData.get("name") as string;
                const email = formData.get("email") as string;
                const password = formData.get("password") as string;
                const role = formData.get("role") as "super_admin" | "admin";

                try {
                  const res = await createAdminUserServerFn({
                    data: {
                      name,
                      email,
                      password,
                      role: role || "admin",
                      status: "active",
                      performedBy: session.name,
                    },
                  });

                  if (res.success && res.user) {
                    setAdminUsers((prev) => [res.user, ...prev]);
                    showToast(`Admin account for ${email} created successfully`);
                    setShowAddAdminModal(false);
                    fetchLogsList();
                  }
                } catch (err) {
                  alert("Failed to create admin user.");
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Admin Full Name *</label>
                <input
                  name="name"
                  required
                  placeholder="Sarah Johnson"
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Admin Email *</label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="sarah@aistudio.com"
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  required
                  placeholder="••••••••"
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Role Permission</label>
                <select
                  name="role"
                  defaultValue="admin"
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <option value="admin">Admin (Operational CRM Access)</option>
                  <option value="super_admin">Super Admin (Full System & User Control)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddAdminModal(false)}
                  className="rounded-xl border px-4 py-2 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-purple-600 px-5 py-2 font-bold text-white shadow-md hover:bg-purple-700 cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7.5: EDIT CALENDLY MEETING DETAILS */}
      {editingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
            isDark ? "border-slate-700 bg-[#151222] text-white" : "border-slate-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-blue-600">
                <Edit className="h-5 w-5" />
                <span>Edit Meeting Details</span>
              </h3>
              <button
                onClick={() => setEditingMeeting(null)}
                className="rounded-lg p-1 text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const client_name = formData.get("client_name") as string;
                const email = formData.get("email") as string;
                const phone = formData.get("phone") as string;
                const meeting_date = formData.get("meeting_date") as string;
                const meeting_time = formData.get("meeting_time") as string;
                const meeting_status = formData.get("meeting_status") as string;
                const meeting_link = formData.get("meeting_link") as string;
                const meeting_type = formData.get("meeting_type") as string;
                const assigned_admin = formData.get("assigned_admin") as string;
                const notes = formData.get("notes") as string;

                try {
                  const res = await updateCalendlyMeetingServerFn({
                    id: editingMeeting.id,
                    client_name,
                    email,
                    phone: phone || undefined,
                    meeting_date,
                    meeting_time,
                    meeting_status,
                    meeting_link,
                    meeting_type,
                    assigned_admin: assigned_admin || undefined,
                    notes: notes || undefined,
                    performedBy: session?.name || "Admin",
                  });

                  if (res.success) {
                    setMeetings((prev) =>
                      prev.map((m) =>
                        m.id === editingMeeting.id
                          ? {
                              ...m,
                              client_name,
                              email,
                              phone,
                              meeting_date,
                              meeting_time,
                              meeting_status,
                              meeting_link,
                              meeting_type,
                              assigned_admin,
                              notes,
                            }
                          : m
                      )
                    );
                    showToast("Meeting updated successfully");
                    setEditingMeeting(null);
                    await fetchNotificationsList();
                    await fetchLogsList();
                  }
                } catch (err) {
                  alert("Failed to update meeting.");
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Client Name *</label>
                <input
                  name="client_name"
                  required
                  defaultValue={editingMeeting.client_name}
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    defaultValue={editingMeeting.email}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Phone</label>
                  <input
                    name="phone"
                    defaultValue={editingMeeting.phone || ""}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Meeting Date *</label>
                  <input
                    type="text"
                    name="meeting_date"
                    required
                    defaultValue={editingMeeting.meeting_date}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Meeting Time *</label>
                  <input
                    type="text"
                    name="meeting_time"
                    required
                    defaultValue={editingMeeting.meeting_time}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Status</label>
                  {editingMeeting.meeting_status === "cancelled" ? (
                    <div>
                      <input type="hidden" name="meeting_status" value="cancelled" />
                      <div className="rounded-xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-950/40 p-2.5 text-red-600 dark:text-red-300 font-bold flex items-center gap-1.5 text-xs">
                        <Lock className="h-3.5 w-3.5" />
                        <span>Cancelled (Locked)</span>
                      </div>
                    </div>
                  ) : (
                    <select
                      name="meeting_status"
                      defaultValue={editingMeeting.meeting_status || "scheduled"}
                      className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                        isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                      }`}
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="upcoming">Upcoming</option>
                      <option value="completed">Completed</option>
                      <option value="rescheduled">Rescheduled</option>
                    </select>
                  )}
                </div>

                <div>
                  <label className="block font-semibold mb-1">Handling Admin</label>
                  <select
                    name="assigned_admin"
                    defaultValue={editingMeeting.assigned_admin || ""}
                    className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                      isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                    }`}
                  >
                    <option value="">Unassigned</option>
                    <option value="superadmin@aistudio.com">Super Admin</option>
                    <option value="admin@aistudio.com">Admin</option>
                    {adminUsers.map((u) => (
                      <option key={u.id} value={u.email}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Meeting Link</label>
                <input
                  name="meeting_link"
                  defaultValue={editingMeeting.meeting_link}
                  className={`w-full rounded-xl border p-2.5 font-mono focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Meeting Type</label>
                <input
                  name="meeting_type"
                  defaultValue={editingMeeting.meeting_type || "AI Video Strategy Call (30 min)"}
                  className={`w-full rounded-xl border p-2.5 focus:outline-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Notes</label>
                <textarea
                  name="notes"
                  rows={2}
                  defaultValue={editingMeeting.notes || ""}
                  className={`w-full rounded-xl border p-2.5 focus:outline-none resize-none ${
                    isDark ? "border-slate-700 bg-slate-900" : "border-slate-200 bg-slate-50"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditingMeeting(null)}
                  className="rounded-xl border px-4 py-2 font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-blue-600 px-5 py-2 font-bold text-white shadow-md hover:bg-blue-700 cursor-pointer"
                >
                  Update Meeting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 7.6: CANCEL CALENDLY MEETING POPUP MODAL (2-WAY SYNC) */}
      {cancellingMeeting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div
            className={`w-full max-w-md rounded-2xl border p-6 shadow-2xl space-y-4 ${
              isDark ? "border-slate-800 bg-[#12101e] text-white" : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2 text-red-600">
                <AlertTriangle className="h-5 w-5" />
                <h3 className="text-base font-bold">Cancel Calendly Meeting</h3>
              </div>
              <button
                onClick={() => {
                  setCancellingMeeting(null);
                  setCancellationReason("");
                }}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800">
                <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{cancellingMeeting.client_name}</div>
                <div className="text-slate-500 font-mono mt-0.5">{cancellingMeeting.email}</div>
                <div className="text-blue-600 dark:text-blue-400 font-semibold mt-1 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{cancellingMeeting.meeting_date} at {cancellingMeeting.meeting_time}</span>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/25 bg-amber-500/10 p-3 text-amber-700 dark:text-amber-300">
                <p className="font-bold flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5" />
                  <span>Important Notice</span>
                </p>
                <p className="mt-1 text-[11px] leading-relaxed">
                  Cancelling this meeting will notify Calendly to free up the scheduled slot, remove the meeting join link, and permanently mark the meeting as <strong>LOCKED & CANCELLED</strong> in the CRM. Once cancelled, this status cannot be changed back.
                </p>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  Cancellation Reason <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={cancellationReason}
                  onChange={(e) => setCancellationReason(e.target.value)}
                  placeholder="e.g., Client requested cancellation, Scope mismatch, Rescheduled directly..."
                  rows={3}
                  className={`w-full rounded-xl border p-3 text-xs outline-none focus:border-red-500 resize-none ${
                    isDark ? "border-slate-800 bg-[#171427] text-white" : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => {
                    setCancellingMeeting(null);
                    setCancellationReason("");
                  }}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-colors cursor-pointer ${
                    isDark ? "hover:bg-slate-800 text-slate-300" : "hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  Keep Meeting
                </button>
                <button
                  type="button"
                  disabled={!cancellationReason.trim() || isSubmittingCancel}
                  onClick={async () => {
                    if (!cancellationReason.trim()) {
                      showToast("Please provide a cancellation reason");
                      return;
                    }
                    setIsSubmittingCancel(true);
                    try {
                      const res = await cancelCalendlyMeetingServerFn({
                        id: cancellingMeeting.id,
                        email: cancellingMeeting.email,
                        reason: cancellationReason,
                        performedBy: session?.name || "Admin",
                      });
                      if (res.success) {
                        const cancelled_at = res.cancelled_at || new Date().toISOString();
                        setMeetings((prev) =>
                          prev.map((item) =>
                            item.id === cancellingMeeting.id
                              ? { ...item, meeting_status: "cancelled", cancelled_at, meeting_link: "" }
                              : item
                          )
                        );
                        showToast("Meeting cancelled & locked. Synced with Calendly.");
                        setCancellingMeeting(null);
                        setCancellationReason("");
                        await fetchMeetingsList();
                        await fetchNotificationsList();
                        await fetchLogsList();
                      } else {
                        showToast(`Cancellation error: ${res.error || "Failed"}`);
                      }
                    } catch (err: any) {
                      showToast(`Error: ${err.message || "Failed to cancel"}`);
                    } finally {
                      setIsSubmittingCancel(false);
                    }
                  }}
                  className="rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
                >
                  {isSubmittingCancel ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Cancelling...</span>
                    </>
                  ) : (
                    <span>Confirm & Cancel Meeting</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 8: ORDER DETAILS MODAL */}
      {/* ========================================================================= */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className={`w-full max-w-lg rounded-2xl border p-6 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto ${
            isDark ? "border-slate-700 bg-[#151222] text-white" : "border-slate-200 bg-white text-slate-900"
          }`}>
            <div className="flex items-center justify-between border-b pb-3 dark:border-slate-800">
              <h3 className="text-base font-bold flex items-center gap-2 text-purple-600">
                <Package className="h-5 w-5" />
                <span>PayPal Order Record</span>
              </h3>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="rounded-lg p-1 text-slate-400 cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Customer</span>
                <p className="font-bold text-sm">{selectedOrderDetails.customer_name}</p>
                <p className="font-mono text-slate-500">{selectedOrderDetails.customer_email}</p>
              </div>

              <div className="rounded-xl border p-3 bg-slate-50 dark:bg-slate-900/50 space-y-1">
                <span className="text-slate-400 font-bold uppercase text-[10px]">Payment</span>
                <p className="font-mono font-bold text-base text-emerald-600">
                  ${Number(selectedOrderDetails.amount).toFixed(2)} {selectedOrderDetails.currency}
                </p>
                <p className="font-bold text-purple-600">Status: {selectedOrderDetails.payment_status}</p>
              </div>
            </div>

            <div className="rounded-xl border p-3 space-y-1 text-xs font-mono dark:border-slate-800">
              <div className="flex justify-between">
                <span className="text-slate-400">Order ID:</span>
                <span className="font-bold select-all">{selectedOrderDetails.paypal_order_id}</span>
              </div>
              {selectedOrderDetails.paypal_capture_id && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Capture ID:</span>
                  <span className="font-bold text-emerald-600 select-all">{selectedOrderDetails.paypal_capture_id}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end pt-2">
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="rounded-xl bg-purple-600 px-5 py-2 text-xs font-bold text-white hover:bg-purple-700 cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Tab Security PIN Modal */}
      {showPaymentPinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl text-slate-800">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-600 shadow-xs">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Unlock Payments Tab</h3>
                  <p className="text-xs text-slate-500">Enter security PIN to view orders &amp; revenue</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowPaymentPinModal(false);
                  setPaymentPinInput("");
                  setPaymentPinError("");
                }}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Security PIN
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="security_pin_code"
                    id="security_pin_code"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    data-lpignore="true"
                    data-1p-ignore="true"
                    data-bwignore="true"
                    data-form-type="other"
                    autoFocus
                    placeholder="Enter PIN"
                    value={paymentPinInput}
                    style={
                      {
                        WebkitTextSecurity: showPaymentPin ? "none" : "disc",
                      } as React.CSSProperties
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleUnlockPaymentPin();
                      }
                    }}
                    onChange={(e) => {
                      setPaymentPinInput(e.target.value);
                      if (paymentPinError) setPaymentPinError("");
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-mono tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPaymentPin(!showPaymentPin)}
                    className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                    tabIndex={-1}
                    title={showPaymentPin ? "Hide PIN" : "Show PIN"}
                  >
                    {showPaymentPin ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                  </button>
                </div>

                {paymentPinError && (
                  <p className="mt-2 text-xs font-bold text-red-600 animate-in fade-in flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                    <span>{paymentPinError}</span>
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowPaymentPinModal(false);
                    setPaymentPinInput("");
                    setPaymentPinError("");
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-slate-100 py-2.5 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleUnlockPaymentPin()}
                  disabled={isVerifyingPin}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md hover:brightness-105 transition-all hover:scale-[1.02] active:scale-98 cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>{isVerifyingPin ? "Verifying..." : "Unlock"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-xl bg-slate-900 dark:bg-white px-4 py-3 text-xs font-bold text-white dark:text-slate-900 shadow-2xl animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
