import { useEffect, useState } from "react";
import YouTubeCarousel from "./YouTubeCarousel.jsx";
import { fetchYouTubeVideos, YOUTUBE_CHANNEL_URL } from "../../services/youtube.js";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./YouTube.css";

export default function YouTube() {
	const { t } = useLanguage();
	const [videos, setVideos] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [attempt, setAttempt] = useState(0);

	useEffect(() => {
		let isMounted = true;

		async function loadVideos() {
			try {
				const data = await fetchYouTubeVideos();
				if (isMounted) setVideos(data);
			} catch (loadError) {
				console.error("Erro ao carregar vídeos do YouTube:", loadError);
				if (isMounted) {
					setError(loadError instanceof Error
						? loadError.message
						: t("Não foi possível carregar os vídeos. Tente novamente mais tarde."));
				}
			} finally {
				if (isMounted) setLoading(false);
			}
		}

		loadVideos();
		return () => {
			isMounted = false;
		};
	}, [attempt, t]);

	const retry = () => {
		setLoading(true);
		setError("");
		setAttempt((current) => current + 1);
	};

	const hasChannelUrl = typeof YOUTUBE_CHANNEL_URL === "string"
		&& /^https:\/\/(www\.)?youtube\.com\//i.test(YOUTUBE_CHANNEL_URL);

	return (
		<section className="youtube-section" aria-labelledby="youtube-title">
			<div className="youtube-container">
				<header className="youtube-header">
					<h2 className="youtube-title" id="youtube-title">{t("Por dentro da Potencializa")}</h2>
					<p className="youtube-subtitle">
						{t("Bastidores, experiências e ideias que fazem acontecer.")}
					</p>
				</header>

				{loading ? (
					<div className="youtube-state" role="status" aria-live="polite">
						<span className="youtube-state__spinner" aria-hidden="true" />
						{t("Carregando vídeos...")}
					</div>
				) : error ? (
					<div className="youtube-state youtube-state--error" role="alert">
						<span>{error}</span>
						<button className="youtube-button" type="button" onClick={retry}>{t("Tentar novamente")}</button>
					</div>
				) : videos.length === 0 ? (
					<div className="youtube-state" role="status">{t("Ainda não há vídeos disponíveis.")}</div>
				) : (
					<YouTubeCarousel videos={videos} />
				)}

				{hasChannelUrl && (
					<div className="youtube-cta">
						<a className="youtube-button" href={YOUTUBE_CHANNEL_URL} target="_blank" rel="noopener noreferrer">
							<span className="youtube-button-icon" aria-hidden="true">
								<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
									<rect x="3" y="5" width="18" height="14" rx="4" stroke="currentColor" strokeWidth="1.5" />
									<path d="M10 9L15 12L10 15V9Z" fill="currentColor" />
								</svg>
							</span>
							{t("Ver mais vídeos no YouTube")}
						</a>
					</div>
				)}
			</div>
		</section>
	);
}
