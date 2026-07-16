import "./Plans.css";
import plans from "../../data/plans.js";

function Plans({ onOpenContact }) {
  return (
    <section className="plans plans--light" aria-labelledby="plans-title">
      <div className="container plans__wrapper">
        <div className="plans__header">
          <span className="plans__eyebrow">Planos</span>
          <h2 className="plans__title" id="plans-title">
            Planos pensados para cada etapa de crescimento digital.
          </h2>
          <p className="plans__description">
            Estruturas de oferta que combinam estratégia, criatividade e execução para marcas que buscam resultados consistentes.
          </p>
        </div>

        <div className="plans__grid">
          {plans.map((plan) => (
            <article key={plan.id} className="plan-card scroll-highlight">
              <h2 className="plan-card__tag">{plan.title}</h2>
              <p className="plan-card__highlight">{plan.highlight}</p>
              <ul className="plan-card__features">
                {plan.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`btn btn--ghost${plan.cta === "Falar com especialista" ? " btn--transparent btn--sharp btn--specialist" : ""}`}
                onClick={onOpenContact}
              >
                {plan.cta}
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Plans;
