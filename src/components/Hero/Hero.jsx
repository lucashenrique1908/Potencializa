import "./Hero.css";
import { openWhatsAppLink } from "../../utils/whatsapp.js";

const quickAccessCards = [
	{ label: "Produção de Vídeos", href: "#como-funciona" },
	{ label: "Storymaker", href: "#storymaker" },
	{ label: "Agência Completa", href: "#ecossistema" },
];

function Hero() {
	const handleWhatsAppClick = () => {
		openWhatsAppLink({
			message: "Olá, quero saber mais sobre a produção audiovisual da Potencializa.",
			context: "Hero CTA",
		});
	};

	return (
		<section className="hero" id="home" aria-label="Apresentação principal">
			<div className="container hero__inner">
				<div className="hero__copy">
					<p className="hero__eyebrow">Produção audiovisual que vende</p>
					<h1 className="hero__headline">
						Muita estratégia.
						<span className="hero__headline--strong">Muito vídeo. Resultado real.</span>
					</h1>
					<p className="hero__lead">
						A Potencializa transforma ideias em vídeos que conectam marca, geram autoridade e movem pessoas a agir.
					</p>
					<p className="hero__description">
						Planejamento, gravação, edição e entrega em uma estrutura pensada para marcas que querem presença premium e conteúdo que converte.
					</p>

					<div className="hero__actions">
						<a className="btn btn--primary hero__action" href="#plans">
							Ver planos
						</a>
						<button type="button" className="btn btn--ghost hero__action" onClick={handleWhatsAppClick}>
							Falar no WhatsApp
						</button>
					</div>
				</div>

				<aside className="hero__visual" aria-label="Video Short Lead (placeholder)">
					<div className="hero__video-card" role="img" aria-label="Placeholder do VSL da fundadora">
						<div className="hero__video-placeholder">
							<div className="hero__play-button" aria-hidden="true">
								▶
							</div>
						</div>
						<div className="hero__video-meta">
							<span className="hero__video-tag">VSL</span>
							<p>Vídeo da fundadora em preparação</p>
						</div>
					</div>
				</aside>
			</div>

			<div className="container hero__quick-access" aria-label="Acesso rápido">
				{quickAccessCards.map((item) => (
					<a key={item.label} href={item.href} className="hero__quick-card">
						<span>{item.label}</span>
					</a>
				))}
			</div>
		</section>
	);
}

export default Hero;
