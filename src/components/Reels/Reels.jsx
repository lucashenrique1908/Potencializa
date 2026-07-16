import React, { useEffect, useRef, useState } from "react";
import "./Reels.css";

const REELS = [
  "https://www.instagram.com/reel/DZx6apluLDE/",
  "https://www.instagram.com/reel/DXPtT1_CBk2/",
  "https://www.instagram.com/reel/DWoOWFXIZ7q/",
  "https://www.instagram.com/reel/DVq2SZDCMJo/",
  "https://www.instagram.com/reel/DPMZsGCAFUj/",
];

function loadInstagram() {
  if (window.instgrm && window.instgrm.Embeds) return Promise.resolve();
  return new Promise((resolve) => {
    if (document.querySelector('script[src="https://www.instagram.com/embed.js"]')) {
      // script already added but not ready
      const check = setInterval(() => {
        if (window.instgrm && window.instgrm.Embeds) {
          clearInterval(check);
          resolve();
        }
      }, 50);
      return;
    }
    const s = document.createElement("script");
    s.src = "https://www.instagram.com/embed.js";
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    document.body.appendChild(s);
  });
}

export default function Reels() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    loadInstagram().then(() => {
      if (mounted && window.instgrm && window.instgrm.Embeds) {
        window.instgrm.Embeds.process();
      }
    });

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const updateActiveCard = () => {
      const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
      const cards = Array.from(container.querySelectorAll(".reel-card"));
      const closestCard = cards.reduce((closest, card) => {
        const rect = card.getBoundingClientRect();
        const distance = Math.abs(rect.left + rect.width / 2 - containerCenter);
        return !closest || distance < closest.distance ? { card, distance } : closest;
      }, null);

      if (closestCard) setActiveIndex(Number(closestCard.card.dataset.index));
    };

    updateActiveCard();
    container.addEventListener("scroll", updateActiveCard, { passive: true });
    window.addEventListener("resize", updateActiveCard);
    return () => {
      container.removeEventListener("scroll", updateActiveCard);
      window.removeEventListener("resize", updateActiveCard);
    };
  }, []);
  return (
    <section className="reels-section">
      <div className="reels-container">
        <header className="reels-header">
          <h2 className="reels-title">Acompanhe nossos últimos Reels</h2>
          <p className="reels-subtitle">Conteúdo exclusivo sobre marketing, estratégia e crescimento para empresas.</p>
        </header>

        <div className="reels-carousel-wrapper">
            <div className="reels-scroll" role="list" ref={scrollRef}>
              {REELS.map((url, index) => (
                <div
                  className={`reel-card ${index === activeIndex ? "reel-card--active" : "reel-card--inactive"}`}
                  key={url}
                  role="listitem"
                  data-index={index}
                >
                  <div
                    className="reel-embed"
                    dangerouslySetInnerHTML={{
                      __html: `<blockquote class="instagram-media" data-instgrm-permalink="${url}" data-instgrm-version="14"></blockquote>`,
                    }}
                  />
                </div>
              ))}
            </div>
        </div>

        <div className="reels-cta">
          <a
            className="reels-button"
            href="https://www.instagram.com/potencializamkt_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="reels-button-icon" aria-hidden>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" />
                <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
              </svg>
            </span>
            Ver mais Reels no Instagram
          </a>
        </div>
      </div>
    </section>
  );
}
