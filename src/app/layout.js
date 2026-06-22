import "./globals.css";

export const metadata = {
  title: "My Dream to Visit Japan",
  description:
    "A personal website about my dream to visit Japan, my roadmap, places to explore, and motivation as a B.Tech CSE student.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

// import "./globals.css";

// export const metadata = {
//   title: "My Dream to Visit Japan",
//   description:
//     "A personal website about my dream to visit Japan, my roadmap, places to explore, and motivation as a B.Tech CSE student.",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>{children}</body>
//     </html>
//   );
// }