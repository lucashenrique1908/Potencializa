import "./Results.css";
import results from "../../data/results.js";

function Results() {
  return (
    <section className="results results--light" id="results" aria-labelledby="results-title">
      <div className="container results__wrapper">
        <div className="results__header">
          <span className="results__eyebrow">Resultados</span>
          <h2 className="results__title" id="results-title">
            Métricas que comprovam crescimento real.
          </h2>
          <p className="results__description">
            Trabalhamos para gerar resultados mensuráveis com impacto direto no reconhecimento e nas conversões de seus projetos.
          </p>
        </div>

        <div className="results__grid">
          {results.map((item) => (
            <article key={item.id} className="results-card">
              <strong className="results-card__value">{item.value}</strong>
              <p className="results-card__label">{item.label}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Results;
