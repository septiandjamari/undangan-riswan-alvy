import { useState, useEffect } from "react";

function pad(n) {
  return String(Math.max(0, n)).padStart(2, "0");
}

export function useCountdown(targetDate) {
  const [time, setTime] = useState({ days: "00", hours: "00", minutes: "00", seconds: "00" });

  useEffect(() => {
    function tick() {
      const diff = new Date(targetDate) - Date.now();
      if (diff <= 0) {
        setTime({ days: "00", hours: "00", minutes: "00", seconds: "00" });
        return;
      }
      const total = Math.floor(diff / 1000);
      setTime({
        days:    pad(Math.floor(total / 86400)),
        hours:   pad(Math.floor((total % 86400) / 3600)),
        minutes: pad(Math.floor((total % 3600) / 60)),
        seconds: pad(total % 60),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  return time;
}
