import { Facebook, Instagram, Twitter, Youtube, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import logoImg from "@/assets/erha-logo.png";
import { Link } from "@tanstack/react-router";

const quickLinks: Record<string, { to: string; search?: any }> = {
  Home: { to: "/" },
  Shop: { to: "/shop" },
  Deals: { to: "/shop", search: { category: "Ultra Compact" } },
  "About Us": { to: "/#whychoose" },
  Contact: { to: "/#footer" },
};

const categoryLinks = [
  "Ultra Compact",
  "High Capacity",
  "MagSafe & Wireless",
  "Laptop Power Banks",
  "Rugged & Solar"
];

const policyLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Return Policy",
  "Shipping Info",
  "Warranty",
  "FAQs"
];

export function Footer() {
  return (
    <footer id="footer" className="bg-secondary text-white/70">
      {/* Main footer grid */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="inline-flex items-center rounded-xl bg-white p-2">
              <img src={logoImg} alt="ERHA Trade Link" className="h-9 w-auto sm:h-10" />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              ERHA Trade Link International — Pakistan's trusted destination for premium power banks, from ultra-compact everyday chargers to heavy-duty solar power stations.
            </p>
            {/* Contact Info */}
            <div className="mt-5 space-y-2.5 text-sm">
              <a
                href="https://maps.google.com/?q=Pace+N+Pace+Mall+Chungi+6+Multan"
                target="_blank"
                rel="noreferrer"
                className="flex items-start gap-2 hover:text-white transition-colors group"
              >
                <MapPin className="size-4 text-cyan shrink-0 mt-0.5" />
                <span>Pace N Pace Mall Near Chaseup, Chungi #6, Multan, Pakistan</span>
              </a>
              <a href="tel:03023333499" className="flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="size-4 text-cyan shrink-0" />
                <span>0302-3333499</span>
              </a>
              <a href="mailto:erhatradelinkinternational@gmail.com" className="flex items-center gap-2 hover:text-white transition-colors break-all sm:break-normal">
                <Mail className="size-4 text-cyan shrink-0" />
                <span className="text-xs sm:text-sm">erhatradelinkinternational@gmail.com</span>
              </a>
            </div>
            {/* WhatsApp + Social */}
            <div className="mt-5 flex flex-wrap gap-3">
              <a
                href="https://wa.me/923023333499"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#1ebe57]"
              >
                <MessageCircle className="size-4" /> WhatsApp
              </a>
              {[Facebook, Instagram, Twitter, Youtube].map((I, k) => (
                <a key={k} href="#" className="grid size-9 place-items-center rounded-full border border-white/15 transition hover:bg-cyan hover:text-secondary">
                  <I className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Quick Links</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {Object.entries(quickLinks).map(([name, link]) => (
                <li key={name}>
                  <Link to={link.to} search={link.search} className="transition hover:text-cyan cursor-pointer">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Categories</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {categoryLinks.map((name) => (
                <li key={name}>
                  <Link to="/shop" search={{ category: name }} className="transition hover:text-cyan cursor-pointer">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Column */}
          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white">Policies</h4>
            <ul className="mt-4 space-y-2.5 text-sm">
              {policyLinks.map((name) => (
                <li key={name}>
                  <Link to="/" className="transition hover:text-cyan cursor-pointer">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-5 text-xs sm:px-6">
          <div>© {new Date().getFullYear()} ERHA Trade Link International. All rights reserved.</div>
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Visa */}
            <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm">
              <svg className="h-4 w-auto" viewBox="0 0 24 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.155 14.155L11.895 3.39H14.655L12.915 14.155H10.155ZM18.795 3.615C18.27 3.39 17.37 3.165 16.29 3.165C13.62 3.165 11.73 4.59 11.715 6.63C11.7 8.13 13.05 8.97 14.07 9.465C15.12 9.975 15.48 10.305 15.48 10.77C15.465 11.475 14.625 11.79 13.845 11.79C12.795 11.79 12.195 11.49 11.715 11.265L11.19 13.725C11.865 14.04 13.02 14.31 14.22 14.31C17.025 14.31 18.84 12.93 18.885 10.785C18.915 9.06 17.88 7.785 15.54 6.66C14.16 6.015 13.8 5.715 13.8 5.25C13.8 4.725 14.4 4.17 15.615 4.17C16.635 4.155 17.415 4.41 17.91 4.635L18.795 3.615ZM23.415 3.39H20.76C19.95 3.39 19.29 3.855 18.96 4.635L14.73 14.155H17.61L18.18 12.57H21.72L22.05 14.155H24.6L23.415 3.39ZM18.99 10.32L20.505 6.165L21.36 10.32H18.99ZM5.64 3.39L2.895 12.15L2.595 10.665C2.085 8.94 0.96 6.78 0 6.315L2.55 14.14H5.43L9.72 3.39H5.64Z" fill="#FFFFFF"/>
                <path d="M4.095 3.39H0.06L0 3.69C3.12 4.485 5.22 6.63 6.075 8.94L5.13 4.425C4.98 3.735 4.575 3.42 4.095 3.39Z" fill="#F7B600"/>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="flex items-center justify-center px-3 py-1.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm">
              <svg className="h-5 w-auto" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="10" fill="#EB001B"/>
                <circle cx="20" cy="10" r="10" fill="#F79E1B" fillOpacity="0.85"/>
              </svg>
            </div>
            {/* JazzCash */}
            <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm">
              <svg className="h-6 w-auto rounded" viewBox="0 0 65 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="65" height="20" rx="3" fill="#000000"/>
                <path d="M0 0H20L12 20H0V0Z" fill="#E51A24"/>
                <path d="M20 0H23L15 20H12L20 0Z" fill="#FFC700"/>
                <text x="25" y="13.5" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.2">Jazz</text>
                <text x="44" y="13.5" fill="#FFC700" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.2">Cash</text>
              </svg>
            </div>
            {/* EasyPaisa */}
            <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm">
              <svg className="h-6 w-auto rounded" viewBox="0 0 65 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="65" height="20" rx="3" fill="#FFFFFF"/>
                <path d="M0 0H18L10 20H0V0Z" fill="#00A859"/>
                <circle cx="9" cy="10" r="5" fill="#8DC63F"/>
                <text x="21" y="13.5" fill="#00A859" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.1">easy</text>
                <text x="41" y="13.5" fill="#4B4B4B" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.1">paisa</text>
              </svg>
            </div>
            {/* COD */}
            <div className="flex items-center justify-center px-2 py-1 rounded-lg bg-white/10 backdrop-blur-sm border border-white/15 shadow-sm">
              <svg className="h-6 w-auto rounded" viewBox="0 0 52 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="52" height="20" rx="3" fill="#1E293B"/>
                <path d="M4 6H10V11H4V6ZM10 8H13L15 11H10V8Z" fill="#38BDF8"/>
                <circle cx="6.5" cy="13" r="1.5" fill="#FFFFFF"/>
                <circle cx="12.5" cy="13" r="1.5" fill="#FFFFFF"/>
                <text x="20" y="13" fill="#FFFFFF" fontFamily="Arial, sans-serif" fontSize="8" fontWeight="900" letterSpacing="0.5">COD</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}