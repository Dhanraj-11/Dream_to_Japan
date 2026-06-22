"use client";

import { useState } from "react";
import whyJapanData from "@/data/whyJapanData";

export default function WhyJapanTabs({ className = "" }) {
  const [activeTab, setActiveTab] = useState(whyJapanData[0]);

  return (
    <section className={`section section-alt ${className}`} id="why-japan">
      <div className="container">
        <div className="section-head animate-fade">
          <p className="section-label">02 • Why Japan</p>
          <h2>What connects me to Japan</h2>
          <p className="muted center-text">
            Click the tabs below to explore the reasons Japan inspires me.
          </p>
        </div>

        <div className="tabs-wrapper">
          <div className="tabs-list animate-slide-in">
            {whyJapanData.map((item) => (
              <button
                key={item.id}
                className={`tab-btn ${
                  activeTab.id === item.id ? "active" : ""
                }`}
                onClick={() => setActiveTab(item)}
              >
                <span>{item.icon}</span> {item.title}
              </button>
            ))}
          </div>

          <div className="tab-content-box animate-slide-in">
            <div className="tab-icon">{activeTab.icon}</div>
            <h3>{activeTab.title}</h3>
            <p>{activeTab.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
}