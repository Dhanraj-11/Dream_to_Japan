"use client";

const status = [
  { label: "Current Focus", value: "Java + Spring Boot + DSA" },
  { label: "Dream Destination", value: "Japan" },
  { label: "Mission Stage", value: "Skill Building" },
  { label: "Target", value: "Internship → Software Career" },
  { label: "Build Mode", value: "Projects + Learning" },
  { label: "Long-Term Goal", value: "Visit / Work toward Japan" },
];

export default function MissionStatus({ className = "" }) {
  return (
    <section className={`section ${className}`} id="mission-status">
      <div className="container">
        <div className="section-head animate-fade">
          <p className="section-label">05 • Mission Status</p>
          <h2>Dream Dashboard</h2>
          <p className="muted center-text">
            A live snapshot of where I am right now on the way to Japan.
          </p>
        </div>

        <div className="status-grid animate-slide-in">
          {status.map((item) => (
            <div className="status-card" key={item.label}>
              <p className="status-label">
                <span className="status-dot" />
                {item.label}
              </p>
              <p className="status-value">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}