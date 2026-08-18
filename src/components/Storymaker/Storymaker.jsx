import "./Storymaker.css";

const steps = [
	{
		label: "01",
		title: "Diagnóstico da marca",
		text: "Entendemos seu posicionamento, público, diferenciais e desejos de mercado antes de criar qualquer conteúdo.",
	},
	{
		label: "02",
		title: "Narrativa e roteiro",
		text: "Transformamos sua essência em uma história clara, emocional e persuasiva, com foco em conversão.",
	},
	{
		label: "03",
		title: "Produção premium",
		text: "Capturamos imagens, direção, áudio e linguagem visual com qualidade que eleva a percepção da marca.",
	},
	{
		label: "04",
		title: "Entrega e performance",
		text: "A entrega final acompanha a estratégia de distribuição, para que o conteúdo gere presença e resultados reais.",
	},
];

function Storymaker() {
	return (
		<section className="storymaker" id="storymaker" aria-labelledby="storymaker-title">
			<div className="container storymaker__wrapper">
				<div className="section-heading">
					<span className="section-kicker">Storymaker</span>
					<h2 id="storymaker-title">Uma mensagem que vira narrativa e leva a marca a ser lembrada.</h2>
				</div>

				<div className="storymaker__grid">
					{steps.map((step) => (
						<article key={step.label} className="storymaker__card scroll-highlight">
							<span className="storymaker__label">{step.label}</span>
							<h3>{step.title}</h3>
							<p>{step.text}</p>
						</article>
					))}
				</div>
			</div>
		</section>
	);
}

export default Storymaker;
