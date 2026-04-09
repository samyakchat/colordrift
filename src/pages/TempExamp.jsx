import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { IoChevronDown } from "react-icons/io5";

let colorPalette = {
  primary: "#0F172A",
  secondary: "#EC4899",
  accent: "#10B981",
  surface: "#F8FAFC",
  muted: "#64748B",
};

const savePalette = () => {
  if (!localStorage.getItem("index")) {
    localStorage.setItem("index", 1);
  } else {
    let currentnum = parseInt(localStorage.getItem("index"));
    localStorage.setItem("index", currentnum + 1);
  }

  let currentnum = parseInt(localStorage.getItem("index"));
  localStorage.setItem(currentnum.toString(), localStorage.getItem("temporary"));

};

//array for global variables jsut setting up
let arraytoref = ["2", "3", "4", "5", "6"];

const Dropdown = ({ label, colorKey, refreshUI }) => {
  const [isOpen, setIsOpen] = useState(false);
  const options = [
    arraytoref[0],
    arraytoref[1],
    arraytoref[2],
    arraytoref[3],
    arraytoref[4],
  ];

  const handleSelect = (option) => {
    colorPalette[colorKey] = option;
    refreshUI((prev) => prev + 1);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-center w-44 ">
      <span className="block text-sm text-center  text-gray-400 mb-1">
        {label}
      </span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none"
      >
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm border"
            style={{ backgroundColor: colorPalette[colorKey] }}
          ></div>
          <span>{colorPalette[colorKey]}</span>
        </div>
        <IoChevronDown
          className={`w-3 h-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute left-0 z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={`${colorKey}-${option}`}
                  onClick={() => handleSelect(option)}
                  className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left hover:bg-gray-100"
                >
                  <div
                    className="w-3 h-3 rounded-full border"
                    style={{ backgroundColor: option }}
                  ></div>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default function LandingPage() {
  const [tick, setTick] = useState(0);
  const { paramId } = useParams();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (paramId && localStorage.getItem(paramId)) {
      const arstring = localStorage.getItem(paramId);
      arraytoref = arstring.split(",");

      
      colorPalette.surface = arraytoref[0];
      colorPalette.muted = arraytoref[1];
      colorPalette.secondary = arraytoref[2];
      colorPalette.primary = arraytoref[3];
      colorPalette.accent = arraytoref[4];

  
      setTick((prev) => prev + 1);
    }
  }, [paramId]); 

  const features = [
    {
      title: "Card 1",
      description: "This product is so insane that it will blow your mind.",
    },
    {
      title: "Card 2",
      description:
        "With our cutting edge technology, you can achieve insane performance.",
    },
    {
      title: "Card 3",
      description:
        "Seamlessly adapts to any screen size, from mobile to desktop.",
    },
    {
      title: "Card 4",
      description:
        "Intuitive APIs and comprehensive documentation for quick integration.",
    },
    {
      title: "Card 5",
      description:
        "Grows with your needs without compromising performance or reliability.",
    },
    {
      title: "Card 6",
      description:
        "Grows with your needs without compromising performance or reliability.",
    },
  ];

  return (
    <div className="min-h-screen ">
      <div className="bg-white py-5 px-8 border-b flex items-center justify-between">

        <div className="w-[80px] hidden md:block"></div> 


        <div className="flex flex-wrap gap-4 items-center justify-center">
          <Dropdown label="Primary" colorKey="primary" refreshUI={setTick} />
          <Dropdown label="Secondary" colorKey="secondary" refreshUI={setTick} />
          <Dropdown label="Accent" colorKey="accent" refreshUI={setTick} />
          <Dropdown label="Surface" colorKey="surface" refreshUI={setTick} />
          <Dropdown label="Muted" colorKey="muted" refreshUI={setTick} />
        </div>


        <button
          onClick={() => {
           
            savePalette();
          }}
          className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-400 rounded transition"
        >
          Save
        </button>
      </div>

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
          className="fixed bottom-8 right-8 z-[1000] px-4 py-3 flex items-center justify-center text-md shadow-xl transition-all duration-300 border rounded-md cursor-pointer hover:scale-110 active:scale-95"
          style={{
            backgroundColor: isDarkMode ? "#ffffff" : colorPalette.primary,
            color: isDarkMode ? colorPalette.primary : "#ffffff",
          }}
        >
          {isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
            className="absolute w-[400px] h-[400px] rounded-full opacity-10 -top-[200px] -right-[100px] "
            style={{ backgroundColor: colorPalette.secondary }}
          />
          <div
            className="absolute w-[300px] h-[300px] rounded-full opacity-10 -bottom-[100px] -left-[100px] "
            style={{ backgroundColor: colorPalette.accent }}
          />

          <div className="relative z-10 max-w-[800px] text-center">
            <h1 className="mb-6 text-6xl font-black leading-tight tracking-tight">
              Your main title <br />
              <span
                className="text-transparent bg-clip-text"
                style={{
                  color: `${colorPalette.accent}`,
                }}
              >
                and the important word
              </span>
            </h1>
            <p
              className="text-md leading-relaxed"
              style={{ color: isDarkMode ? "#b0b0b0" : colorPalette.muted }}
            >
              A pretty descriptive paragraph about why somebody would use your
              product and maybe add a fun fact or something because you really
              have to fill this space.
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
          <h2 className="mb-4 text-lg font-black text-center">
            Powerful Features
          </h2>
          <div className="flex justify-center  mt-4 mb-5">
            <p
              className="max-w-[600px] mx-auto mt-16 text-md text-center"
              style={{ color: isDarkMode ? "#b0b0b0" : colorPalette.muted }}
            >
              Everything you need to create, deploy, and scale your projects
              with confidence.
            </p>
          </div>

          <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 border-2 border-transparent border-l-[6px] rounded-xl cursor-pointer transition-all duration-300"
                style={{
                  backgroundColor: isDarkMode ? "#1a1a1a" : "#ffffff",

                  borderLeftColor: colorPalette.accent,
                }}
              >
                <h3
                  className="mb-3 text-lg font-semibold"
                  style={{
                    color: isDarkMode ? "#f5f5f5" : colorPalette.primary,
                  }}
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
            background: `${colorPalette.primary}`,
          }}
        >
          <h2 className="mb-6 text-4xl font-black">Ready to Get Started?</h2>
          <div className="flex justify-center  mt-2 mb-7">
            <p className="max-w-[600px] mx-auto mb-10 text-lg opacity-95">
              Join me and my three employees who are already building amazing
              things.
            </p>
          </div>
          <button
            className="px-8 py-3 text-md font-semibold text-white transition-transform duration-300 border-none rounded-md cursor-pointer hover:scale-105"
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
            borderTopColor: isDarkMode
              ? "#3333334D"
              : `${colorPalette.muted}4D`,
          }}
        >
          <div className="max-w-[1200px] mx-auto grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-8 mb-8">
            <div>
              <div className="mb-4 text-xl font-bold">
                Cliche Company
                <span style={{ color: colorPalette.secondary }}>.</span>
              </div>
              <p className="leading-relaxed opacity-80">
                Building modern web experiences with cool technology.
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
            © 2099 Cliche Company. No rights reserved.
          </div>
        </footer>

        <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(30px); } }
      `}</style>
      </div>
    </div>
  );
}
