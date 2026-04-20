import { motion } from "framer-motion";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useListUsers } from "@workspace/api-client-react";

const roleColors: Record<string, string> = {
  admin: "bg-gold/15 text-gold border border-gold/20",
  reviewer: "bg-teal-500/15 text-teal-400 border border-teal-500/20",
  jury: "bg-purple-500/15 text-purple-400 border border-purple-500/20",
  poet: "bg-blue-500/15 text-blue-400 border border-blue-500/20",
};

const fakeUsers = [
  { id: 1, name: "Dr. Sultan Al Mansoori", nameAr: "د. سلطان المنصوري", email: "admin@aha.ae", role: "admin", status: "active", nationality: "UAE", createdAt: "2025-01-01T00:00:00Z" },
  { id: 2, name: "Fatima Al Rashidi", nameAr: "فاطمة الراشدي", email: "reviewer@aha.ae", role: "reviewer", status: "active", nationality: "UAE", createdAt: "2025-01-15T00:00:00Z" },
  { id: 3, name: "Prof. Ahmad Al Mazrouei", nameAr: "أ.د. أحمد المزروعي", email: "jury@aha.ae", role: "jury", status: "active", nationality: "UAE", createdAt: "2025-02-01T00:00:00Z" },
  { id: 4, name: "Dr. Layla Al Suwaidi", nameAr: "د. ليلى السويدي", email: "jury2@aha.ae", role: "jury", status: "active", nationality: "UAE", createdAt: "2025-02-05T00:00:00Z" },
  { id: 5, name: "Dr. Hassan Al Khatib", nameAr: "د. حسن الخطيب", email: "jury3@aha.ae", role: "jury", status: "active", nationality: "Saudi Arabia", createdAt: "2025-03-01T00:00:00Z" },
  { id: 6, name: "Sara Al Hammadi", nameAr: "سارة الحمادي", email: "sara@aha.ae", role: "reviewer", status: "active", nationality: "UAE", createdAt: "2025-04-01T00:00:00Z" },
];

export default function UsersPage() {
  const { t, lang } = useLanguage();
  const { data } = useListUsers();
  const users = data?.users?.length ? data.users : fakeUsers;

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">{t("users")}</h1>
          <p className="text-foreground/40 text-sm mt-0.5">{users.length} users in the system</p>
        </div>
        <button className="px-4 py-2 rounded-lg gold-gradient text-navy text-sm font-semibold hover:opacity-90 transition-all">
          + {t("addUser")}
        </button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel rounded-xl border border-gold/10 overflow-hidden"
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/50">
              {[t("name"), t("email"), t("role"), "Nationality", t("status"), t("memberSince"), ""].map((h) => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-foreground/40 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {users.map((user: any, i: number) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.04 }}
                className="hover:bg-white/2 transition-colors group"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-navy font-bold text-xs flex-shrink-0">
                      {user.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{lang === "ar" && user.nameAr ? user.nameAr : user.name}</p>
                      {user.nameAr && lang !== "ar" && <p className="text-xs text-foreground/30" dir="rtl">{user.nameAr}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground/60">{user.email}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${roleColors[user.role] || ""}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-foreground/60">{user.nationality || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${user.status === "active" ? "bg-green-500/15 text-green-400" : "bg-gray-500/15 text-gray-400"}`}>
                    {user.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-foreground/40">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="text-xs text-gold hover:underline">{t("editUser")}</button>
                    <button className="text-xs text-red-400 hover:underline">{t("deleteUser")}</button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </motion.div>
    </DashboardLayout>
  );
}
