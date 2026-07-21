import { Smartphone, Zap, BatteryCharging, Radio, Laptop, Sun } from "lucide-react";
import { Link } from "@tanstack/react-router";

const categories = [
  { name: "Ultra Compact", icon: Smartphone, bg: "from-blue-500/8 to-indigo-500/8", border: "border-blue-500/20 text-blue-700", route: "/shop?category=Ultra%20Compact" },
  { name: "High Capacity", icon: BatteryCharging, bg: "from-purple-500/8 to-pink-500/8", border: "border-purple-500/20 text-purple-700", route: "/shop?category=High%20Capacity" },
  { name: "MagSafe & Wireless", icon: Radio, bg: "from-rose-500/8 to-pink-500/8", border: "border-rose-500/20 text-rose-700", route: "/shop?category=MagSafe%20%26%20Wireless" },
  { name: "Laptop Power Banks", icon: Laptop, bg: "from-amber-500/8 to-orange-500/8", border: "border-amber-500/20 text-amber-700", route: "/shop?category=Laptop%20Power%20Banks" },
  { name: "Rugged & Solar", icon: Sun, bg: "from-emerald-500/8 to-teal-500/8", border: "border-emerald-500/20 text-emerald-700", route: "/shop?category=Rugged%20%26%20Solar" },
];

export function CategoryMarquee() {
  // Triple the list to guarantee seamless looping across wide displays
  const marqueeItems = [...categories, ...categories, ...categories];

  return (
    <section className="relative w-full bg-background/50 border-y border-slate-100 py-6 overflow-hidden select-none">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marqueeScroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-33.333%, 0, 0); }
        }
        .marquee-track {
          display: flex;
          width: max-content;
          animation: marqueeScroll 25s linear infinite;
        }
        .marquee-track:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Left and Right Edge Gradient Masks for Premium Depth */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

      {/* Scrolling Track Container */}
      <div className="flex w-full overflow-hidden">
        <div className="marquee-track flex gap-4 sm:gap-6 px-4">
          {marqueeItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={`${item.name}-${index}`}
                to={item.route}
                className={`flex items-center gap-3 px-5 py-3 rounded-full border ${item.border} bg-gradient-to-r ${item.bg} hover:shadow-md hover:scale-[1.03] active:scale-95 transition-all duration-300 cursor-pointer backdrop-blur-sm`}
              >
                <div className="flex items-center justify-center shrink-0">
                  <Icon className="size-4 sm:size-5" />
                </div>
                <span className="text-sm sm:text-base font-semibold tracking-wide whitespace-nowrap">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
