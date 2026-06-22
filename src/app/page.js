"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DreamSection from "@/components/DreamSection";
import WhyJapanTabs from "@/components/WhyJapanTabs";
import Roadmap from "@/components/Roadmap";
import PlacesSection from "@/components/PlacesSection";
import MissionStatus from "@/components/MissionStatus";
import BudgetPlanner from "@/components/BudgetPlanner";
import SkillsEngine from "@/components/SkillsEngine";
import FinalSection from "@/components/FinalSection";
import Footer from "@/components/Footer";
import AnimationLanding from "@/components/AnimationLanding";

export default function Home() {
  const [darkMode, setDarkMode] = useState(false);
  const [showAnimation, setShowAnimation] = useState(true);
  const [showWebsite, setShowWebsite] = useState(false);
  const [warping, setWarping] = useState(false);

  useEffect(() => {
    const savedTheme =
      typeof window !== "undefined"
        ? localStorage.getItem("japan-theme")
        : null;

    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    } else {
      document.body.classList.remove("dark");
    }

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const section = entry.target;
          section.classList.add("visible");

          if (!section.dataset.swept && !prefersReduced) {
            section.dataset.swept = "true";
            section.classList.add("sweeping");

            const heading = section.querySelector("h2");
            if (heading) heading.classList.add("glitch-text");

            setTimeout(() => {
              section.classList.remove("sweeping");
              if (heading) heading.classList.remove("glitch-text");
            }, 900);
          }
        });
      },
      { threshold: 0.15 }
    );

    const animatedSections = document.querySelectorAll(".animate-on-view");

    animatedSections.forEach((section) => {
      const children = section.querySelectorAll(
        ".hero-card, .roadmap-item, .place-card, .status-card, .skill-row, .budget-box, .final-card"
      );

      children.forEach((child, i) => {
        child.style.setProperty("--d", `${i * 0.06}s`);
      });

      observer.observe(section);
    });

    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      document.documentElement.style.setProperty("--scroll", `${pct}%`);
    };

    const handleWarpJump = () => {
      if (prefersReduced) return;
      setWarping(true);
      setTimeout(() => setWarping(false), 520);
    };

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("warp-jump", handleWarpJump);

    updateProgress();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("warp-jump", handleWarpJump);
    };
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (next) {
      document.body.classList.add("dark");
      localStorage.setItem("japan-theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("japan-theme", "light");
    }
  };

  const handleAnimationComplete = () => {
    setShowWebsite(true);
    setTimeout(() => {
      setShowAnimation(false);
    }, 250);
  };

  return (
    <>
      <div className="hud-progress" />
      <div className={`warp-overlay ${warping ? "active" : ""}`} />

      {showAnimation && (
        <AnimationLanding onAnimationComplete={handleAnimationComplete} />
      )}

      <main
        style={{
          opacity: showWebsite ? 1 : 0,
          transition: "opacity 1s ease",
          minHeight: "100vh",
        }}
      >
        <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
        <Hero />
        <DreamSection className="animate-on-view" />
        <WhyJapanTabs className="animate-on-view" />
        <Roadmap className="animate-on-view" />
        <PlacesSection className="animate-on-view" />
        <MissionStatus className="animate-on-view" />
        <BudgetPlanner className="animate-on-view" />
        <SkillsEngine className="animate-on-view" />
        <FinalSection className="animate-on-view" />
        <Footer />
      </main>
    </>
  );
}








// // // "use client";

// // // import { useEffect, useState } from "react";
// // // import Navbar from "@/components/Navbar";
// // // import Hero from "@/components/Hero";
// // // import DreamSection from "@/components/DreamSection";
// // // import WhyJapanTabs from "@/components/WhyJapanTabs";
// // // import Roadmap from "@/components/Roadmap";
// // // import PlacesSection from "@/components/PlacesSection";
// // // import MissionStatus from "@/components/MissionStatus";
// // // import BudgetPlanner from "@/components/BudgetPlanner";
// // // import SkillsEngine from "@/components/SkillsEngine";
// // // import FinalSection from "@/components/FinalSection";
// // // import Footer from "@/components/Footer";
// // // import AnimationLanding from "@/components/AnimationLanding";

// // // export default function Home() {
// // //   const [darkMode, setDarkMode] = useState(false);
// // //   const [showAnimation, setShowAnimation] = useState(true);
// // //   const [showWebsite, setShowWebsite] = useState(false);
// // //   const [warping, setWarping] = useState(false);

// // //   useEffect(() => {
// // //     const savedTheme = localStorage.getItem("japan-theme");
// // //     if (savedTheme === "dark") {
// // //       setDarkMode(true);
// // //       document.body.classList.add("dark");
// // //     }

