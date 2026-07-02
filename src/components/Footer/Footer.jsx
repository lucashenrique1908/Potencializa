import "./Footer.css";

function Footer({ onOpenContact }) {
  return (
    <footer className="footer" id="footer">
      <div className="container footer__content">
        <div className="footer__brand">
          <h2 className="footer__tag">Criar é o começo. Potencializar é o que nos move.</h2>
        </div>

        <div className="footer__countries">
          <h4>Países de atuação</h4>
          <ul>
            <li>Portugal</li>
            <li>Brasil</li>
            <li>Estados Unidos</li>
          </ul>
        </div>

        <div className="footer__contacts">
          <h4>Contato</h4>
          <ul>
            <li>
              <a href="https://www.instagram.com/potencializamkt_?igsh=cTV5Y2llY2ltZTdp" target="_blank" rel="noreferrer">
                📸 Instagram
              </a>
            </li>
            <li>
              <button type="button" className="footer__contact-button" onClick={onOpenContact}>
                🟢 WhatsApp
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer__bar">© {new Date().getFullYear()} Potencializa. Todos os direitos reservados.</div>
    </footer>
  );
}

export default Footer;
