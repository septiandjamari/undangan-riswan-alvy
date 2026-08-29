export default function DotNav({ total, activeIndex, onDotClick }) {
  return (
    <nav className="dot-nav" aria-label="Navigasi halaman">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          className={`dot${activeIndex === i ? " is-active" : ""}`}
          onClick={() => onDotClick(i)}
          aria-label={`Buka halaman ${i + 1}`}
        />
      ))}
    </nav>
  );
}
