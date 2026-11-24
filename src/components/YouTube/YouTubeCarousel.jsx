import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext.jsx";
import "./YouTubeCarousel.css";

function PlayIcon() {
	return (
		<svg viewBox="0 0 24 24" aria-hidden="true">
			<path d="M8.5 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />
		</svg>
	);
}

function getFocusPosition(card) {
	const rect = card.getBoundingClientRect();
	const minimumVisibleHeight = Math.min(360, window.innerHeight - 16);
	const maxTop = Math.max(8, window.innerHeight - minimumVisibleHeight);
	const top = Math.max(8, Math.min(rect.top, maxTop));
	const left = Math.max(8, Math.min(rect.left, window.innerWidth - rect.width - 8));
	const maxHeight = Math.max(180, window.innerHeight - top - 16);

	return {
		top,
		left,
		width: rect.width,
		maxHeight,
		contentMaxHeight: Math.max(120, maxHeight - (rect.width * 9) / 16 - 2),
	};
}

function YouTubeCard({
	video,
	index,
	t,
	canExpand,
	isFocused = false,
	onOpenVideo,
	onToggleDescription,
	cardRef,
	descriptionRef,
}) {
	return (
		<article
			className={`youtube-card${isFocused ? " youtube-card--focused" : ""}`}
			ref={cardRef}
			role={isFocused ? undefined : "listitem"}
		>
			<button
				className={`youtube-card__thumbnail${video.thumbnail ? " has-thumbnail" : ""}`}
				type="button"
				onClick={onOpenVideo}
				aria-label={`${t("Abrir vídeo")}: ${t(video.title)}`}
			>
				{video.thumbnail ? (
					<img src={video.thumbnail} alt="" loading="lazy" />
				) : (
					<span className={`youtube-card__placeholder youtube-card__placeholder--${(index % 5) + 1}`} aria-hidden="true" />
				)}
				<span className="youtube-card__play"><PlayIcon /></span>
			</button>
			<div className={`youtube-card__content${isFocused ? " youtube-card__content--focused" : ""}`}>
				<h3 id={isFocused ? "youtube-description-dialog-title" : undefined} className="youtube-card__title">
					{t(video.title)}
				</h3>
				{video.description ? (
					<p
						className={`youtube-card__description${isFocused ? " youtube-card__description--expanded" : ""}`}
						ref={descriptionRef}
					>
						{t(video.description)}
					</p>
				) : null}
				{canExpand && (
					<button
						className="youtube-card__description-toggle"
						type="button"
						aria-expanded={isFocused}
						aria-haspopup={isFocused ? undefined : "dialog"}
						onClick={onToggleDescription}
					>
						{t(isFocused ? "Ver Menos" : "Ver Mais...")}
					</button>
				)}
			</div>
		</article>
	);
}

