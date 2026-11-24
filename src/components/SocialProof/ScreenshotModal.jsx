import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { pauseOtherVideos } from "../Reels/VideoModal.jsx";

export default function ScreenshotModal({ screenshot, onClose }) {
  const dialogRef = useRef(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    const body = document.body;
    const previousStyle = body.getAttribute("style");
    const scrollY = window.scrollY;
    pauseOtherVideos();
    Object.assign(body.style, { position: "fixed", top: `-${scrollY}px`, width: "100%", overflow: "hidden" });
    dialog.showModal();
    dialog.querySelector("button").focus();
    return () => {
      dialog.close();
      if (previousStyle === null) body.removeAttribute("style");
      else body.setAttribute("style", previousStyle);
      window.scrollTo({ top: scrollY, behavior: "instant" });
      previousFocus?.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="video-modal screenshot-modal"
      aria-modal="true"
      aria-label={screenshot.label}
      onCancel={event => { event.preventDefault(); onClose(); }}
      onClick={event => {
        if (event.target === event.currentTarget || event.target.classList.contains("screenshot-modal__content")) onClose();
      }}
    >
      <div className="video-modal__content screenshot-modal__content">
        <div className="video-modal__header">
          <button className="video-modal__close" type="button" aria-label="Fechar imagem" onClick={onClose}>{"\u00d7"}</button>
        </div>
        <img className="screenshot-modal__image" src={screenshot.src} alt={screenshot.label} />
      </div>
    </dialog>,
    document.body
  );
}
