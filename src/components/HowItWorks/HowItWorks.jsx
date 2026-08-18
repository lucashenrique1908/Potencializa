import "./HowItWorks.css";

const steps = [
	{
		id: "strategy",
		title: "Estratégia e roteiro",
		text: "Entendemos sua marca, definimos a mensagem e estruturamos o roteiro para dar direção ao conteúdo desde o início.",
	},
	{
		id: "recording",
		title: "Gravação",
		text: "Produzimos o material com organização, direção e fluidez para que a apresentação fique natural, clara e envolvente.",
	},
	{
		id: "editing",
		title: "Edição",
		text: "Selecionamos os melhores momentos, aplicamos estética, ritmo e refinamento para entregar uma peça com impacto visual.",
	},
	{
		id: "delivery",
		title: "Entrega",
		text: "Seu vídeo sai pronto para uso em campanhas, redes sociais, anúncios e materiais de comunicação de forma consistente.",
	},
];

function HowItWorks() {
	return (
		<section className="how-it-works" id="como-funciona" aria-labelledby="como-funciona-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">Como funciona</span>
					<h2 id="como-funciona-title">Planejamento, gravação, edição e entrega em um processo simples e profissional.</h2>
				</div>

				<div className="how-it-works__grid">
					{steps.map((step, index) => (
						<article key={step.id} className="how-step scroll-highlight">
							<div className="how-step__header">
								<span className="how-step__number">0{index + 1}</span>
								<span className="how-step__line" aria-hidden="true" />
							</div>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default HowItWorks;
