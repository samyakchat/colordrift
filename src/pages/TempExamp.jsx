import React, { useState } from "react";
import { useParams } from "react-router-dom";

// color palette for external use
let colorPalette = {
  primary: "#0F172A", // slate-900
  secondary: "#EC4899", // pink-500
  accent: "#10B981", // emerald-500
  surface: "#F8FAFC", // slate-50
  muted: "#64748B", // slate-500
};

export default function LandingPage() {
  const { paramId } = useParams();
  if (paramId) {
    if (localStorage.getItem(paramId)) {
      const arstring = localStorage.getItem(paramId);
      const arraytoref = arstring.split(",");
      
      colorPalette = {
        primary: arraytoref[1], // slate-900
        secondary: arraytoref[0], // pink-500
        accent: arraytoref[2], // emerald-500
        surface: arraytoref[3], // slate-50
        muted: arraytoref[4], // slate-500
      };
      
    }
  }

  const [activeFeature, setActiveFeature] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const features = [
    {
      title: "Lightning Fast",
      description: "Built for speed with optimized performance at every layer.",
      icon: "⚡",
    },
    {
      title: "Beautiful Design",
      description:
        "Modern aesthetics meet functional simplicity in perfect harmony.",
      icon: "✨",
    },
    {
      title: "Fully Responsive",
      description:
        "Seamlessly adapts to any screen size, from mobile to desktop.",
      icon: "📱",
    },
    {
      title: "Developer Friendly",
      description:
        "Intuitive APIs and comprehensive documentation for quick integration.",
      icon: "💻",
    },
    {
      title: "Scalable Architecture",
      description:
        "Grows with your needs without compromising performance or reliability.",
      icon: "📈",
    },
  ];

  return (
    <div
      className="min-h-screen transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: isDarkMode ? "#0a0a0a" : colorPalette.surface,
        color: isDarkMode ? "#e0e0e0" : colorPalette.primary,
      }}
    >
      {/* floating toggle */}
      <button
        onClick={() => setIsDarkMode(!isDarkMode)}
        className="fixed bottom-8 right-8 z-[1000] w-14 h-14 flex items-center justify-center text-2xl shadow-xl transition-all duration-300 border-none rounded-full cursor-pointer hover:scale-110 active:scale-95"
        style={{
          backgroundColor: isDarkMode ? "#ffffff" : colorPalette.primary,
          color: isDarkMode ? colorPalette.primary : "#ffffff",
        }}
      >
        {isDarkMode ? "☀️" : "🌙"}
      </button>

      {/* hero */}
      <section
        className="relative flex items-center justify-center min-h-screen p-8 overflow-hidden"
        style={{
          background: isDarkMode
            ? `linear-gradient(to bottom right, #1a1a1a, ${colorPalette.secondary}0D)`
            : `linear-gradient(to bottom right, ${colorPalette.surface}, ${colorPalette.secondary}1A)`,
        }}
      >
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-10 -top-[200px] -right-[100px] animate-[float_6s_ease-in-out_infinite]"
          style={{ backgroundColor: colorPalette.secondary }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10 -bottom-[100px] -left-[100px] animate-[float_8s_ease-in-out_infinite_reverse]"
          style={{ backgroundColor: colorPalette.accent }}
        />

        <div className="relative z-10 max-w-[800px] text-center">
          <h1 className="mb-6 text-6xl font-black leading-tight tracking-tight">
            Build Something <br />
            <span
              className="text-transparent bg-clip-text"
              style={{
                color: `${colorPalette.accent}`,
              }}
            >
              Extraordinary
            </span>
          </h1>
          <p
            className="text-md leading-relaxed"
            style={{ color: isDarkMode ? "#b0b0b0" : colorPalette.muted }}
          >
            A modern platform designed for creators and developers who demand
            excellence. Fast, beautiful, and scalable.
          </p>
          <div className="flex mt-7 flex-wrap justify-center gap-4">
            <button
              className="px-8 py-3 text-md font-semibold text-white transition-all duration-300 border-none rounded-lg cursor-pointer hover:brightness-85"
              style={{
                backgroundColor: colorPalette.accent,
              }}
            >
              Start Building →
            </button>
            <button
              className="px-10 py-3 text-md font-semibold transition-all duration-300 bg-transparent border-2 rounded-lg cursor-pointer"
              style={{
                color: isDarkMode ? "#e0e0e0" : colorPalette.primary,
                borderColor: isDarkMode ? "#e0e0e0" : colorPalette.primary,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = isDarkMode
                  ? "#e0e0e0"
                  : colorPalette.primary;
                e.target.style.color = isDarkMode ? "#0a0a0a" : "#ffffff";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "transparent";
                e.target.style.color = isDarkMode
                  ? "#e0e0e0"
                  : colorPalette.primary;
              }}
            >
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* features */}
      <section className="max-w-[1200px] mx-auto py-24 px-8">
        <h2 className="mb-4 text-5xl font-black text-center">
          Powerful Features
        </h2>
        <p
          className="max-w-[600px] mx-auto mb-16 text-lg text-center"
          style={{ color: isDarkMode ? "#b0b0b0" : colorPalette.muted }}
        >
          Everything you need to create, deploy, and scale your projects with
          confidence.
        </p>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              onMouseEnter={() => setActiveFeature(index)}
              className="p-8 border-2 border-transparent border-l-[6px] rounded-2xl cursor-pointer transition-all duration-300"
              style={{
                backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",
                boxShadow:
                  activeFeature === index
                    ? `0 16px 32px ${colorPalette.secondary}30`
                    : isDarkMode
                    ? "0 4px 12px rgba(0,0,0,0.5)"
                    : "0 4px 12px rgba(0,0,0,0.05)",
                transform:
                  activeFeature === index ? "translateY(-8px)" : "none",
                borderLeftColor:
                  index % 2 === 0
                    ? colorPalette.accent
                    : isDarkMode
                    ? colorPalette.muted
                    : colorPalette.primary,
                borderColor:
                  activeFeature === index
                    ? colorPalette.secondary
                    : "transparent",
              }}
            >
              <div className="mb-4 text-5xl">{feature.icon}</div>
              <h3
                className="mb-3 text-xl font-bold"
                style={{ color: isDarkMode ? "#f5f5f5" : colorPalette.primary }}
              >
                {feature.title}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: isDarkMode ? "#b0b0b0" : colorPalette.muted }}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* cta */}
      <section
        className="max-w-[1000px] p-16 mx-8 my-16 text-center text-white rounded-[1.5rem] md:mx-auto"
        style={{
          background: isDarkMode
            ? "linear-gradient(to bottom right, #1a1a1a, #2a2a2a)"
            : `linear-gradient(to bottom right, ${colorPalette.primary}, ${colorPalette.secondary}66)`,
        }}
      >
        <h2 className="mb-6 text-4xl font-black">Ready to Get Started?</h2>
        <p className="max-w-[600px] mx-auto mb-10 text-lg opacity-95">
          Join thousands of creators and developers who are already building
          amazing things.
        </p>
        <button
          className="px-10 py-4 text-lg font-bold text-white transition-transform duration-300 border-none rounded-lg cursor-pointer hover:scale-105"
          style={{ backgroundColor: colorPalette.accent }}
        >
          Start Your Free Trial
        </button>
      </section>

      {/* footer */}
      <footer
        className="py-12 px-8 text-white border-t"
        style={{
          backgroundColor: isDarkMode ? "#0a0a0a" : colorPalette.primary,
          borderTopColor: isDarkMode ? "#3333334D" : `${colorPalette.muted}4D`,
        }}
      >
        <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mb-8">
          <div>
            <div className="mb-4 text-xl font-bold">
              Design<span style={{ color: colorPalette.secondary }}>.</span>
            </div>
            <p className="leading-relaxed opacity-80">
              Building modern web experiences with cutting-edge technology.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-[0.95rem] font-bold">PRODUCT</h4>
            <ul className="flex flex-col gap-2 p-0 list-none text-white opacity-80">
              <li>Features</li>
              <li>Pricing</li>
              <li>Security</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-[0.95rem] font-bold">COMPANY</h4>
            <ul className="flex flex-col gap-2 p-0 list-none text-white opacity-80">
              <li>About</li>
              <li>Blog</li>
              <li>Contact</li>
            </ul>
          </div>
        </div>
        <div
          className="pt-8 text-sm text-center border-t opacity-60"
          style={{ borderTopColor: `${colorPalette.muted}4D` }}
        >
          © 2026 Design. All rights reserved.
        </div>
      </footer>

      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(30px); } }
      `}</style>
    </div>
  );
}
