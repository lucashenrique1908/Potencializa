import "./SocialMedia.css";
import { socialMediaServices } from "../../data/services.js";

function SocialMedia() {
  return (
    <section id="social-media" className="social-media social-media--dark" aria-labelledby="social-media-title">
      <div className="container social-media__wrapper">
        <div className="social-media__hero">
          <span className="social-media__eyebrow">Social Media</span>
          <h2 className="social-media__title" id="social-media-title">
            Posicionamento, conexão e autoridade para sua presença digital.
          </h2>
          <p className="social-media__description">
            Vamos construir uma presença social que amplia alcance, consolida marca e transforma seguidores em oportunidades.
          </p>
        </div>

        <div className="social-media__cards">
          {socialMediaServices.map((service) => (
            <article key={service.id} className="social-card">
              <div className="social-card__icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="social-card__title">{service.title}</h3>
              <p className="social-card__text">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialMedia;
