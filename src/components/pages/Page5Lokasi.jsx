export default function Page5Lokasi() {
  return (
    <article className="canvas canvas--five">
      <div className="lokasi-block">
        <div className="map-frame">
          <iframe
            src="https://maps.google.com/maps?q=-8.1286393,112.7224661&z=17&output=embed"
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
          href="https://www.google.com/maps/place/Sayur+segar+bu+siti+(Codo)/@-8.1286393,112.7224661,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd623b5dd895357:0x73023e2cab3a1a77!8m2!3d-8.1286393!4d112.7224661!16s%2Fg%2F11vy137n7q!18m1!1e1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Petunjuk Ke Lokasi
        </a>
      </div>
    </article>
  );
}
