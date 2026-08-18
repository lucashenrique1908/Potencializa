import "./Benefits.css";

const benefits = [
	{
		id: "creative-block",
		title: "Fim do bloqueio criativo",
		text: "Você não precisa começar do zero. A Potencializa orienta a ideia, o roteiro e a direção para transformar sua mensagem em conteúdo com clareza e impacto.",
		icon: "✦",
	},
	{
		id: "no-stress",
		title: "Gravação sem stress",
		text: "Com uma estrutura simples e profissional, a produção é organizada para que você apareça com naturalidade, sem perder tempo nem energia.",
		icon: "◎",
	},
	{
		id: "quality-sells",
		title: "Qualidade que vende",
		text: "Vídeos bem produzidos não só parecem premium: eles geram confiança, atraem atenção e aumentam a percepção de valor da sua marca.",
		icon: "▣",
	},
];

function Benefits() {
	return (
		<section className="benefits" id="beneficios" aria-labelledby="beneficios-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">Benefícios</span>
					<h2 id="beneficios-title">Mais clareza. Mais presença. Mais resultado.</h2>
				</div>

				<div className="benefits__grid">
					{benefits.map((benefit) => (
						<article key={benefit.id} className="benefit-card scroll-highlight">
							<div className="benefit-card__icon" aria-hidden="true">{benefit.icon}</div>
							<h3>{benefit.title}</h3>
							<p>{benefit.text}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default Benefits;
