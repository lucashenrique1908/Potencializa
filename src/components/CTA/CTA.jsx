import "./CTA.css";
import ContactForm from "../ContactForm/ContactForm.jsx";

function CTA() {
  return (
    <section className="cta cta--light" id="contact" aria-labelledby="cta-title">
      <div className="container cta__content">
        <div className="cta__copy">
          <h2 className="cta__title" id="cta-title">
            Pronto para impulsionar sua marca com autoridade?
          </h2>
          <h4 className="cta__subtitle">
            Conecte-se com nosso time de especialistas e acelere conversões com campanhas inteligentes e conteúdo de impacto.
          </h4>
        </div>

        <div className="cta__form-wrap">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}

export default CTA;