// // //     const prefersReduced = window.matchMedia(
// // //       "(prefers-reduced-motion: reduce)"
// // //     ).matches;

// // //     // Reveal observer — adds .visible, then a one-time scan-sweep +
// // //     // glitch-in heading the first time each section enters view.
// // //     const observer = new IntersectionObserver(
// // //       (entries) => {
// // //         entries.forEach((entry) => {
// // //           if (entry.isIntersecting) {
// // //             const section = entry.target;
// // //             section.classList.add("visible");

// // //             if (!section.dataset.swept && !prefersReduced) {
// // //               section.dataset.swept = "true";
// // //               section.classList.add("sweeping");

// // //               const heading = section.querySelector("h2");
// // //               if (heading) heading.classList.add("glitch-text");

// // //               setTimeout(() => {
// // //                 section.classList.remove("sweeping");
// // //                 if (heading) heading.classList.remove("glitch-text");
// // //               }, 900);
// // //             }
// // //           }
// // //         });
// // //       },
// // //       { threshold: 0.15 }
// // //     );

// // //     document.querySelectorAll(".animate-on-view").forEach((section) => {
// // //       const children = section.querySelectorAll(
// // //         ".hero-card, .roadmap-item, .place-card-btn, .status-card, .skill-row"
// // //       );
// // //       children.forEach((child, i) => {
// // //         child.style.setProperty("--d", `${i * 0.06}s`);
// // //       });
// // //       observer.observe(section);
// // //     });

// // //     // HUD scroll-progress bar
// // //     const updateProgress = () => {
// // //       const scrollTop = window.scrollY;
// // //       const docHeight =
// // //         document.documentElement.scrollHeight - window.innerHeight;
// // //       const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
// // //       document.documentElement.style.setProperty("--scroll", `${pct}%`);
// // //     };
// // //     window.addEventListener("scroll", updateProgress, { passive: true });
// // //     updateProgress();

// // //     // Warp-jump flash, triggered by Navbar clicks
// // //     const handleWarpJump = () => {
// // //       if (prefersReduced) return;
// // //       setWarping(true);
// // //       setTimeout(() => setWarping(false), 520);
// // //     };
// // //     window.addEventListener("warp-jump", handleWarpJump);

// // //     return () => {
// // //       observer.disconnect();
// // //       window.removeEventListener("scroll", updateProgress);
// // //       window.removeEventListener("warp-jump", handleWarpJump);
// // //     };
// // //   }, [showWebsite]);

// // //   const toggleTheme = () => {
// // //     const newTheme = !darkMode;
// // //     setDarkMode(newTheme);

// // //     if (newTheme) {
// // //       document.body.classList.add("dark");
// // //       localStorage.setItem("japan-theme", "dark");
// // //     } else {
// // //       document.body.classList.remove("dark");
// // //       localStorage.setItem("japan-theme", "light");
// // //     }
// // //   };

// // //   const handleAnimationComplete = () => {
// // //     setShowWebsite(true);
// // //     setTimeout(() => {
// // //       setShowAnimation(false);
// // //     }, 100);
// // //   };

// // //   return (
// // //     <>
// // //       <div className="hud-progress" />
// // //       <div className={`warp-overlay ${warping ? "active" : ""}`} />

// // //       {showAnimation && (
// // //         <AnimationLanding onAnimationComplete={handleAnimationComplete} />
// // //       )}

// // //       <div
// // //         style={{
// // //           opacity: showWebsite ? 1 : 0,
// // //           transition: "opacity 1.5s ease-in-out",
// // //           minHeight: "100vh",
// // //         }}
// // //       >
// // //         <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
// // //         <Hero />
// // //         <DreamSection className="animate-on-view" />
// // //         <WhyJapanTabs className="animate-on-view" />
// // //         <Roadmap className="animate-on-view" />
// // //         <PlacesSection className="animate-on-view" />
// // //         <MissionStatus className="animate-on-view" />
// // //         <BudgetPlanner className="animate-on-view" />
// // //         <SkillsEngine className="animate-on-view" />
// // //         <FinalSection className="animate-on-view" />
// // //         <Footer />
// // //       </div>
// // //     </>
// // //   );
// // // }





// // "use client";

// // import { useEffect, useState, useCallback } from "react";
// // import Navbar from "@/components/Navbar";
// // import Hero from "@/components/Hero";
// // import DreamSection from "@/components/DreamSection";
// // import WhyJapanTabs from "@/components/WhyJapanTabs";
// // import Roadmap from "@/components/Roadmap";
// // import PlacesSection from "@/components/PlacesSection";
// // import MissionStatus from "@/components/MissionStatus";
// // import BudgetPlanner from "@/components/BudgetPlanner";
// // import SkillsEngine from "@/components/SkillsEngine";
// // import FinalSection from "@/components/FinalSection";
// // import Footer from "@/components/Footer";
// // import AnimationLanding from "@/components/AnimationLanding";

