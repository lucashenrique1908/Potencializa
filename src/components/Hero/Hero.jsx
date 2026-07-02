import "./Hero.css";
import imgProfile from "../../assets/images/imgProfile.jpeg";

function Hero({ onOpenContact }) {
  return (
    <section className="hero hero--dark" id="home" aria-label="Apresentação principal">
      <div className="container hero__inner">
        <div className="hero__copy">
          <p className="hero__eyebrow">Agência Potencializa</p>
          <h1 className="hero__headline">
            Criar é o começo.
            <span className="hero__headline--strong">Potencializar é o que nos move.</span>
          </h1>
          <p className="hero__lead">
            Potencializando histórias, marcas e resultados com estratégia, criatividade e tecnologia.
          </p>
          <p className="hero__description">
            Acelere sua presença digital com campanhas inteligentes, produção audiovisual premium e conteúdos que direcionam autoridade e conversão.
          </p>

          <div className="hero__actions">
            <button type="button" className="btn btn--primary btn--transparent btn--sharp btn--specialist" onClick={onOpenContact}>
              Falar com especialista
            </button>
            <a className="btn btn--ghost" href="#services">
              Conhecer serviços
            </a>
          </div>
        </div>

        <aside className="hero__visual" aria-hidden="true">
          <div className="hero__visual-frame">
            <img src={imgProfile} alt="Criatividade digital e tecnologia" className="hero__image" />
          </div>
        </aside>
      </div>
    </section>
  );
}

export default Hero;
