import "./ExtraServices.css";
import { extraServices } from "../../data/services.js";

function ExtraServices() {
  return (
    <section className="extra-services extra-services--dark" aria-labelledby="extra-services-title">
      <div className="container extra-services__wrapper">
        <div className="extra-services__header">
          <span className="extra-services__eyebrow">Serviços Avulsos</span>
          <h2 className="extra-services__title" id="extra-services-title">
            Soluções específicas para fortalecer sua presença digital em cada ponto de contato.
          </h2>
          <p className="extra-services__description">
            Serviços avulsos pensados para projetos que desejam apoio especializado em design, tráfego, captação e cobertura digital.
          </p>
        </div>

        <div className="extra-services__grid">
          {extraServices.map((service) => (
            <article key={service.id} className="extra-card">
              <div className="extra-card__icon" aria-hidden="true">
                {service.icon}
              </div>
              <h3 className="extra-card__title">{service.title}</h3>
              <p className="extra-card__text">{service.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default ExtraServices;
