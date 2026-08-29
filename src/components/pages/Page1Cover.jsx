import { useGuest } from "../../GuestContext";

export default function Page1Cover({ onOpen, ready = true }) {
  const guest = useGuest();

  return (
    <article className={`canvas canvas--one${ready ? " is-revealed" : ""}`}>
      {/* Background center page 1 — layer paling bawah */}
      <img src="/assets/background center page1.svg" className="page-bg-center" alt="" aria-hidden="true" />

      {/* 10.svg sebagai bingkai + dekorasi, di belakang semua konten */}
      <img src="/assets/10.svg" className="cover-bg" alt="" aria-hidden="true" />

      {/* Ornamen bunga di sudut-sudut */}
      <img src="/assets/pojok kiri atas halaman 1.svg"   className="corner corner--tl" alt="" aria-hidden="true" />
      <img src="/assets/pojok kanan atas halaman 1.svg"  className="corner corner--tr" alt="" aria-hidden="true" />
      <img src="/assets/pojok kiri bawah halaman 1.svg"  className="corner corner--bl" alt="" aria-hidden="true" />
      <img src="/assets/pojok kanan bawah halaman 1.svg" className="corner corner--br" alt="" aria-hidden="true" />

      {/* Konten di dalam area arch bingkai */}
      <div className="cover-content">
        <img src="/assets/2.svg" width={100} height={100} alt="" style={{ marginBottom: -48 }} />
        <p className="meta" style={{ letterSpacing: "0.22em" }}>
          Undangan Pernikahan<br />Dari:
        </p>

        <div className="cover">
          <p className="script cover-script">
            <span>Riswanda</span><br />
            <span>Alvy</span>
          </p>

          <div className="cover-guest">
            <p className="meta" style={{ letterSpacing: "0.14em" }}>Kepada Yth:</p>
            <p className="meta" style={{ letterSpacing: "0.14em" }}>Bapak/Ibu/Saudara/i</p>
            {guest?.nama ? <p className="meta guest-name">{guest?.nama}</p> : <p>
            <br />  
            </p>}
            <p className="meta" style={{ letterSpacing: "0.14em" }}>Di Tempat</p>
          </div>

          <button className="btn-gold" onClick={onOpen}>
            Buka Undangan
          </button>
        </div>
      </div>
    </article>
  );
}
