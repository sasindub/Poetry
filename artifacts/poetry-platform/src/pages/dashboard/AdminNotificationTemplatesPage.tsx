import { useState } from "react";
import { motion } from "framer-motion";
import { DashboardLayout } from "@/components/DashboardLayout";

type Trigger = {
  id: string;
  name: string;
  channels: { email: boolean; sms: boolean; whatsapp: boolean };
  bodyEn: string;
  bodyAr: string;
};

const initialTriggers: Trigger[] = [
  { id: "request_received", name: "Request Received", channels: { email: true, sms: false, whatsapp: false }, bodyEn: "Your request has been received.", bodyAr: "تم استلام طلبك." },
  { id: "jury_assigned", name: "Jury Assigned", channels: { email: true, sms: true, whatsapp: false }, bodyEn: "Your submission is assigned to jury.", bodyAr: "تم تعيين الطلب إلى لجنة التحكيم." },
  { id: "jury_deadline_reminder", name: "Jury Deadline Reminder", channels: { email: true, sms: true, whatsapp: true }, bodyEn: "Reminder: evaluation deadline is near.", bodyAr: "تذكير: موعد التقييم يقترب." },
  { id: "review_completed", name: "Reviewer Consolidation Completed", channels: { email: true, sms: false, whatsapp: false }, bodyEn: "Reviewer completed consolidation.", bodyAr: "أكمل المراجع التوحيد." },
  { id: "final_decision_approved", name: "Final Decision Approved", channels: { email: true, sms: true, whatsapp: true }, bodyEn: "Your submission was approved.", bodyAr: "تمت الموافقة على الطلب." },
  { id: "final_decision_rejected", name: "Final Decision Rejected", channels: { email: true, sms: true, whatsapp: false }, bodyEn: "Your submission was rejected.", bodyAr: "تم رفض الطلب." },
  { id: "returned_for_clarification", name: "Returned for Clarification", channels: { email: true, sms: false, whatsapp: true }, bodyEn: "Please provide clarification.", bodyAr: "يرجى تقديم الإيضاح." },
];

export default function AdminNotificationTemplatesPage() {
  const [templates, setTemplates] = useState<Trigger[]>(initialTriggers);

  function toggleChannel(triggerId: string, channel: "email" | "sms" | "whatsapp") {
    setTemplates((prev) =>
      prev.map((t) =>
        t.id === triggerId ? { ...t, channels: { ...t.channels, [channel]: !t.channels[channel] } } : t
      )
    );
  }

  function updateBody(triggerId: string, key: "bodyEn" | "bodyAr", value: string) {
    setTemplates((prev) => prev.map((t) => (t.id === triggerId ? { ...t, [key]: value } : t)));
  }

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-display font-bold">Notification Templates</h1>
        <p className="text-foreground/40 text-sm mt-0.5">
          Configure 7 BRD triggers, channels (Email/SMS/WhatsApp), and Arabic/English template body.
        </p>
      </div>

      <div className="space-y-4">
        {templates.map((trigger) => (
          <motion.div key={trigger.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass-panel rounded-xl border border-gold/10 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">{trigger.name}</h3>
              <span className="text-xs text-foreground/40 font-mono">{trigger.id}</span>
            </div>
            <div className="flex gap-4 mb-3 text-xs">
              {(["email", "sms", "whatsapp"] as const).map((channel) => (
                <label key={channel} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={trigger.channels[channel]}
                    onChange={() => toggleChannel(trigger.id, channel)}
                    className="accent-gold"
                  />
                  {channel.toUpperCase()}
                </label>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              <textarea
                rows={3}
                value={trigger.bodyEn}
                onChange={(e) => updateBody(trigger.id, "bodyEn", e.target.value)}
                className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                placeholder="English template"
              />
              <textarea
                rows={3}
                value={trigger.bodyAr}
                onChange={(e) => updateBody(trigger.id, "bodyAr", e.target.value)}
                className="bg-background/50 border border-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gold/50"
                placeholder="Arabic template"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </DashboardLayout>
  );
}
