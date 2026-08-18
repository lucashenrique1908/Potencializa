import "./Plans.css";
import { openWhatsAppLink } from "../../utils/whatsapp.js";
import plans from "../../data/plans.js";

function Plans() {
  const handlePlanClick = (plan) => {
    openWhatsAppLink({
      plan: plan.title,
      message: `Olá, quero saber mais sobre o plano ${plan.title}.`,
      context: "Plans section",
    });
  };

  return (
    <section className="plans plans--light" id="plans" aria-labelledby="plans-title">
      <div className="container plans__wrapper">
        <div className="plans__header">
          <span className="plans__eyebrow">Planos</span>
          <h2 className="plans__title" id="plans-title">
            Escolha a parceria que melhor combina com a fase do seu crescimento.
          </h2>
          <p className="plans__description">
            Estruturas sob medida para marcas que querem conteúdo com estratégia, presença premium e execução consistente.
          </p>
        </div>

        <div className="plans__grid">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`plan-card scroll-highlight${plan.featured ? " plan-card--featured" : ""}`}
            >
              {plan.featured && <span className="plan-card__badge">Mais Escolhido</span>}
              <div className="plan-card__topline">
                <h2 className="plan-card__tag">{plan.title}</h2>
                <span className="plan-card__subtitle">{plan.subtitle}</span>
              </div>
              <p className="plan-card__highlight">{plan.highlight}</p>
              <ul className="plan-card__features">
                {plan.features.map((feature, index) => (
                  <li key={`${plan.id}-${index}`}>{feature}</li>
                ))}
              </ul>
              <button
                type="button"
                className={`btn ${plan.featured ? "btn--primary" : "btn--ghost btn--transparent btn--sharp btn--specialist"}`}
                onClick={() => handlePlanClick(plan)}
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