// // export default function Home() {
// //   const [darkMode, setDarkMode] = useState(false);
// //   const [showAnimation, setShowAnimation] = useState(true);
// //   const [showWebsite, setShowWebsite] = useState(false);
// //   const [warping, setWarping] = useState(false);

// //   useEffect(() => {
// //     const savedTheme = localStorage.getItem("japan-theme");
// //     if (savedTheme === "dark") {
// //       setDarkMode(true);
// //       document.body.classList.add("dark");
// //     }

// //     const prefersReduced = window.matchMedia(
// //       "(prefers-reduced-motion: reduce)"
// //     ).matches;

// //     const observer = new IntersectionObserver(
// //       (entries) => {
// //         entries.forEach((entry) => {
// //           if (entry.isIntersecting) {
// //             const section = entry.target;
// //             section.classList.add("visible");

// //             if (!section.dataset.swept && !prefersReduced) {
// //               section.dataset.swept = "true";
// //               section.classList.add("sweeping");

// //               const heading = section.querySelector("h2");
// //               if (heading) heading.classList.add("glitch-text");

// //               setTimeout(() => {
// //                 section.classList.remove("sweeping");
// //                 if (heading) heading.classList.remove("glitch-text");
// //               }, 900);
// //             }
// //           }
// //         });
// //       },
// //       { threshold: 0.15 }
// //     );

// //     document.querySelectorAll(".animate-on-view").forEach((section) => {
// //       const children = section.querySelectorAll(
// //         ".hero-card, .roadmap-item, .place-card-btn, .status-card, .skill-row"
// //       );
// //       children.forEach((child, i) => {
// //         child.style.setProperty("--d", `${i * 0.06}s`);
// //       });
// //       observer.observe(section);
// //     });

// //     const updateProgress = () => {
// //       const scrollTop = window.scrollY;
// //       const docHeight =
// //         document.documentElement.scrollHeight - window.innerHeight;
// //       const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
// //       document.documentElement.style.setProperty("--scroll", `${pct}%`);
// //     };
// //     window.addEventListener("scroll", updateProgress, { passive: true });
// //     updateProgress();

// //     const handleWarpJump = () => {
// //       if (prefersReduced) return;
// //       setWarping(true);
// //       setTimeout(() => setWarping(false), 520);
// //     };
// //     window.addEventListener("warp-jump", handleWarpJump);

// //     return () => {
// //       observer.disconnect();
// //       window.removeEventListener("scroll", updateProgress);
// //       window.removeEventListener("warp-jump", handleWarpJump);
// //     };
// //   }, [showWebsite]);

// //   const toggleTheme = () => {
// //     const newTheme = !darkMode;
// //     setDarkMode(newTheme);

// //     if (newTheme) {
// //       document.body.classList.add("dark");
// //       localStorage.setItem("japan-theme", "dark");
// //     } else {
// //       document.body.classList.remove("dark");
// //       localStorage.setItem("japan-theme", "light");
// //     }
// //   };

// //   // Stable reference so AnimationLanding's effect (which depends on this
// //   // callback) doesn't tear down and restart the WebGL scene on every
// //   // re-render of Home — this was causing the intro to flash and reset.
// //   const handleAnimationComplete = useCallback(() => {
// //     setShowWebsite(true);
// //     setTimeout(() => {
// //       setShowAnimation(false);
// //     }, 100);
// //   }, []);

// //   return (
// //     <>
// //       <div className="hud-progress" />
// //       <div className={`warp-overlay ${warping ? "active" : ""}`} />

// //       {showAnimation && (
// //         <AnimationLanding onAnimationComplete={handleAnimationComplete} />
// //       )}

// //       <div
// //         style={{
// //           opacity: showWebsite ? 1 : 0,
// //           transition: "opacity 1.5s ease-in-out",
// //           minHeight: "100vh",
// //         }}
// //       >
// //         <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
// //         <Hero />
// //         <DreamSection className="animate-on-view" />
// //         <WhyJapanTabs className="animate-on-view" />
// //         <Roadmap className="animate-on-view" />
// //         <PlacesSection className="animate-on-view" />
// //         <MissionStatus className="animate-on-view" />
// //         <BudgetPlanner className="animate-on-view" />
// //         <SkillsEngine className="animate-on-view" />
// //         <FinalSection className="animate-on-view" />
// //         <Footer />
// //       </div>
// //     </>
// //   );
// // }



