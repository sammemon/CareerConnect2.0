import React, { useState } from "react";
import api from "../api/axios";

const teamMembers = [
  {
    name: "Sohail Ahmed",
    role: "Owner / CEO",
    roll: "23CS066",
    description: "Student of Computer System Engineering, Mehran University",
    extra: "Web Developer",
  },
  {
    name: "Muhammad Faiz",
    role: "Founder",
    roll: "23CS020",
    description: "Student of Computer System Engineering, Mehran University",
    extra: "",
  },
  {
    name: "Muhammad Omar",
    role: "Member",
    roll: "23CS026",
    description: "Student of Computer System Engineering, Mehran University",
    extra: "",
  },
];

export default function ContactUs() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState({ type: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus({ type: "", message: "" });
    try {
      const res = await api.post('/contact', form);
      const data = res.data;
      let msg = data.message || "Your inquiry has been saved. We'll get back to you soon!";
      if (data.previewUrl) {
        msg += ` (Preview: ${data.previewUrl})`;
      } else if (data.emailSent) {
        msg += ' An email notification has also been sent.';
      }
      setStatus({ type: "success", message: msg });
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.message || "Failed to send message. Please try again." });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 py-10 transition-colors">
      <div className="container mx-auto px-4 max-w-5xl">
  <h1 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-white text-center">Contact Us</h1>

        {/* Team Avatars Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {teamMembers.map((member, idx) => (
            <div key={idx} className="card flex flex-col items-center text-center">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-primary-200 to-primary-400 dark:from-primary-900 dark:to-primary-700 flex items-center justify-center text-white text-xl font-bold shadow-md">
                {member.name.split(' ').map(n=>n[0]).slice(0,2).join('')}
              </div>
              <h2 className="mt-4 text-lg font-semibold text-neutral-900 dark:text-white">{member.name}</h2>
              <p className="text-sm text-neutral-600 dark:text-neutral-300">Roll No: {member.roll}</p>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="card bg-white/80 dark:bg-neutral-800/80 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Send us a message</h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-medium mb-1">Name</label>
              <input name="name" value={form.name} onChange={handleChange} className="input-field" placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="input-field" placeholder="you@example.com" required />
            </div>
            <div className="md:col-span-2">
              <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-medium mb-1">Subject</label>
              <input name="subject" value={form.subject} onChange={handleChange} className="input-field" placeholder="Subject (optional)" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-neutral-700 dark:text-neutral-300 text-sm font-medium mb-1">Message</label>
              <textarea name="message" value={form.message} onChange={handleChange} className="input-field" rows="5" placeholder="Write your message..." required />
            </div>
            <div className="md:col-span-2 flex items-center justify-between">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">We'll send your message to our team.</p>
              <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? 'Sending...' : 'Submit'}</button>
            </div>
          </form>
          {status.message && (
            <div className={`mt-4 rounded-md p-3 ${status.type === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
              {status.message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
