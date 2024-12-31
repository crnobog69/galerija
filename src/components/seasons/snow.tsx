import { useState, useEffect } from "react";
import Snowfall from "react-snowfall";

export default function SnowEffect() {
  const [showSnow, setShowSnow] = useState(
    localStorage.getItem("snow-enabled") !== "false"
  );

  useEffect(() => {
    const handleToggleSnow = () => {
      setShowSnow(!document.documentElement.classList.contains("disable-snow"));
    };

    window.addEventListener("toggleSnow", handleToggleSnow);

    return () => {
      window.removeEventListener("toggleSnow", handleToggleSnow);
    };
  }, []);

  return (
    <>
      {showSnow && (
        <Snowfall
          color="white"
          snowflakeCount={350}
          speed={[0.1, 1]}
          wind={[-0.5, 0]}
          radius={[0.5, 1]}
          style={{
            position: "fixed",
            width: "100vw",
            height: "100vh",
            zIndex: -1000,
          }}
        />
      )}
    </>
  );
}
