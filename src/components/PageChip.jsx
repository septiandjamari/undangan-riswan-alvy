export default function PageChip({ current, total }) {
  return (
    <div
      className="page-chip"
      aria-live="polite"
      aria-label={`Halaman ${current} dari ${total}`}
    >
      <span>{current}</span>
      <span className="page-chip-sep">/</span>
      <span>{total}</span>
    </div>
  );
}
