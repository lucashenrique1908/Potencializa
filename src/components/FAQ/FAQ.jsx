import "./FAQ.css";

const items = [
	{
		question: "Qual a primeira etapa para começar?",
		answer: "A primeira etapa é um diagnóstico inicial com foco em posicionamento, objetivos e oportunidades de conteúdo para a sua marca.",
	},
	{
		question: "A Potencializa trabalha com marcas de diferentes segmentos?",
		answer: "Sim. A estrutura é adaptável para negócios com diferentes públicos, níveis de maturidade e canais de aquisição.",
	},
	{
		question: "Preciso ter roteiro pronto para começar?",
		answer: "Não. A produção pode começar com uma conversa estratégica, e a narrativa pode ser construída junto com a equipe.",
	},
	{
		question: "Vocês também cuidam da parte de gestão e performance?",
		answer: "Sim. A operação pode incluir estratégia de conteúdo, produção e acompanhamento de resultados em canal e performance.",
	},
	{
		question: "Como funciona a entrega do material?",
		answer: "Tudo é entregue em um fluxo organizado, com revisão, ajustes finais e suporte para distribuição do conteúdo produzido.",
	},
];

function FAQ() {
	return (
		<section className="faq" id="faq" aria-labelledby="faq-title">
			<div className="container">
				<div className="section-heading">
					<span className="section-kicker">FAQ</span>
					<h2 id="faq-title">Perguntas frequentes para orientar sua próxima etapa.</h2>
				</div>

				<div className="faq__list">
					{items.map((item) => (
						<div key={item.question} className="faq__item scroll-highlight">
							<h3>{item.question}</h3>
							<p>{item.answer}</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default FAQ;
