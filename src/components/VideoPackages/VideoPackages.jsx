import "./VideoPackages.css";
import videoPackages from "../../data/videoPackages.js";

function VideoPackages({ onOpenContact }) {
  return (
    <section id="video-packages" className="video-packages video-packages--light" aria-labelledby="video-packages-title">
      <div className="container video-packages__wrapper">
        <div className="video-packages__header">
          <span className="video-packages__eyebrow">Pacotes de Vídeo</span>
          <h2 className="video-packages__title" id="video-packages-title">
            Produção audiovisual que potencializa campanhas e redes sociais.
          </h2>
          <p className="video-packages__description">
            Escolha o pacote ideal para ativar sua marca em formatos que geram atenção, engajamento e conversão.
          </p>
        </div>

        <div className="video-packages__grid">
          {videoPackages.map((pack) => (
            <article key={pack.id} className="video-package-card">
              <h2 className="video-package-card__name">{pack.name}</h2>
              <p className="video-package-card__text">{pack.description}</p>
              <ul className="video-package-card__list">
                {pack.benefits.map((benefit, index) => (
                  <li key={index}>{benefit}</li>
                ))}
              </ul>
              <button type="button" className="btn btn--ghost" onClick={onOpenContact}>
                {pack.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default VideoPackages;
