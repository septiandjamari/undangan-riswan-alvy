import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/assets/pernikahan-kita.mp3";

function IconMelody() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
    </svg>
  );
}

function IconMelodyMuted() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 3v10.55A4 4 0 1 0 11 17V7h4V3H9z" />
      <line x1="3" y1="3" x2="21" y2="21" stroke="#e53935" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

export default function MusicPlayer({ hidden, pageReady, coverOpened, userInteracted }) {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.65;
    audio.loop   = true;
  }, []);

  const attemptAutoPlay = () => {
    const audio = audioRef.current;
    if (!audio || !audio.paused) return;
    audio.play().then(() => setPlaying(true)).catch(() => {});
  };

  // Coba autoplay begitu halaman selesai dimuat (berhasil di sebagian
  // browser/desktop). Kalau diblokir kebijakan autoplay, percobaan kedua
  // di bawah (saat tombol "Buka Undangan" diklik) yang jadi andalan utama,
  // karena itu klik sungguhan dari pengguna.
  useEffect(() => {
    if (pageReady) attemptAutoPlay();
  }, [pageReady]);

  useEffect(() => {
    if (coverOpened) attemptAutoPlay();
  }, [coverOpened]);

  // Interaksi apa pun di halaman (tap/scroll/keydown) — bukan cuma klik
  // tombol "Buka Undangan" — dianggap gesture valid untuk mulai memutar.
  useEffect(() => {
    if (userInteracted) attemptAutoPlay();
  }, [userInteracted]);

  const toggle = () => {
    const audio = audioRef.current;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
    setPlaying(!playing);
  };

  return (
    <>
      <audio ref={audioRef} src={AUDIO_SRC} preload="auto" />
      {!hidden && (
        <button
          onClick={toggle}
          title={playing ? "Jeda musik" : "Putar musik"}
          style={{
            position: "fixed",
            bottom: 24,
            left: 24,
            zIndex: 200,
            width: 44,
            height: 44,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: "rgba(255,255,255,0.85)",
            color: "#221F1A",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            backdropFilter: "blur(6px)",
            transition: "background .2s",
          }}
        >
          {playing ? <IconMelody /> : <IconMelodyMuted />}
        </button>
      )}
    </>
  );
}
