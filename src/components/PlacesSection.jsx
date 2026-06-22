"use client";

import { useState } from "react";
import Image from "next/image";
import places from "@/data/places";

export default function PlacesSection({ className = "" }) {
  const [selectedPlace, setSelectedPlace] = useState(places[0]);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section className={`section section-alt ${className}`} id="places">
      <div className="container">
        <div className="section-head animate-fade">
          <p className="section-label">04 • Dream Places</p>
          <h2>Places I want to visit in Japan</h2>
          <p className="muted center-text">
            Click any place card. The main image and details will change.
          </p>
        </div>

        <div className="places-layout">
          <div className="place-preview animate-slide-in">
            <div className="preview-image">
              <Image
                src={selectedPlace.image}
                alt={selectedPlace.name}
                fill
                className="cover-img"
              />
            </div>

            <div className="preview-content">
              <h3>{selectedPlace.name}</h3>
              <p>{selectedPlace.description}</p>

              <h4>Highlights</h4>
              <ul className="highlight-list">
                {selectedPlace.highlights.map((point, index) => (
                  <li key={index}>{point}</li>
                ))}
              </ul>

              <button className="btn btn-primary" onClick={() => setModalOpen(true)}>
                View More
              </button>
            </div>
          </div>

          <div className="places-grid animate-slide-in">
            {places.map((place) => (
              <button
                key={place.id}
                className={`place-card-btn ${
                  selectedPlace.id === place.id ? "active" : ""
                }`}
                onClick={() => setSelectedPlace(place)}
              >
                <div className="place-card-img">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="cover-img"
                  />
                </div>
                <div className="place-card-body">
                  <h4>{place.name}</h4>
                  <p>{place.short}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {modalOpen && (
          <div className="modal-overlay" onClick={() => setModalOpen(false)}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
              <button className="modal-close" onClick={() => setModalOpen(false)}>
                ×
              </button>

              <div className="modal-image">
                <Image
                  src={selectedPlace.image}
                  alt={selectedPlace.name}
                  fill
                  className="cover-img"
                />
              </div>

              <div className="modal-content">
                <h3>{selectedPlace.name}</h3>
                <p>{selectedPlace.description}</p>

                <h4>Why I want to visit</h4>
                <p>
                  {selectedPlace.name} is part of my dream because it shows a
                  different side of Japan—its beauty, culture, history, energy,
                  and emotional connection.
                </p>

                <h4>Top highlights</h4>
                <ul className="highlight-list">
                  {selectedPlace.highlights.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}