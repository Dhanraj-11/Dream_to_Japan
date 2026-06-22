// // "use client";

// // export default function Hero() {
// //   return (
// //     <section className="hero section-top" id="home">
// //       <div className="hero-overlay"></div>
// //       <div className="container hero-content">
// //         <p className="section-chip animate-fade">A personal roadmap, dream, and journey</p>
// //         <h1 className="animate-slide-up">My Dream to Visit Japan</h1>
// //         <p className="hero-text animate-slide-up">
// //           Japan is not just a place I want to visit. It is a dream connected to
// //           technology, culture, discipline, nature, anime, and my journey as a
// //           B.Tech CSE student building a future in tech.
// //         </p>

// //         <div className="hero-btns animate-slide-up">
// //           <a href="#dream" className="btn btn-primary">Explore My Dream</a>
// //           <a href="#places" className="btn btn-secondary">Dream Places</a>
// //         </div>

// //         <div className="hero-cards">
// //           <div className="hero-card animate-slide-in">
// //             <h3>1 Dream</h3>
// //             <p>To visit Japan and experience it deeply.</p>
// //           </div>
// //           <div className="hero-card animate-slide-in">
// //             <h3>6 Places</h3>
// //             <p>Tokyo, Kyoto, Osaka, Nara, Fuji, Hiroshima.</p>
// //           </div>
// //           <div className="hero-card animate-slide-in">
// //             <h3>1 Roadmap</h3>
// //             <p>Career, language, savings, and planning.</p>
// //           </div>
// //         </div>
// //       </div>
// //     </section>
// //   );
// // }





// "use client";

// import dynamic from "next/dynamic";

// const HeroScene = dynamic(() => import("@/components/HeroScene"), {
//   ssr: false,
// });

// export default function Hero() {
//   return (
//     <section className="hero section-top" id="home">
//       <div className="hero-space-bg" />
//       <div className="hero-overlay" />
//       <div className="hero-sun-glow" />

//       {/* 3D Scene */}
//       <div className="hero-scene-wrap" aria-hidden="true">
//         <HeroScene />
//       </div>

//       <div className="container hero-content">
//         <div className="hero-copy">
//           <p className="section-chip animate-fade">
//             Future mission • Japan dream • software journey
//           </p>

//           <h1 className="animate-slide-up">
//             My Future Route <span>to Japan</span>
//           </h1>

//           <p className="hero-text animate-slide-up">
//             Japan is not just a place I want to visit. It is a dream connected
//             to technology, discipline, culture, anime, nature, and the future I
//             want to build as a software engineer.
//           </p>

//           <div className="hero-btns animate-slide-up">
//             <a href="#dream" className="btn btn-primary">
//               Explore My Dream
//             </a>
//             <a href="#places" className="btn btn-secondary">
//               Dream Places
//             </a>
//           </div>

//           <div className="hero-mission-line animate-slide-up">
//             <span className="pulse-dot" />
//             Building skills, projects, discipline, and the version of myself
//             that can one day reach Japan.
//           </div>
//         </div>

//         <div className="hero-cards">
//           <div className="hero-card animate-slide-in">
//             <h3>1 Dream</h3>
//             <p>To visit Japan and experience it deeply.</p>
//           </div>

//           <div className="hero-card animate-slide-in">
//             <h3>6 Places</h3>
//             <p>Tokyo, Kyoto, Osaka, Nara, Fuji, Hiroshima.</p>
//           </div>

//           <div className="hero-card animate-slide-in">
//             <h3>1 Roadmap</h3>
//             <p>Career, language, savings, projects, and planning.</p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



"use client";

import dynamic from "next/dynamic";

const HeroScene = dynamic(() => import("@/components/HeroScene"), {
  ssr: false,
});

export default function Hero() {
  return (
    <section className="hero section-top" id="home">
      <div className="hero-space-bg" />
      <div className="hero-overlay" />
      <div className="hero-sun-glow" />

      <div className="hero-scene-wrap" aria-hidden="true">
        <HeroScene />
      </div>

      <div className="container hero-content">
        <div className="hero-copy">
          <p className="section-chip animate-fade">
            Future mission • Japan dream • software journey
          </p>

          <h1 className="animate-slide-up">
            My Future Route <span>to Japan</span>
          </h1>

          <p className="hero-text animate-slide-up">
            Japan is not just a place I want to visit. It is a dream connected
            to technology, discipline, culture, anime, nature, and the future I
            want to build as a software engineer.
          </p>

          <div className="hero-btns animate-slide-up">
            <a href="#dream" className="btn btn-primary">
              Explore My Dream
            </a>
            <a href="#places" className="btn btn-secondary">
              Dream Places
            </a>
          </div>

          <div className="hero-mission-line animate-slide-up">
            <span className="pulse-dot" />
            Building skills, projects, discipline, and the version of myself
            that can one day reach Japan.
          </div>
        </div>

        <div className="hero-cards">
          <div className="hero-card animate-slide-in">
            <h3>1 Dream</h3>
            <p>To visit Japan and experience it deeply.</p>
          </div>

          <div className="hero-card animate-slide-in">
            <h3>6 Places</h3>
            <p>Tokyo, Kyoto, Osaka, Nara, Fuji, Hiroshima.</p>
          </div>

          <div className="hero-card animate-slide-in">
            <h3>1 Roadmap</h3>
            <p>Career, language, savings, projects, and planning.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

