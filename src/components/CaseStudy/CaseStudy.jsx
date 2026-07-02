import "./CaseStudy.css";

function CaseStudy() {
  return (
    <section className="case-study case-study--dark" id="services" aria-labelledby="case-study-title">
      <div className="container case-study__wrapper">
        <div className="case-study__copy">
          <span className="case-study__eyebrow">Case Study</span>
          <h2 className="case-study__title" id="case-study-title">
            Antes e depois do crescimento digital.
          </h2>
          <p className="case-study__description">
            Uma comparação clara entre a presença atual do cliente e o impacto gerado pela nossa estratégia de vídeos, conteúdo e campanha.
          </p>
        </div>

        <div className="case-study__cards">
          <article className="case-card case-card--before">
            <span className="case-card__label">ANTES</span>
            <p className="case-card__metric">2,1k seguidores</p>
            <p className="case-card__text">Engajamento orgânico limitado e mensagem sem foco.</p>
          </article>

          <div className="case-study__divider" aria-hidden="true">
            <span>↓</span>
          </div>

          <article className="case-card case-card--after">
            <span className="case-card__label">DEPOIS</span>
            <p className="case-card__metric">14,8k seguidores</p>
            <p className="case-card__text">Crescimento acelerado com presença profissional e conteúdo estratégico.</p>
          </article>
        </div>
      </div>
    </section>
  );
}

export default CaseStudy;
