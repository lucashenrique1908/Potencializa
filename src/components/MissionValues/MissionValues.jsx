import "./MissionValues.css";
import { missionData } from "../../data/mission.js";

function MissionValues() {
  return (
    <section className="mission-values mission-values--dark" id="mission" aria-labelledby="mission-values-title">
      <div className="container mission-values__wrapper">
        <div className="mission-values__intro">
          <span className="mission-values__eyebrow">Missão, Visão e Valores</span>
          <h2 className="mission-values__title" id="mission-values-title">
            Estrutura sólida para posicionamento de marca e crescimento estratégico.
          </h2>
          <p className="mission-values__description">
            Cada princípio e direção foi pensado para oferecer clareza à sua marca, foco no impacto e consistência na entrega.
          </p>
        </div>

        <div className="mission-values__cards">
          <article className="mission-card">
            <div className="mission-card__icon" aria-hidden="true">{missionData.mission.icon}</div>
            <h3 className="mission-card__title">{missionData.mission.title}</h3>
            <p className="mission-card__text">{missionData.mission.description}</p>
          </article>

          <article className="mission-card">
            <div className="mission-card__icon" aria-hidden="true">{missionData.vision.icon}</div>
            <h3 className="mission-card__title">{missionData.vision.title}</h3>
            <p className="mission-card__text">{missionData.vision.description}</p>
          </article>

          <article className="mission-card mission-card--values">
            <div className="mission-card__icon" aria-hidden="true">{missionData.values.icon}</div>
            <h3 className="mission-card__title">{missionData.values.title}</h3>
            <p className="mission-card__text">{missionData.values.description}</p>
          </article>
        </div>

        <div className="mission-values__badges">
          {missionData.values.items.map((value, idx) => (
            <span key={idx} className="mission-badge">
              {value}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default MissionValues;
