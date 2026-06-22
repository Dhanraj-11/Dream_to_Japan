"use client";

import { useEffect, useState } from "react";

const defaultSkills = [
  { id: "java", name: "Java", value: 65 },
  { id: "spring", name: "Spring Boot", value: 50 },
  { id: "dsa", name: "DSA", value: 55 },
  { id: "sql", name: "SQL / MongoDB", value: 45 },
  { id: "frontend", name: "Frontend Basics", value: 60 },
  { id: "projects", name: "Project Building", value: 50 },
  { id: "communication", name: "Communication", value: 40 },
];

export default function SkillsEngine({ className = "" }) {
  const [skills, setSkills] = useState(defaultSkills);
  const [hydrated, setHydrated] = useState(false);

  // Load saved progress after mount only, to avoid hydration mismatch
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("japan-skills");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === defaultSkills.length) {
          setSkills(parsed);
        }
      }
    } catch (err) {
      // ignore corrupt storage
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem("japan-skills", JSON.stringify(skills));
    } catch (err) {
      // storage may be unavailable, fail silently
    }
  }, [skills, hydrated]);

  const updateSkill = (id, value) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, value: Number(value) } : s))
    );
  };

  return (
    <section className={`section section-alt ${className}`} id="skills">
      <div className="container">
        <div className="section-head animate-fade">
          <p className="section-label">07 • Skills Engine</p>
          <h2>Career Growth Engine</h2>
          <p className="muted center-text">
            Drag a slider to update where you honestly stand today. Saved automatically.
          </p>
        </div>

        <div className="skills-list animate-slide-in">
          {skills.map((skill) => (
            <div className="skill-row" key={skill.id}>
              <div className="skill-row-top">
                <span>{skill.name}</span>
                <span>{skill.value}%</span>
              </div>
              <div className="skill-track">
                <div className="skill-fill" style={{ width: `${skill.value}%` }} />
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={skill.value}
                onChange={(e) => updateSkill(skill.id, e.target.value)}
                className="skill-slider"
                aria-label={`${skill.name} progress`}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}