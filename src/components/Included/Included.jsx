import "./Included.css";

const included = [
	{
		id: "scripts",
		title: "Roteiros",
		description: "Estrutura narrativa pensada para entregar mensagem clara e impacto no primeiro segundo.",
		icon: "✎",
	},
	{
		id: "direction",
		title: "Direção",
		description: "Orientação de cena e condução do conteúdo para manter a gravação segura e profissional.",
		icon: "◎",
	},
	{
		id: "captions",
		title: "Legendas",
		description: "Acesso e compreensão aumentados para diferentes contextos de consumo e audiência.",
		icon: "CC",
	},
	{
		id: "audio-visual",
		title: "Som e imagem",
		description: "Qualidade técnica para que o vídeo tenha presença, clareza e aparência premium.",
		icon: "◉",
	},
	{
		id: "b-roll",
		title: "B-roll",
		description: "Materiais complementares para reforçar a narrativa e deixar a edição mais dinâmica.",
		icon: "▣",
	},
	{
		id: "support",
		title: "Atendimento",
		description: "Acompanhamento prático e estruturado para organizar cada etapa do processo com agilidade.",
		icon: "✦",
	},
];

function Included() {
	return (
		<section className="included" id="incluido" aria-labelledby="incluido-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">O que está incluído</span>
					<h2 id="incluido-title">Tudo o que uma produção de vídeo precisa para sair forte.</h2>
				</div>

				<ul className="included__list">
					{included.map((item) => (
						<li key={item.id} className="included__item scroll-highlight">
							<div className="included__icon" aria-hidden="true">{item.icon}</div>
							<div>
								<h3>{item.title}</h3>
								<p>{item.description}</p>
							</div>
						</li>
					))}
				</ul>
			</div>
		</section>
	);
}

export default Included;
