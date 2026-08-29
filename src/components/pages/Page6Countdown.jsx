import { useCountdown } from "../../hooks/useCountdown";

const WEDDING_DATE = "2026-09-06T00:00:00+07:00";

function Box({ num, label }) {
  return (
    <div className="countdown-box">
      <span className="countdown-num">{num}</span>
      <span className="meta countdown-label">{label}</span>
    </div>
  );
}

export default function Page6Countdown() {
  const { days, hours, minutes, seconds } = useCountdown(WEDDING_DATE);

  return (
    <article className="canvas canvas--six">
      <div className="countdown-block">
        <p className="script countdown-title">Menghitung Hari</p>
        <br />
        <br />
        <div className="countdown-grid">
          <Box num={days}    label="Hari" />
          <Box num={hours}   label="Jam" />
          <Box num={minutes} label="Menit" />
          <Box num={seconds} label="Detik" />
        </div>
      </div>
    </article>
  );
}