export default function YouTubeCarousel({ videos }) {
	const { t } = useLanguage();
	const trackRef = useRef(null);
	const dialogRef = useRef(null);
	const descriptionDialogRef = useRef(null);
	const dragRef = useRef(null);
	const suppressClickRef = useRef(false);
	const descriptionRefs = useRef(new Map());
	const cardRefs = useRef(new Map());
	const [isDragging, setIsDragging] = useState(false);
	const [selectedVideo, setSelectedVideo] = useState(null);
	const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
	const [focusedDescription, setFocusedDescription] = useState(null);
	const [truncatedDescriptions, setTruncatedDescriptions] = useState(() => new Set());
	const focusedDescriptionId = focusedDescription?.video.id;

	useEffect(() => {
		const dialog = dialogRef.current;
		if (selectedVideo && dialog && !dialog.open) dialog.showModal();
	}, [selectedVideo]);

	useLayoutEffect(() => {
		const dialog = descriptionDialogRef.current;
		if (focusedDescription && dialog && !dialog.open) dialog.showModal();
	}, [focusedDescription]);

	useEffect(() => {
		if (!focusedDescriptionId) return undefined;

		const updatePosition = () => {
			const card = cardRefs.current.get(focusedDescriptionId);
			if (!card) return;

			const position = getFocusPosition(card);
			setFocusedDescription((current) => {
				if (!current || current.video.id !== focusedDescriptionId) return current;
				if (Object.keys(position).every((key) => (
					Math.abs(current.position[key] - position[key]) < 0.5
				))) {
					return current;
				}
				return { ...current, position };
			});
		};

		window.addEventListener("resize", updatePosition);
		window.visualViewport?.addEventListener("resize", updatePosition);
		return () => {
			window.removeEventListener("resize", updatePosition);
			window.visualViewport?.removeEventListener("resize", updatePosition);
		};
	}, [focusedDescriptionId]);

	useLayoutEffect(() => {
		const measureDescriptions = () => {
			setTruncatedDescriptions((current) => {
				const next = new Set();

				for (const video of videos) {
					const description = descriptionRefs.current.get(video.id);
					if (!description) continue;

					if (description.scrollHeight > description.clientHeight + 1) {
						next.add(video.id);
					}
				}

				if (
					next.size === current.size
					&& [...next].every((videoId) => current.has(videoId))
				) {
					return current;
				}
				return next;
			});
		};

		measureDescriptions();
		const observer = new ResizeObserver(measureDescriptions);
		if (trackRef.current) observer.observe(trackRef.current);
		descriptionRefs.current.forEach((description) => observer.observe(description));

		return () => observer.disconnect();
	}, [videos]);

	const scrollByCard = (direction) => {
		const track = trackRef.current;
		const card = track?.querySelector(".youtube-card");
		if (!track || !card) return;

		const gap = Number.parseFloat(window.getComputedStyle(track).columnGap) || 0;
		const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		track.scrollBy({
			left: direction * (card.getBoundingClientRect().width + gap),
			behavior: reduceMotion ? "auto" : "smooth",
		});
	};

	const startDrag = (event) => {
		if (event.pointerType !== "mouse" || event.button !== 0) return;
		dragRef.current = {
			pointerId: event.pointerId,
			startX: event.clientX,
			scrollLeft: trackRef.current.scrollLeft,
			moved: false,
		};
	};

	const moveDrag = (event) => {
		const drag = dragRef.current;
		const track = trackRef.current;
		if (!drag || !track || event.pointerType !== "mouse") return;

		const distance = event.clientX - drag.startX;
		if (Math.abs(distance) < 6 && !drag.moved) return;

		if (!drag.moved) {
			drag.moved = true;
			track.setPointerCapture(event.pointerId);
			setIsDragging(true);
		}
		track.scrollLeft = drag.scrollLeft - distance;
	};

	const endDrag = (event) => {
		const track = trackRef.current;
		const drag = dragRef.current;
		if (!drag) return;

		if (track?.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
		if (drag.moved) {
			suppressClickRef.current = true;
			window.setTimeout(() => { suppressClickRef.current = false; }, 0);
		}
		dragRef.current = null;
		setIsDragging(false);
	};

	const closeDialog = () => {
		if (dialogRef.current?.open) dialogRef.current.close();
		setSelectedVideo(null);
		setIsPlayerExpanded(false);
	};

	const openDescription = (video, index) => {
		const card = cardRefs.current.get(video.id);
		if (!card) return;

		setFocusedDescription({
			video,
			index,
			position: getFocusPosition(card),
		});
	};

	const closeDescription = () => {
		if (descriptionDialogRef.current?.open) descriptionDialogRef.current.close();
		setFocusedDescription(null);
	};

	return (
		<div className="youtube-carousel" role="region" aria-label={t("Vídeos do YouTube")}>
			<p className="youtube-carousel__hint" id="youtube-carousel-instructions">
				{t("Deslize ou use as teclas de seta para explorar os vídeos.")}
			</p>
			<div
				className={`youtube-carousel__track${isDragging ? " is-dragging" : ""}`}
				ref={trackRef}
				role="list"
				tabIndex="0"
				aria-label={t("Vídeos do YouTube")}
				aria-describedby="youtube-carousel-instructions"
				onPointerDown={startDrag}
				onPointerMove={moveDrag}
				onPointerUp={endDrag}
				onPointerCancel={endDrag}
				onLostPointerCapture={() => { dragRef.current = null; setIsDragging(false); }}
				onClickCapture={(event) => {
					if (suppressClickRef.current) {
						event.preventDefault();
						event.stopPropagation();
						suppressClickRef.current = false;
					}
				}}
				onKeyDown={(event) => {
					if (event.key === "ArrowLeft") {
						event.preventDefault();
						scrollByCard(-1);
					} else if (event.key === "ArrowRight") {
						event.preventDefault();
						scrollByCard(1);
					}
				}}
			>
				{videos.map((video, index) => (
					<YouTubeCard
						key={video.id}
						video={video}
						index={index}
						t={t}
						canExpand={truncatedDescriptions.has(video.id)}
						onOpenVideo={() => setSelectedVideo(video)}
						onToggleDescription={() => openDescription(video, index)}
						cardRef={(element) => {
							if (element) cardRefs.current.set(video.id, element);
							else cardRefs.current.delete(video.id);
						}}
						descriptionRef={(element) => {
							if (element) descriptionRefs.current.set(video.id, element);
							else descriptionRefs.current.delete(video.id);
						}}
					/>
				))}
			</div>

			<dialog
				className="youtube-description-dialog"
				ref={descriptionDialogRef}
				style={focusedDescription ? {
					"--youtube-focus-top": `${focusedDescription.position.top}px`,
					"--youtube-focus-left": `${focusedDescription.position.left}px`,
					"--youtube-focus-width": `${focusedDescription.position.width}px`,
					"--youtube-focus-max-height": `${focusedDescription.position.maxHeight}px`,
					"--youtube-focus-content-max-height": `${focusedDescription.position.contentMaxHeight}px`,
				} : undefined}
				aria-labelledby="youtube-description-dialog-title"
				onCancel={(event) => {
					event.preventDefault();
					closeDescription();
				}}
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						event.preventDefault();
						closeDescription();
					}
				}}
				onClose={() => setFocusedDescription(null)}
				onClick={(event) => {
					if (event.target === event.currentTarget) closeDescription();
				}}
			>
				{focusedDescription && (
					<YouTubeCard
						video={focusedDescription.video}
						index={focusedDescription.index}
						t={t}
						canExpand
						isFocused
						onOpenVideo={() => setSelectedVideo(focusedDescription.video)}
						onToggleDescription={closeDescription}
					/>
				)}
			</dialog>

			<dialog
				className={`youtube-player-dialog${isPlayerExpanded ? " is-expanded" : ""}`}
				ref={dialogRef}
				aria-labelledby="youtube-dialog-title"
				onCancel={(event) => {
					event.preventDefault();
					closeDialog();
				}}
				onKeyDown={(event) => {
					if (event.key === "Escape") {
						event.preventDefault();
						closeDialog();
					}
				}}
				onClose={() => {
					setSelectedVideo(null);
					setIsPlayerExpanded(false);
				}}
				onClick={(event) => {
					if (event.target === event.currentTarget) closeDialog();
				}}
			>
				{selectedVideo && (
					<div className="youtube-player-dialog__content">
						<div className="youtube-player-dialog__header">
							<h2 id="youtube-dialog-title">{t(selectedVideo.title)}</h2>
							<div className="youtube-player-dialog__actions">
								<button
									className="youtube-player-dialog__expand"
									type="button"
									aria-pressed={isPlayerExpanded}
									onClick={() => setIsPlayerExpanded((current) => !current)}
								>
									{t(isPlayerExpanded ? "Reduzir vídeo" : "Expandir vídeo")}
								</button>
								<button className="youtube-player-dialog__close" type="button" onClick={closeDialog} aria-label={t("Fechar vídeo")}>
									<span aria-hidden="true">×</span>
								</button>
							</div>
						</div>
						<div className="youtube-player-dialog__player">
							<iframe
								key={selectedVideo.videoId}
								src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(selectedVideo.videoId)}?autoplay=1&rel=0&playsinline=1`}
								title={t(selectedVideo.title)}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								referrerPolicy="strict-origin-when-cross-origin"
								allowFullScreen
							/>
						</div>
					</div>
				)}
			</dialog>
		</div>
	);
}
