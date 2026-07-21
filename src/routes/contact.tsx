import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { Phone, Mail, MapPin, Send, MessageSquare, User, Smartphone, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import logoImg from "@/assets/erha-logo.png";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us | ERHA Trade Link International" },
      {
        name: "description",
        content: "Get in touch with ERHA Trade Link International in Multan, Pakistan. Send us a message or call 0302-3333499.",
      },
    ],
  }),
  component: ContactComponent,
});

function ContactComponent() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !message.trim()) {
      toast.error("Please fill in your Name, Phone Number, and Message.");
      return;
    }

    const subject = `New Inquiry from ${name.trim()} (${phone.trim()})`;
    const body =
      `Customer Name: ${name.trim()}\n` +
      `Phone Number: ${phone.trim()}\n` +
      `Email Address: ${email.trim() || "N/A"}\n\n` +
      `Message:\n${message.trim()}`;

    // Target Gmail address: erhatechnologies@gmail.com
    const mailtoUrl = `mailto:erhatechnologies@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    toast.success("Opening your email client to send your message...");

    window.location.href = mailtoUrl;
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] flex flex-col">
      <Header />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 py-10 sm:px-6 lg:px-8">
        {/* Contact Page Hero Header */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-900 px-6 py-12 sm:px-12 sm:py-14 text-center mb-10 border border-slate-800 shadow-glow">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(6,182,212,0.2),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(99,102,241,0.15),transparent_60%)]" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 px-3.5 py-1 text-xs font-bold text-cyan-400">
              <Mail className="size-3.5" /> Direct Email & Support
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-lg mx-auto">
              Have questions about our power banks, audio gear, or accessories? Fill out the form below to email us directly!
            </p>
          </div>
        </div>

        {/* Main Grid: Form + Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form (Logo Color Theme) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-[0_10px_40px_rgba(6,182,212,0.08)] relative overflow-hidden">
            {/* Ambient theme accent background */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-400/10 to-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
              <img src={logoImg} alt="ERHA Trade Link" className="h-10 w-auto object-contain" />
              <div>
                <h2 className="text-lg font-extrabold text-slate-900 leading-tight">Send Us a Message</h2>
                <p className="text-xs text-slate-500">Directly emails erhatechnologies@gmail.com</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
                  />
                </div>
              </div>

              {/* Phone & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Phone */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Phone Number <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Message / Inquiry <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3.5 top-3.5 size-4 text-slate-400" />
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell us what product or assistance you need..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-3 text-sm outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-2 focus:ring-cyan-500/20 text-slate-900 resize-none"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 py-3.5 px-6 text-sm font-extrabold text-white shadow-md hover:opacity-95 active:scale-[0.99] transition duration-200 cursor-pointer"
              >
                <Send className="size-4" />
                Submit Message
              </button>
            </form>
          </div>

          {/* Right Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Direct Phone & WhatsApp Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Phone className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Direct Hotline / WhatsApp</h3>
                <a
                  href="https://wa.me/923023333499"
                  target="_blank"
                  rel="noreferrer"
                  className="text-lg font-black text-cyan-600 hover:underline block"
                >
                  0302-3333499
                </a>
                <p className="text-xs text-slate-500">Available on WhatsApp &amp; Phone call</p>
              </div>
            </div>

            {/* Email Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center shrink-0">
                <Mail className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Official Email</h3>
                <a
                  href="mailto:erhatechnologies@gmail.com"
                  className="text-base font-bold text-indigo-600 hover:underline block"
                >
                  erhatechnologies@gmail.com
                </a>
                <p className="text-xs text-slate-500">Send us your queries anytime</p>
              </div>
            </div>

            {/* Address Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-sm flex items-start gap-4">
              <div className="size-12 rounded-2xl bg-indigo-500/10 text-indigo-600 flex items-center justify-center shrink-0">
                <MapPin className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Store Location</h3>
                <p className="text-sm font-bold text-slate-800">
                  ERHA Trade Link International
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pace N Pace Mall, Chungi #6, Bosan Road, Multan, Pakistan
                </p>
              </div>
            </div>

            {/* Quick Action Banner */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-6 text-white border border-slate-700 space-y-3">
              <h3 className="text-base font-extrabold flex items-center gap-2">
                <MessageCircle className="size-5 text-cyan-400" /> Need Instant Help?
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Click below to open a direct WhatsApp chat with our sales team for fast ordering and stock inquiry.
              </p>
              <a
                href="https://wa.me/923023333499?text=Hello%20ERHA%20Trade%20Link,%20I%20have%20an%20inquiry."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 text-xs font-bold transition shadow-sm"
              >
                <MessageCircle className="size-4" /> Open WhatsApp Chat Now
              </a>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
