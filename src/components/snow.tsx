import React, { useEffect, useState } from "react";

interface Snowflake {
  id: number;
  left: number;
  size: number;
  opacity: number;
  animationDuration: number;
  drift: number;
}

const fallAnimation = `
  @keyframes fall {
    0% {
      transform: translate(0, -10px);
    }
    100% {
      transform: translate(var(--drift), 100vh);
    }
  }
`;

const Snow: React.FC = () => {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const initialSnowflakes: Snowflake[] = Array.from(
      { length: 35 },
      (_, i) => ({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 4 + 2,
        opacity: Math.random() * 0.4 + 0.3,
        animationDuration: Math.random() * 15 + 10,
        drift: Math.random() * 100 - 50,
      })
    );

    setSnowflakes(initialSnowflakes);

    const interval = setInterval(() => {
      setSnowflakes((prev) =>
        [
          ...prev,
          {
            id: Date.now(),
            left: Math.random() * 100,
            size: Math.random() * 4 + 2,
            opacity: Math.random() * 0.4 + 0.3,
            animationDuration: Math.random() * 15 + 10,
            drift: Math.random() * 100 - 50,
          },
        ].slice(-35)
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="SnowContainer fixed inset-0 pointer-events-none overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="absolute rounded-full bg-white"
          style={
            {
              left: `${flake.left}%`,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              animation: `fall ${flake.animationDuration}s linear infinite`,
              top: "-10px",
              willChange: "transform",
              "--drift": `${flake.drift}px`,
            } as React.CSSProperties
          }
        />
      ))}
      <style>{fallAnimation}</style>
    </div>
  );
};

export default Snow;
