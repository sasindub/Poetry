import { type ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { useTheme } from "@/hooks/useTheme";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import { AccessibilityMenu } from "./AccessibilityMenu";
import { getAuthUser, clearAuth, roleLabel } from "@/lib/auth";
import { canAccessJuryPanel, canAccessUsers } from "@/lib/permissions";

interface NavItem {
  href: string;
  labelKey: string;
  icon: ReactNode;
}

const LayoutIcon = ({ path }: { path: string }) => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d={path} />
  </svg>
);

export function DashboardLayout({ children }: { children: ReactNode }) {
  const { t, isRtl } = useLanguage();
  const [location, navigate] = useLocation();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = getAuthUser();
  const isSystemAdmin =
    user?.role === "sysadmin" ||
    user?.role === "system_administrator" ||
    user?.role === "admin";

  const navItems: { href: string; label: string; icon: ReactNode; show: boolean }[] = [
    {
      href: "/dashboard",
      label: t("dashboard"),
      icon: <LayoutIcon path="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
      show: true,
    },
    {
      href: "/dashboard/submissions",
      label: t("submissions"),
      icon: <LayoutIcon path="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
      show: true,
    },
    {
      href: "/dashboard/users",
      label: isSystemAdmin ? "User Management" : t("users"),
      icon: <LayoutIcon path="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />,
      show: canAccessUsers(user?.role),
    },
    {
      href: "/dashboard/roles-permissions",
      label: "Roles & Permissions",
      icon: <LayoutIcon path="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422A12.083 12.083 0 0112 20.055a12.083 12.083 0 01-6.16-9.477L12 14z" />,
      show: isSystemAdmin,
    },
    {
      href: "/dashboard/workflow-config",
      label: "Workflow Config",
      icon: <LayoutIcon path="M4 6h16M4 12h10m-10 6h16M17 9l3 3-3 3" />,
      show: isSystemAdmin,
    },
    {
      href: "/dashboard/form-config",
      label: "Form Config",
      icon: <LayoutIcon path="M9 12h6m-6 4h6M7 3h8a2 2 0 012 2v14a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />,
      show: isSystemAdmin,
    },
    {
      href: "/dashboard/notification-templates",
      label: "Notification Templates",
      icon: <LayoutIcon path="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V4a2 2 0 10-4 0v1.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />,
      show: isSystemAdmin,
    },
    {
      href: "/dashboard/jury",
      label: isSystemAdmin ? "Jury Pool" : t("juryPanel"),
      icon: <LayoutIcon path="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />,
      show: canAccessJuryPanel(user?.role),
    },
    {
      href: "/dashboard/audit-log",
      label: "Audit Log",
      icon: <LayoutIcon path="M9 17v-2m3 2v-4m3 4V9M5 3h14a2 2 0 012 2v14l-4-2-4 2-4-2-4 2V5a2 2 0 012-2z" />,
      show:
        user?.role === "sysadmin" ||
        user?.role === "system_administrator" ||
        user?.role === "admin" ||
        user?.role === "audit" ||
        user?.role === "audit_user",
    },
    {
      href: "/dashboard/settings",
      label: t("settings"),
      icon: <LayoutIcon path="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z" />,
      show: !isSystemAdmin,
    },
  ];

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-gold/10 ${sidebarCollapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-4 h-4 text-navy" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        {!sidebarCollapsed && (
          <div>
            <div className="text-gold text-xs font-display tracking-wider">AHA</div>
            <div className="text-foreground/70 text-xs">Poetry Admin</div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {navItems.filter((item) => item.show).map((item) => {
          const isActive = location === item.href || (item.href !== "/dashboard" && location.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-gold/15 text-gold border border-gold/20"
                  : "text-foreground/60 hover:text-foreground hover:bg-white/5"
              } ${sidebarCollapsed ? "justify-center" : ""}`}
            >
              <span className={`flex-shrink-0 ${isActive ? "text-gold" : "text-foreground/40 group-hover:text-foreground/70"}`}>
                {item.icon}
              </span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-2 py-2 border-t border-gold/10" />
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden" dir={isRtl ? "rtl" : "ltr"}>
      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2 }}
        className="hidden md:flex flex-col flex-shrink-0 bg-sidebar border-r border-sidebar-border overflow-hidden"
      >
        <SidebarContent />
      </motion.aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />
            <motion.aside
              initial={{ x: isRtl ? "100%" : "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: isRtl ? "100%" : "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className={`fixed top-0 ${isRtl ? "right-0" : "left-0"} h-full w-64 bg-sidebar border-r border-sidebar-border z-50 md:hidden flex flex-col`}
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-visible">
        {/* Top bar */}
        <header className="h-14 flex items-center justify-between px-4 border-b border-border/50 bg-card/50 backdrop-blur flex-shrink-0 relative z-40 overflow-visible">
          <div className="flex items-center gap-3 relative z-50">
            <button
              onClick={() => { setSidebarCollapsed(!sidebarCollapsed); setMobileOpen(!mobileOpen); }}
              className="p-1.5 rounded-lg hover:bg-white/5 text-foreground/50 hover:text-foreground transition-all"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <Link href="/" className="text-xs text-foreground/30 hover:text-gold transition-colors">
              ← {t("home")}
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AccessibilityMenu />
            <LanguageToggle />
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-sm"
              >
                {user?.name?.charAt(0) || "U"}
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-2 w-56 rounded-xl glass-panel border border-gold/20 shadow-2xl shadow-black/30 z-[140] p-3"
                  >
                    <div className="pb-2 border-b border-border/50">
                      <p className="text-sm font-medium truncate">{user?.name ?? "User"}</p>
                      <p className="text-xs text-foreground/50">{user?.role ? roleLabel(user.role) : "Role"}</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="mt-2 w-full text-left px-2.5 py-2 text-xs text-foreground/60 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all flex items-center gap-2"
                    >
                      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.8}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t("logout")}
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
