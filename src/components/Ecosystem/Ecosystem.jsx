import "./Ecosystem.css";

const items = [
	"Estratégia",
	"Roteiro",
	"Produção",
	"Edição",
	"Distribuição",
	"Resultados",
];

function Ecosystem() {
	return (
		<section className="ecosystem" id="ecossistema" aria-labelledby="ecossistema-title">
			<div className="container ecosystem__wrapper">
				<div className="section-heading">
					<span className="section-kicker">Ecossistema</span>
					<h2 id="ecossistema-title">Um sistema pensado para levar a marca de forma integrada e consistente.</h2>
				</div>

				<div className="ecosystem__grid">
					{items.map((item) => (
						<div key={item} className="ecosystem__item scroll-highlight">
							<span>{item}</span>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

export default Ecosystem;
