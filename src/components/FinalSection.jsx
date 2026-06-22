"use client";

export default function FinalSection({ className = "" }) {
  return (
    <section className={`section final-section ${className}`} id="final-note">
      <div className="container final-box">
        <p className="section-label light-label animate-fade">06 • Final Note</p>
        <h2 className="animate-slide-up">My promise to myself</h2>
        <p className="animate-slide-up">
          Japan is not only a place I want to see — it is a dream that pushes me
          to study harder, build my developer career, grow my skills, and create
          a future where international travel becomes possible. As a B.Tech CSE
          student, I want to use this dream as motivation: to learn, to earn, to
          explore, and one day stand in Japan knowing I worked honestly to reach
          there.
        </p>

        <div className="final-quote animate-fade">
          "One day I will not just read about Japan — I will walk through it."
        </div>

        <a href="#home" className="btn btn-primary animate-fade">Back to Top</a>
      </div>
    </section>
  );
}