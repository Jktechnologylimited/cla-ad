"use client";
import { useState, useEffect } from "react";
import { PageHeader, Card, Btn, Input, Textarea, Select } from "@/components/ui";
import { Save, CheckCircle } from "lucide-react";

const SECTIONS = [
  {
    group: "school_info", label: "School Information",
    fields: [
      { key: "school_name",        label: "School Name",          type: "text" },
      { key: "school_tagline",     label: "Tagline / Motto",      type: "text" },
      { key: "school_description", label: "School Description",   type: "textarea" },
      { key: "school_phone",       label: "Phone Number",         type: "text" },
      { key: "school_email",       label: "Email Address",        type: "text" },
      { key: "school_address",     label: "Full Address",         type: "textarea" },
      { key: "school_maps_url",    label: "Google Maps URL",      type: "text" },
    ],
  },
  {
    group: "home", label: "Homepage Content",
    fields: [
      { key: "home_about_title",   label: "About Section Title",  type: "text" },
      { key: "home_about_body",    label: "About Section Text (paragraph 1)", type: "textarea" },
      { key: "home_about_body2",   label: "About Section Text (paragraph 2)", type: "textarea" },
      { key: "home_cta_title",     label: "CTA Banner Title",     type: "text" },
      { key: "home_cta_subtitle",  label: "CTA Banner Subtitle",  type: "text" },
      { key: "home_stats_1_value", label: "Stat 1 Value (e.g. 18+)", type: "text" },
      { key: "home_stats_1_label", label: "Stat 1 Label",         type: "text" },
      { key: "home_stats_2_value", label: "Stat 2 Value",         type: "text" },
      { key: "home_stats_2_label", label: "Stat 2 Label",         type: "text" },
      { key: "home_stats_3_value", label: "Stat 3 Value",         type: "text" },
      { key: "home_stats_3_label", label: "Stat 3 Label",         type: "text" },
      { key: "home_stats_4_value", label: "Stat 4 Value",         type: "text" },
      { key: "home_stats_4_label", label: "Stat 4 Label",         type: "text" },
    ],
  },
  {
    group: "about", label: "About Page",
    fields: [
      { key: "about_mission",      label: "Mission Statement",    type: "textarea" },
      { key: "about_vision",       label: "Vision Statement",     type: "textarea" },
      { key: "about_values",       label: "Core Values (one per line)", type: "textarea" },
      { key: "about_story_p1",     label: "Our Story — Paragraph 1", type: "textarea" },
      { key: "about_story_p2",     label: "Our Story — Paragraph 2", type: "textarea" },
      { key: "about_story_p3",     label: "Our Story — Paragraph 3", type: "textarea" },
    ],
  },
  {
    group: "admissions", label: "Admissions Page",
    fields: [
      { key: "admissions_status",  label: "Admissions Status",   type: "select", options: ["Open", "Closed", "Limited Spaces Available"] },
      { key: "admissions_notice",  label: "Admissions Notice",   type: "textarea" },
      { key: "admissions_requirements", label: "Requirements (one per line)", type: "textarea" },
      { key: "admissions_fees_note",  label: "Fees Note",        type: "text" },
    ],
  },
  {
    group: "social", label: "Social Media & Links",
    fields: [
      { key: "social_facebook",    label: "Facebook URL",         type: "text" },
      { key: "social_instagram",   label: "Instagram URL",        type: "text" },
      { key: "social_twitter",     label: "Twitter/X URL",        type: "text" },
      { key: "social_whatsapp",    label: "WhatsApp Number",      type: "text" },
      { key: "social_youtube",     label: "YouTube URL",          type: "text" },
    ],
  },
  {
    group: "schools", label: "School Descriptions",
    fields: [
      { key: "school_creche_desc",    label: "Crèche Description",    type: "textarea" },
      { key: "school_nursery_desc",   label: "Nursery Description",   type: "textarea" },
      { key: "school_primary_desc",   label: "Primary Description",   type: "textarea" },
      { key: "school_secondary_desc", label: "Secondary Description", type: "textarea" },
    ],
  },
];

export default function SettingsPage() {
  const [data, setData] = useState<Record<string, string>>({});
  const [activeGroup, setActiveGroup] = useState("school_info");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/settings").then(r => r.json()).then(d => setData(d.settings || {}));
  }, []);

  const set = (key: string, value: string) => setData(p => ({ ...p, [key]: value }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentSection = SECTIONS.find(s => s.group === activeGroup);

  return (
    <div>
      <PageHeader title="Site Settings" subtitle="Edit all content displayed on the public website.">
        <Btn onClick={save} loading={saving} variant={saved ? "secondary" : "primary"}>
          {saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save All Changes</>}
        </Btn>
      </PageHeader>

      <div className="grid grid-cols-5 gap-6">
        {/* Sidebar tabs */}
        <div className="col-span-1">
          <Card>
            {SECTIONS.map(s => (
              <button key={s.group} onClick={() => setActiveGroup(s.group)}
                className={`w-full text-left px-4 py-3 text-sm border-b border-ivory-dark last:border-0 transition-colors ${
                  activeGroup === s.group ? "bg-crimson text-white font-semibold" : "text-slate hover:bg-ivory hover:text-navy"
                }`}>
                {s.label}
              </button>
            ))}
          </Card>
        </div>

        {/* Fields */}
        <div className="col-span-4">
          <Card className="p-8">
            <h2 className="font-display text-xl font-bold text-navy-dark mb-6 pb-4 border-b border-ivory-dark">
              {currentSection?.label}
            </h2>
            <div className="space-y-6">
              {currentSection?.fields.map(f => (
                <div key={f.key}>
                  <label className="block text-xs font-semibold text-slate uppercase tracking-wider mb-2">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={4} value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)}
                      className="w-full border border-silver/40 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-navy transition-colors resize-none" />
                  ) : f.type === "select" ? (
                    <select value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)}
                      className="w-full border border-silver/40 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-navy transition-colors">
                      <option value="">Select...</option>
                      {f.options?.map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type="text" value={data[f.key] || ""} onChange={e => set(f.key, e.target.value)}
                      className="w-full border border-silver/40 bg-white px-3 py-2.5 text-sm text-navy focus:outline-none focus:border-navy transition-colors" />
                  )}
                  <p className="text-[10px] text-silver mt-1 font-mono">key: {f.key}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-ivory-dark">
              <Btn onClick={save} loading={saving} size="lg">
                {saved ? <><CheckCircle size={15} /> All Changes Saved!</> : <><Save size={15} /> Save Changes</>}
              </Btn>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
