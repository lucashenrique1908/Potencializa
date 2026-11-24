import ScreenshotsCarousel from "./ScreenshotsCarousel.jsx";
import "./SocialProof.css";
import ReelsCarousel from "../Reels/ReelsCarousel.jsx";
import { mediaCatalog } from "../../data/media.js";

function SocialProof() {
	const reels = mediaCatalog.reels.items;
	const testimonialReels = mediaCatalog.testimonials.items;
	const screenshots = Object.entries(import.meta.glob("../../assets/Screenshots/*.jpg", {
		eager: true,
		import: "default",
	})).sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
		.map(([path, src], index) => ({
			id: path,
			src,
			label: `Print de conversa no WhatsApp ${index + 1}`,
		}));


	return (
		<section className="social-proof" id="prova-social" aria-labelledby="prova-social-title">
			<div className="container social-proof__container">
				<div className="section-heading">
					<span className="section-kicker">Prova social</span>
					<h2 id="prova-social-title">Trabalho real, marca forte e conteúdo que sustenta a percepção de valor.</h2>
				</div>

				<div className="social-proof__group">
					<div className="social-proof__panel social-proof__panel--reels">
						<h3>Portfólio de vídeos</h3>
						<ReelsCarousel reels={reels} />
					</div>

					<div className="social-proof__panel social-proof__panel--screenshots">
						<h3>Prints de WhatsApp</h3>
						<ScreenshotsCarousel screenshots={screenshots} />
					</div>

					<div className="social-proof__panel social-proof__panel--reels social-proof__panel--testimonials">
						<h3>Depoimentos em vídeo</h3>
						<ReelsCarousel reels={testimonialReels} />
					</div>
				</div>
			</div>
		</section>
	);
}

export default SocialProof;
