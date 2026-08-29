export default function Page4Akad() {
  return (
    <article className="canvas canvas--four">
      <div className="akad-block">
        <p className="script akad-title">
          Akad Nikah & Resepsi
        </p>
        <br />

        <p className="meta akad-location-label">Akad Nikah</p>
        <div className="date-row">
          <p className="meta date-day">Senin</p>
          <div className="date-vline" aria-hidden="true" />
          <div>
            <p className="date-num">07</p>
            <p className="meta date-year">2026</p>
          </div>
          <div className="date-vline" aria-hidden="true" />
          <p className="meta date-month">September</p>
        </div>

        <p className="meta akad-location-label">Resepsi</p>
        <div className="date-row">
          <p className="meta date-day">Minggu<br />Senin</p>
          <div className="date-vline" aria-hidden="true" />
          <div>
            <p className="date-num" style={{ fontSize: "calc(clamp(40px,5.4vh,72px) * 0.9)" }}>06–07</p>
            <p className="meta date-year">2026</p>
          </div>
          <div className="date-vline" aria-hidden="true" />
          <p className="meta date-month">September</p>
        </div>

        <p className="meta akad-location-label">Lokasi Acara</p>
        <p className="meta akad-venue">Kediaman Keluarga</p>
        <p className="meta akad-address">Jln. Moh Yamin Rt.13 Rw.04,<br />Codo, Wajak</p>
      </div>
    </article>
  );
}
