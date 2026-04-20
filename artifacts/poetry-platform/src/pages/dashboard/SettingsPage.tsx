import { motion } from "framer-motion";
import { useState } from "react";
import { useLanguage } from "@/hooks/useLanguage";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getAuthUser } from "@/lib/auth";

export default function SettingsPage() {
  const { t, lang, setLang } = useLanguage();
  const user = getAuthUser();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">{t("settings")}</h1>
        <p className="text-foreground/40 text-sm mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="max-w-2xl space-y-4">
        {/* Profile */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel rounded-xl p-6 border border-gold/10"
        >
          <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-5">Profile</h3>
          <div className="flex items-center gap-4 mb-5">
            <div className="w-16 h-16 rounded-full gold-gradient flex items-center justify-center text-navy text-2xl font-bold font-display">
              {user?.name?.charAt(0)}
            </div>
            <div>
              <p className="font-display font-semibold text-lg">{user?.name}</p>
              <p className="text-sm text-foreground/50">{user?.email}</p>
              <span className="inline-block px-2.5 py-0.5 text-xs rounded-full bg-gold/15 text-gold border border-gold/20 mt-1 capitalize">
                {user?.role}
              </span>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-foreground/40 mb-1.5">Full Name</label>
              <input defaultValue={user?.name} className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all" />
            </div>
            <div>
              <label className="block text-xs text-foreground/40 mb-1.5">Email</label>
              <input defaultValue={user?.email} type="email" className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all" />
            </div>
          </div>
        </motion.div>

        {/* Language */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-panel rounded-xl p-6 border border-gold/10"
        >
          <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-5">Language & Region</h3>
          <div className="flex gap-3">
            {[
              { code: "en", label: "English", sub: "Default language" },
              { code: "ar", label: "العربية", sub: "Arabic (RTL)" },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setLang(l.code as "en" | "ar")}
                className={`flex-1 p-4 rounded-xl border transition-all text-left ${
                  lang === l.code
                    ? "border-gold/40 bg-gold/10"
                    : "border-border hover:border-gold/20"
                }`}
              >
                <p className="font-medium text-sm">{l.label}</p>
                <p className="text-xs text-foreground/40 mt-0.5">{l.sub}</p>
                {lang === l.code && (
                  <div className="w-1.5 h-1.5 rounded-full bg-gold mt-2" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Security */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-panel rounded-xl p-6 border border-gold/10"
        >
          <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-5">Security</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs text-foreground/40 mb-1.5">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all" />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-foreground/40 mb-1.5">New Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all" />
              </div>
              <div>
                <label className="block text-xs text-foreground/40 mb-1.5">Confirm Password</label>
                <input type="password" placeholder="••••••••" className="w-full bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50 transition-all" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Platform Info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-panel rounded-xl p-6 border border-gold/10"
        >
          <h3 className="text-sm font-semibold text-foreground/60 uppercase tracking-wider mb-4">Platform Information</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Platform", value: "National Poets Evaluation Service" },
              { label: "Authority", value: "Abu Dhabi Heritage Authority" },
              { label: "Version", value: "2026.1.0" },
              { label: "Environment", value: "Production" },
            ].map((item) => (
              <div key={item.label} className="bg-background/40 rounded-lg p-3">
                <p className="text-xs text-foreground/30 mb-1">{item.label}</p>
                <p className="text-sm font-medium text-foreground/70">{item.value}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Save button */}
        <motion.button
          onClick={handleSave}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="w-full py-3 rounded-xl gold-gradient text-navy font-bold transition-all shadow-lg shadow-gold/20"
        >
          {saved ? "Saved!" : "Save Changes"}
        </motion.button>
      </div>
    </DashboardLayout>
  );
}
