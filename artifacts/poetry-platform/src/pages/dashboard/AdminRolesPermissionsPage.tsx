import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

type Role = { id: number; name: string; permissions: string[] };

const BRD_PERMISSIONS = [
  "create_request",
  "edit_request",
  "view_full_application",
  "view_poem_details",
  "view_poet_identity",
  "generate_jury_form",
  "assign_jury_members",
  "submit_jury_evaluation",
  "view_other_jury_decisions",
  "close_jury_stage",
  "prepare_final_form",
  "submit_final_decision",
  "send_notifications",
  "access_reports",
  "configure_system",
  "view_audit_logs",
];

const initialRoles: Role[] = [
  { id: 1, name: "Application Reviewer", permissions: ["view_full_application", "view_poet_identity", "generate_jury_form", "assign_jury_members", "prepare_final_form"] },
  { id: 2, name: "Jury Member", permissions: ["view_poem_details", "submit_jury_evaluation"] },
  { id: 3, name: "Dr. Sultan", permissions: ["view_full_application", "submit_final_decision"] },
  { id: 4, name: "System Administrator", permissions: [...BRD_PERMISSIONS] },
  { id: 5, name: "Audit User", permissions: ["view_full_application", "view_audit_logs"] },
];

export default function AdminRolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [newRoleName, setNewRoleName] = useState("");

  function addRole() {
    if (!newRoleName.trim()) return;
    setRoles((prev) => [...prev, { id: Date.now(), name: newRoleName.trim(), permissions: [] }]);
    setNewRoleName("");
  }

  function togglePermission(roleId: number, permission: string) {
    setRoles((prev) =>
      prev.map((role) =>
        role.id !== roleId
          ? role
          : {
              ...role,
              permissions: role.permissions.includes(permission)
                ? role.permissions.filter((p) => p !== permission)
                : [...role.permissions, permission],
            }
      )
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Roles & Permissions</h1>
        <p className="text-foreground/40 text-sm mt-0.5">
          Configure roles and permission toggles using the exact 16 permissions from the BRD matrix.
        </p>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4 mb-4">
        <h3 className="text-sm font-semibold mb-3">Create Role</h3>
        <div className="flex gap-3">
          <input
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Role name"
            className="flex-1 bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
          />
          <button onClick={addRole} className="px-4 py-2 rounded-lg gold-gradient text-navy text-sm font-semibold">
            + Create Role
          </button>
        </div>
      </motion.div>

      <div className="space-y-4">
        {roles.map((role) => (
          <motion.div key={role.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4">
            <h3 className="text-sm font-semibold mb-3">{role.name}</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {BRD_PERMISSIONS.map((permission) => {
                const enabled = role.permissions.includes(permission);
                return (
                  <label key={permission} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${enabled ? "border-gold/40 bg-gold/10 text-gold" : "border-border text-foreground/60"}`}>
                    <input
                      type="checkbox"
                      checked={enabled}
                      onChange={() => togglePermission(role.id, permission)}
                      className="accent-gold"
                    />
                    <span className="font-mono">{permission}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
