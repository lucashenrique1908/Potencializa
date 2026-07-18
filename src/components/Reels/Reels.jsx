import ReelsCarousel from "./ReelsCarousel.jsx";
import "./Reels.css";

export default function Reels() {
  return (
    <section className="reels-section">
      <div className="reels-container">
        <header className="reels-header">
          <h2 className="reels-title">Acompanhe nossos últimos Reels</h2>
          <p className="reels-subtitle">
            Conteúdo exclusivo sobre marketing, estratégia e crescimento para empresas.
          </p>
        </header>

        <ReelsCarousel />

        <div className="reels-cta">
          <a
            className="reels-button"
            href="https://www.instagram.com/potencializamkt_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="reels-button-icon" aria-hidden="true">
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
