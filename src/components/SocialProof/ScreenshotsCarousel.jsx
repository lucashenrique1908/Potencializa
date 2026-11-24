import { useEffect, useLayoutEffect, useRef, useState } from "react";

import ScreenshotModal from "./ScreenshotModal.jsx";

export default function ScreenshotsCarousel({ screenshots }) {
  const trackRef = useRef(null);
  const hoveredRef = useRef(false);
  const focusWithinRef = useRef(false);
  const dragStart = useRef(null);
  const suppressClick = useRef(false);
  const count = screenshots.length;
  const slides = [...screenshots, ...screenshots, ...screenshots];
  const focusedRef = useRef(count + (count > 1 ? 1 : 0));
  const [focusedIndex, setFocusedIndex] = useState(count > 1 ? 1 : 0);
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState(null);

  const updateFocus = () => {
    const track = trackRef.current;
    if (!track) return;
    const center = track.getBoundingClientRect().left + track.clientWidth / 2;
    let nearest = 0;
    let distance = Infinity;
    [...track.children].forEach((card, index) => {
      const bounds = card.getBoundingClientRect();
      const nextDistance = Math.abs(bounds.left + bounds.width / 2 - center);
      if (nextDistance < distance) { nearest = index; distance = nextDistance; }
    });
    // Keep the visible sequence in the middle copy without changing the image
    // position. Adjust the drag origin too, so a held drag continues smoothly.
    if (count > 1 && (nearest < count || nearest >= count * 2)) {
      const cycleWidth = track.children[count].offsetLeft - track.children[0].offsetLeft;
      const shift = nearest < count ? cycleWidth : -cycleWidth;
      track.scrollTo({ left: track.scrollLeft + shift, behavior: "instant" });
      if (dragStart.current) dragStart.current.scrollLeft += shift;
      nearest += nearest < count ? count : -count;
    }
    focusedRef.current = nearest;
    setFocusedIndex(nearest % count);
  };

  useLayoutEffect(() => {
    const track = trackRef.current;
    const centerCard = () => {
      const card = track.children[focusedRef.current];
      if (!card) return;
      const bounds = card.getBoundingClientRect();
      track.scrollTo({ left: track.scrollLeft + bounds.left + bounds.width / 2 - track.getBoundingClientRect().left - track.clientWidth / 2, behavior: "instant" });
      updateFocus();
    };
    centerCard();
    const observer = new ResizeObserver(centerCard);
    observer.observe(track);
    return () => observer.disconnect();
  }, [screenshots.length]);

  useEffect(() => {
    if (count < 2 || expanded) return;
    let frame;
    let previousTime;
    let remainder = 0;
    const advance = (time) => {
      const elapsed = previousTime === undefined ? 0 : Math.min(time - previousTime, 50);
      previousTime = time;
      const track = trackRef.current;
      if (track && !document.hidden && !hoveredRef.current && !focusWithinRef.current && !dragStart.current) {
        remainder += elapsed * 0.12;
        const pixels = Math.floor(remainder);
        if (pixels > 0) {
          track.scrollTo({ left: track.scrollLeft + pixels, behavior: "instant" });
          remainder -= pixels;
        }
      }
      frame = requestAnimationFrame(advance);
    };
    frame = requestAnimationFrame(advance);
    return () => cancelAnimationFrame(frame);
  }, [count, expanded]);

  const stopDragging = (event) => {
    const track = trackRef.current;
    if (track.hasPointerCapture(event.pointerId)) track.releasePointerCapture(event.pointerId);
    if (event.type === "pointercancel") suppressClick.current = true;
    dragStart.current = null;
    setIsDragging(false);
  };

  return (
    <div
      className="social-proof__screenshots reels-carousel reels-carousel--interactive"
      aria-label="Galeria de prints de WhatsApp"
      onMouseEnter={() => { hoveredRef.current = true; }}
      onMouseLeave={() => { hoveredRef.current = false; }}
      onFocusCapture={() => { focusWithinRef.current = true; }}
      onBlurCapture={event => {
        if (!event.currentTarget.contains(event.relatedTarget)) focusWithinRef.current = false;
      }}
    >
      <div
        className={`social-proof__screenshots-track reels-carousel-track${isDragging ? " is-dragging" : ""}`}
        ref={trackRef}
        role="list"
        onScroll={updateFocus}
        onDragStart={event => event.preventDefault()}
        onPointerDown={event => {
          if (!event.isPrimary || event.button !== 0) return;
          suppressClick.current = false;
          dragStart.current = { x: event.clientX, y: event.clientY, scrollLeft: trackRef.current.scrollLeft };
        }}
        onPointerMove={event => {
          if (event.pointerType !== "touch" && event.buttons !== 1) {
            dragStart.current = null;
            setIsDragging(false);
            return;
          }
          const start = dragStart.current;
          if (!start) return;
          if (Math.hypot(event.clientX - start.x, event.clientY - start.y) > 8) {
            suppressClick.current = true;
            if (event.pointerType !== "touch") {
              trackRef.current.setPointerCapture(event.pointerId);
              setIsDragging(true);
              trackRef.current.scrollLeft = start.scrollLeft - (event.clientX - start.x);
            }
          }
        }}
        onPointerUp={stopDragging}
        onPointerCancel={stopDragging}
        onLostPointerCapture={() => { dragStart.current = null; setIsDragging(false); }}
        onClickCapture={event => {
          if (event.detail !== 0 && suppressClick.current) { event.preventDefault(); event.stopPropagation(); }
        }}
      >
        {slides.map((item, index) => (
          <article key={`${item.id}-${index}`} className={`social-proof__screenshot reels-carousel-card${index % count === focusedIndex ? " is-focused" : ""}`} role="listitem" aria-current={index % count === focusedIndex ? "true" : undefined}>
            <button type="button" className="social-proof__screenshot-open" onClick={() => setExpanded(item)} aria-label={`${item.label} - ampliar imagem`}>
              <img src={item.src} alt={item.label} loading="lazy" decoding="async" draggable="false" />
            </button>
          </article>
        ))}
      </div>
      {expanded && <ScreenshotModal screenshot={expanded} onClose={() => setExpanded(null)} />}
    </div>
  );
}
