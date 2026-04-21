import { motion } from "framer-motion";
import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";

type AdminUser = {
  id: number;
  name: string;
  email: string;
  role: "system_administrator" | "application_reviewer" | "jury_member" | "dr_sultan" | "audit_user";
  status: "active" | "inactive";
  createdAt: string;
};

const roleLabel: Record<AdminUser["role"], string> = {
  system_administrator: "System Administrator",
  application_reviewer: "Application Reviewer",
  jury_member: "Jury Member",
  dr_sultan: "Dr. Sultan",
  audit_user: "Audit User",
};

const roleColors: Record<AdminUser["role"], string> = {
  system_administrator: "bg-gold/15 text-gold border border-gold/20",
  application_reviewer: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  jury_member: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  dr_sultan: "bg-amber-500/15 text-amber-400 border border-amber-500/20",
  audit_user: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
};

const initialUsers: AdminUser[] = [
  { id: 1, name: "Abdullah Al Mansoori", email: "sysadmin@aha.ae", role: "system_administrator", status: "active", createdAt: "2026-01-01T00:00:00Z" },
  { id: 2, name: "Fatima Al Rashidi", email: "reviewer@aha.ae", role: "application_reviewer", status: "active", createdAt: "2026-01-05T00:00:00Z" },
  { id: 3, name: "Prof. Ahmad Al Mazrouei", email: "jury1@aha.ae", role: "jury_member", status: "active", createdAt: "2026-01-07T00:00:00Z" },
  { id: 4, name: "Dr. Sultan Al Mansoori", email: "sultan@aha.ae", role: "dr_sultan", status: "active", createdAt: "2026-01-10T00:00:00Z" },
  { id: 5, name: "Noor Al Ketbi", email: "audit@aha.ae", role: "audit_user", status: "active", createdAt: "2026-01-12T00:00:00Z" },
];

export default function UsersPage() {
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [form, setForm] = useState({ name: "", email: "", role: "application_reviewer" as AdminUser["role"] });

  function addUser() {
    if (!form.name.trim() || !form.email.trim()) return;
    setUsers((prev) => [
      {
        id: Date.now(),
        name: form.name.trim(),
        email: form.email.trim(),
        role: form.role,
        status: "active",
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setForm({ name: "", email: "", role: "application_reviewer" });
  }

  function toggleStatus(id: number) {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, status: u.status === "active" ? "inactive" : "active" } : u
      )
    );
  }

  function updateRole(id: number, role: AdminUser["role"]) {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">User Management</h1>
        <p className="text-foreground/40 text-sm mt-0.5">
          Create users, assign role, and activate/deactivate accounts. Password management is external.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Create New User</h3>
        <div className="grid md:grid-cols-4 gap-3">
          <input
            value={form.name}
            onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            placeholder="Full name"
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
          />
          <input
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="Email"
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
          />
          <select
            value={form.role}
            onChange={(e) => setForm((p) => ({ ...p, role: e.target.value as AdminUser["role"] }))}
            className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
          >
            {Object.entries(roleLabel).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button onClick={addUser} className="rounded-lg gold-gradient text-navy text-sm font-semibold px-4 py-2">
            + Create User
          </button>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {["Name", "Email", "Role", "Status", "Member Since", "Action"].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/2 transition-colors">
                <td className="px-4 py-3 font-medium">{user.name}</td>
                <td className="px-4 py-3 text-foreground/60">{user.email}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
                      {roleLabel[user.role]}
                    </span>
                    <select
                      value={user.role}
                      onChange={(e) => updateRole(user.id, e.target.value as AdminUser["role"])}
                      className="bg-background/50 border border-border rounded-md px-2 py-1 text-xs focus:outline-none focus:border-gold/50"
                    >
                      {Object.entries(roleLabel).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-foreground/40">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => toggleStatus(user.id)}
                    className="text-xs font-semibold text-gold border border-gold/30 hover:bg-gold/10 px-3 py-1.5 rounded-lg transition-all whitespace-nowrap"
                  >
                    {user.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  );
}
