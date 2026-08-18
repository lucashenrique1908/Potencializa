import "./Authority.css";

const pillars = [
	"Estratégia centrada em resultados",
	"Conteúdo que comunica valor e confiança",
	"Produção visual com alto impacto percebido",
	"Sistema de relacionamento e presença contínua",
];

function Authority() {
	return (
		<section className="authority" id="autoridade" aria-labelledby="autoridade-title">
			<div className="container authority__wrapper">
				<div className="section-heading">
					<span className="section-kicker">Autoridade</span>
					<h2 id="autoridade-title">A marca certa comunica valor antes mesmo de vender.</h2>
				</div>

				<div className="authority__content scroll-highlight">
					<div className="authority__copy">
						<p>
							A Potencializa ajuda empresas a se posicionarem com clareza, consistência e presença premium no mercado.
						</p>
						<p>
							Quando a narrativa da marca está forte, o cliente sente confiança antes mesmo de conversar. E isso muda a forma como a oferta é percebida e convertida.
						</p>
					</div>

					<ul className="authority__list">
						{pillars.map((item) => (
							<li key={item}>{item}</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
}

export default Authority;
