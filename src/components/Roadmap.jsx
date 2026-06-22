"use client";

import { useState } from "react";
import roadmapData from "@/data/roadmapData";

export default function Roadmap({ className = "" }) {
  const [openId, setOpenId] = useState(1);

  const toggleItem = (id) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className={`section ${className}`} id="roadmap">
      <div className="container">
        <div className="section-head animate-fade">
          <p className="section-label">03 • Roadmap</p>
          <h2>My roadmap to reach Japan</h2>
          <p className="muted center-text">
            This is the practical path I want to follow as a B.Tech CSE student.
          </p>
        </div>

        <div className="roadmap-list animate-slide-in">
          {roadmapData.map((item) => (
            <div className="roadmap-item" key={item.id}>
              <button className="roadmap-btn" onClick={() => toggleItem(item.id)}>
                <span className="roadmap-number">{item.id}</span>
                <span className="roadmap-title">{item.title}</span>
                <span className="roadmap-toggle">{openId === item.id ? "−" : "+"}</span>
              </button>

              {openId === item.id && (
                <div className="roadmap-content">
                  <p>{item.content}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}