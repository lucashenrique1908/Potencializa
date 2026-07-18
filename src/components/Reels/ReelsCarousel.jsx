import { useEffect, useRef, useState } from "react";
import "./ReelsCarousel.css";

// Substitua este array por `instagramReels` quando a integração estiver pronta.
const reels = [
  { id: 1, video: "/reels/reel1.mp4", thumbnail: "/reels/reel1.jpg", title: "Reel 1" },
  { id: 2, video: "/reels/reel2.mp4", thumbnail: "/reels/reel2.jpg", title: "Reel 2" },
  { id: 3, video: "/reels/reel3.mp4", thumbnail: "/reels/reel3.jpg", title: "Reel 3" },
  { id: 4, video: "/reels/reel4.mp4", thumbnail: "/reels/reel4.jpg", title: "Reel 4" },
  { id: 5, video: "/reels/reel5.mp4", thumbnail: "/reels/reel5.jpg", title: "Reel 5" },
];

export default function ReelsCarousel() {
  const trackRef = useRef(null);
  const dragStart = useRef({ x: 0, scrollLeft: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(0);

  const updateFocusedReel = () => {
    const track = trackRef.current;
    if (!track) return;

    const trackCenter = track.getBoundingClientRect().left + track.clientWidth / 2;
    const cards = Array.from(track.querySelectorAll(".reels-carousel-card"));
    const nearestCard = cards.reduce((closest, card, index) => {
      const bounds = card.getBoundingClientRect();
      const distance = Math.abs(bounds.left + bounds.width / 2 - trackCenter);
      return !closest || distance < closest.distance ? { index, distance } : closest;
    }, null);

    if (nearestCard) setFocusedIndex(nearestCard.index);
  };

  useEffect(() => {
    updateFocusedReel();
    window.addEventListener("resize", updateFocusedReel);
    return () => window.removeEventListener("resize", updateFocusedReel);
  }, []);

  const handlePointerDown = (event) => {
    if (event.pointerType === "touch") return;
    const track = trackRef.current;
    if (!track) return;

    dragStart.current = { x: event.clientX, scrollLeft: track.scrollLeft };
    track.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handlePointerMove = (event) => {
    if (!isDragging || !trackRef.current) return;
    trackRef.current.scrollLeft = dragStart.current.scrollLeft - (event.clientX - dragStart.current.x);
  };

  const stopDragging = (event) => {
    const track = trackRef.current;
    if (!isDragging || !track) return;

    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    setIsDragging(false);
  };

  // Para ativar autoplay futuramente, avance o track em um intervalo desejado.
  // useEffect(() => { const timer = setInterval(() => trackRef.current?.scrollBy({ left: 280, behavior: "smooth" }), 4500); return () => clearInterval(timer); }, []);

  return (
    <div className="reels-carousel" aria-label="Últimos Reels">
      <div
        className={`reels-carousel-track${isDragging ? " is-dragging" : ""}`}
        ref={trackRef}
        role="list"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onScroll={updateFocusedReel}
      >
        {reels.map((reel, index) => (
          <article
            className={`reels-carousel-card${index === focusedIndex ? " is-focused" : ""}`}
            key={reel.id}
            role="listitem"
            aria-current={index === focusedIndex ? "true" : undefined}
          >
            <video
              className="reels-carousel-video"
              src={reel.video}
              poster={reel.thumbnail}
              muted
              playsInline
              preload="metadata"
              aria-label={reel.title}
            />
            <div className="reels-carousel-overlay" aria-hidden="true" />
            <span className="reels-carousel-play" aria-label={`Reproduzir ${reel.title}`}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8.5 5.5v13l10-6.5-10-6.5Z" fill="currentColor" /></svg>
            </span>
            <span className="reels-carousel-label">{reel.title}</span>
          </article>
        ))}
      </div>
    </div>
  );
}