// "use client";

// import { useEffect, useState } from "react";
// import Navbar from "@/components/Navbar";
// import Hero from "@/components/Hero";
// import DreamSection from "@/components/DreamSection";
// import WhyJapanTabs from "@/components/WhyJapanTabs";
// import Roadmap from "@/components/Roadmap";
// import PlacesSection from "@/components/PlacesSection";
// import MissionStatus from "@/components/MissionStatus";
// import BudgetPlanner from "@/components/BudgetPlanner";
// import SkillsEngine from "@/components/SkillsEngine";
// import FinalSection from "@/components/FinalSection";
// import Footer from "@/components/Footer";
// import AnimationLanding from "@/components/AnimationLanding";

// export default function Home() {
//   const [darkMode, setDarkMode] = useState(false);
//   const [showAnimation, setShowAnimation] = useState(true);
//   const [showWebsite, setShowWebsite] = useState(false);
//   const [warping, setWarping] = useState(false);

//   useEffect(() => {
//     const savedTheme = localStorage.getItem("japan-theme");
//     if (savedTheme === "dark") {
//       setDarkMode(true);
//       document.body.classList.add("dark");
//     }

//     const prefersReduced = window.matchMedia(
//       "(prefers-reduced-motion: reduce)"
//     ).matches;

//     const observer = new IntersectionObserver(
//       (entries) => {
//         entries.forEach((entry) => {
//           if (!entry.isIntersecting) return;

//           const section = entry.target;
//           section.classList.add("visible");

//           if (!section.dataset.swept && !prefersReduced) {
//             section.dataset.swept = "true";
//             section.classList.add("sweeping");

//             const heading = section.querySelector("h2");
//             if (heading) heading.classList.add("glitch-text");

//             setTimeout(() => {
//               section.classList.remove("sweeping");
//               if (heading) heading.classList.remove("glitch-text");
//             }, 900);
//           }
//         });
//       },
//       { threshold: 0.15 }
//     );

//     const animatedSections = document.querySelectorAll(".animate-on-view");
//     animatedSections.forEach((section) => {
//       const children = section.querySelectorAll(
//         ".hero-card, .roadmap-item, .place-card-btn, .status-card, .skill-row"
//       );

//       children.forEach((child, i) => {
//         child.style.setProperty("--d", `${i * 0.06}s`);
//       });

//       observer.observe(section);
//     });

//     const updateProgress = () => {
//       const scrollTop = window.scrollY;
//       const docHeight =
//         document.documentElement.scrollHeight - window.innerHeight;
//       const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
//       document.documentElement.style.setProperty("--scroll", `${pct}%`);
//     };

//     window.addEventListener("scroll", updateProgress, { passive: true });
//     updateProgress();

//     const handleWarpJump = () => {
//       if (prefersReduced) return;
//       setWarping(true);
//       setTimeout(() => setWarping(false), 520);
//     };

//     window.addEventListener("warp-jump", handleWarpJump);

//     return () => {
//       observer.disconnect();
//       window.removeEventListener("scroll", updateProgress);
//       window.removeEventListener("warp-jump", handleWarpJump);
//     };
//   }, []);

//   const toggleTheme = () => {
//     const newTheme = !darkMode;
//     setDarkMode(newTheme);

//     if (newTheme) {
//       document.body.classList.add("dark");
//       localStorage.setItem("japan-theme", "dark");
//     } else {
//       document.body.classList.remove("dark");
//       localStorage.setItem("japan-theme", "light");
//     }
//   };

//   const handleAnimationComplete = () => {
//     setShowWebsite(true);
//     setTimeout(() => {
//       setShowAnimation(false);
//     }, 100);
//   };

//   return (
//     <>
//       <div className="hud-progress" />
//       <div className={`warp-overlay ${warping ? "active" : ""}`} />

//       {showAnimation && (
//         <AnimationLanding onAnimationComplete={handleAnimationComplete} />
//       )}

//       <div
//         style={{
//           opacity: showWebsite ? 1 : 0,
//           transition: "opacity 1.2s ease-in-out",
//           minHeight: "100vh",
//         }}
//       >
//         <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
//         <Hero />
//         <DreamSection className="animate-on-view" />
//         <WhyJapanTabs className="animate-on-view" />
//         <Roadmap className="animate-on-view" />
//         <PlacesSection className="animate-on-view" />
//         <MissionStatus className="animate-on-view" />
//         <BudgetPlanner className="animate-on-view" />
//         <SkillsEngine className="animate-on-view" />
//         <FinalSection className="animate-on-view" />
//         <Footer />
//       </div>
//     </>
//   );
// }

