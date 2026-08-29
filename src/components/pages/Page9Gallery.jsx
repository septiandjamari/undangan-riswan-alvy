import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

const PHOTOS = [
  { src: "/assets/gallery-1.jpg", alt: "Riswanda dan Alvy — momen 1" },
  { src: "/assets/gallery-2.jpg", alt: "Riswanda dan Alvy — momen 2" },
  { src: "/assets/gallery-3.jpg", alt: "Riswanda dan Alvy — momen 3" },
  { src: "/assets/gallery-4.jpg", alt: "Riswanda dan Alvy — momen 4" },
];

function IconArrow({ direction }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      {direction === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}

function Lightbox({ index, onClose, onPrev, onNext }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape")    onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, onPrev, onNext]);

  const photo = PHOTOS[index];

  return createPortal(
    <div className="lightbox-overlay" onClick={onClose}>
      <button className="lightbox-close" onClick={onClose} aria-label="Tutup">✕</button>

      <button
        className="lightbox-arrow lightbox-arrow--left"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        aria-label="Foto sebelumnya"
      >
        <IconArrow direction="left" />
      </button>

      <img
        src={photo.src}
        alt={photo.alt}
        className="lightbox-image"
        onClick={(e) => e.stopPropagation()}
      />

      <button
        className="lightbox-arrow lightbox-arrow--right"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        aria-label="Foto berikutnya"
      >
        <IconArrow direction="right" />
      </button>

      <p className="lightbox-counter">{index + 1} / {PHOTOS.length}</p>
    </div>,
    document.body
  );
}

export default function Page9Gallery({ onLightboxChange }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    onLightboxChange?.(openIndex !== null);
  }, [openIndex, onLightboxChange]);

  const close = useCallback(() => setOpenIndex(null), []);
  const prev  = useCallback(() => setOpenIndex((i) => (i - 1 + PHOTOS.length) % PHOTOS.length), []);
  const next  = useCallback(() => setOpenIndex((i) => (i + 1) % PHOTOS.length), []);

  return (
    <article className="canvas canvas--ten">
      <div className="gallery-grid">
        {PHOTOS.map((p, i) => (
          <img
            key={p.src}
            src={p.src}
            alt={p.alt}
            className="gallery-photo"
            loading="lazy"
            onClick={() => setOpenIndex(i)}
          />
        ))}
      </div>

      {openIndex !== null && (
        <Lightbox index={openIndex} onClose={close} onPrev={prev} onNext={next} />
      )}
    </article>
  );
}
