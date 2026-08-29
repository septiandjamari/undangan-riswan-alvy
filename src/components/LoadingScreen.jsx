import { useEffect, useState } from "react";

const ASSETS = [
  "/assets/10.svg",
  "/assets/2.svg",
  "/assets/background center page1.svg",
  "/assets/background center whole page.svg",
  "/assets/pojok kiri atas halaman 1.svg",
  "/assets/pojok kanan atas halaman 1.svg",
  "/assets/pojok kiri bawah halaman 1.svg",
  "/assets/pojok kanan bawah halaman 1.svg",
  "/assets/pojok kiri atas whole page.svg",
  "/assets/pojok kanan atas whole page.svg",
  "/assets/pojok kiri bawah whole page.svg",
  "/assets/pojok kanan bawah whole page.svg",
  "/assets/3.svg",
  "/assets/4.svg",
  "/assets/5.svg",
  "/assets/6.svg",
  "/assets/7.svg",
  "/assets/8.svg",
  "/assets/9.svg",
  "/assets/12.svg",
];

function preloadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = resolve; // tetap lanjut meski gagal
    img.src = src;
  });
}

export default function LoadingScreen({ onDone }) {
  const [loaded, setLoaded]   = useState(0);
  const [visible, setVisible] = useState(true);
  const total = ASSETS.length;
  const pct   = Math.round((loaded / total) * 100);

  useEffect(() => {
    let count = 0;
    ASSETS.forEach((src) => {
      preloadImage(src).then(() => {
        count++;
        setLoaded(count);
        if (count === total) {
          // Tunggu sebentar lalu fade out
          setTimeout(() => {
            setVisible(false);
            setTimeout(onDone, 500);
          }, 300);
        }
      });
    });
  }, []);

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9999,
      background: "#EEF1F6",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 24,
      opacity: visible ? 1 : 0,
      pointerEvents: visible ? "auto" : "none",
      transition: "opacity 0.5s ease",
    }}>
      {/* Logo / nama */}
      <p style={{
        fontFamily: '"Style Script", "Great Vibes", cursive',
        fontSize: "clamp(48px, 10vw, 72px)",
        color: "#33532F",
        margin: 0, lineHeight: 1,
      }}>
        Riswanda &amp; Alvy
      </p>

      {/* Progress bar */}
      <div style={{
        width: "clamp(180px, 50vw, 280px)",
        height: 3,
        background: "rgba(51,83,47,.2)",
        borderRadius: 99,
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%",
          width: `${pct}%`,
          background: "#33532F",
          borderRadius: 99,
          transition: "width 0.2s ease",
        }} />
      </div>

      <p style={{
        fontFamily: '"GFS Didot", "Didot", serif',
        fontSize: 12, letterSpacing: "0.2em",
        color: "#221F1A", opacity: 0.6, margin: 0,
      }}>
        {pct}%
      </p>
    </div>
  );
}
