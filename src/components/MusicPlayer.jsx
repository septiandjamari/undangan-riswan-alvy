import { useEffect, useRef, useState } from "react";

const AUDIO_SRC = "/assets/y2mate.com - New Wedding Nasheed Music Free \u0645\u062d\u0645\u062f \u0627\u0644\u0645\u0642\u064a\u0637 \u0639\u0631\u0648\u0633\u0629 \u0627\u0644\u0646\u0648\u0631 Muhammad al Muqit.mp3";

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

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = 0.65;
    audio.loop   = true;
  }, []);

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
    </>
  );
}
