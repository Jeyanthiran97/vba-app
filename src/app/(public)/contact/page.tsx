"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MapPin, Phone, Mail, Send, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("contact_submissions").insert([form]);
    if (err) { setError("Failed to send. Please try again."); }
    else { setSuccess(true); setForm({ name: "", email: "", subject: "", message: "" }); }
    setSubmitting(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="section-title">Contact Us</h1>
      <p className="section-subtitle">Get in touch with the Vavuniya Boxing Association</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Info */}
        <div>
          <h2 className="text-xl font-bold text-[#0B2545] mb-6">Association Details</h2>
          <div className="space-y-5">
            {[
              { Icon: MapPin, label: "Address", value: "Vavuniya District, Northern Province, Sri Lanka" },
              { Icon: Phone, label: "Phone", value: "+94 24 XXX XXXX" },
              { Icon: Mail, label: "Email", value: "info@vavuniyaboxing.lk" },
            ].map(({ Icon, label, value }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-navy-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-[#0B2545]" />
                </div>
                <div>
                  <div className="font-semibold text-gray-700 text-sm">{label}</div>
                  <div className="text-gray-600">{value}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8 p-5 bg-[#0B2545] rounded-xl text-white">
            <h3 className="font-bold mb-2">Affiliated With</h3>
            <ul className="space-y-1 text-sm text-gray-300">
              <li>• Boxing Association of Sri Lanka (BASL)</li>
              <li>• International Boxing Association (IBA)</li>
              <li>• Asian Boxing Confederation (ASBC)</li>
            </ul>
          </div>
        </div>

        {/* Form */}
        <div className="admin-card">
          {success ? (
            <div className="text-center py-10">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 mb-2">Message Sent!</h3>
              <p className="text-gray-500 mb-6">We will get back to you within 48 hours.</p>
              <button onClick={() => setSuccess(false)} className="btn-primary">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-xl font-bold text-[#0B2545] mb-6">Send a Message</h2>
              {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Your Name *</label>
                  <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input" placeholder="Full name" />
                </div>
                <div>
                  <label className="label">Email Address *</label>
                  <input required type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input" placeholder="your@email.com" />
                </div>
              </div>
              <div>
                <label className="label">Subject *</label>
                <input required value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="input" placeholder="How can we help?" />
              </div>
              <div>
                <label className="label">Message *</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} className="input resize-none" placeholder="Your message..." />
              </div>
              <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-60">
                {submitting ? "Sending..." : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
