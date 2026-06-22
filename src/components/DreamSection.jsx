"use client";

import Image from "next/image";

export default function DreamSection({ className = "" }) {
  return (
    <section className={`section ${className}`} id="dream">
      <div className="container two-col">
        <div className="animate-slide-in">
          <p className="section-label">01 • My Dream</p>
          <h2>Why Japan is special to me</h2>
          <p className="muted">
            I am a B.Tech Computer Science student, and Japan represents two
            things I deeply admire: advanced technology and deep cultural roots.
            When I think of Japan, I think of bullet trains, robotics,
            discipline, clean cities, peaceful temples, cherry blossoms, anime,
            and a society that balances tradition with innovation.
          </p>
          <p className="muted">
            My dream is not only to travel there as a tourist, but to understand
            Japan with respect—its work ethic, history, food, cities, nature,
            and the way people value time, learning, and responsibility.
          </p>

          <div className="quote-box animate-fade">
            "Japan is not just a destination on the map. For me, it is a
            destination in life."
          </div>
        </div>

        <div className="image-card large-image animate-slide-in">
          <Image
            src="/images/dream.jpg"
            alt="Japan Dream"
            fill
            className="cover-img"
          />
        </div>
      </div>
    </section>
  );
}