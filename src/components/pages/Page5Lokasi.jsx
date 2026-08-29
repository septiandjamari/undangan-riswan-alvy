export default function Page5Lokasi() {
  return (
    <article className="canvas canvas--five">
      <div className="lokasi-block">
        <div className="map-frame">
          <iframe
            src="https://maps.google.com/maps?q=Jln.+Moh+Yamin+Rt.13+Rw.04,+Codo,+Wajak,+Malang&output=embed"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Lokasi Akad Nikah"
          />
        </div>

        <p className="meta lokasi-venue">Kediaman Keluarga</p>
        <p className="meta lokasi-address">Jln. Moh Yamin Rt.13 Rw.04,<br />Codo, Wajak</p>

        <a
          className="btn-outline"
          href="https://www.google.com/maps/search/?api=1&query=Jln.+Moh+Yamin+Rt.13+Rw.04%2C+Codo%2C+Wajak%2C+Malang"
          target="_blank"
          rel="noopener noreferrer"
        >
          Petunjuk Ke Lokasi
        </a>
      </div>
    </article>
  );
}
