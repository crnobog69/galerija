import React, { useEffect, useState } from "react";

interface Leaf {
  id: number;
  left: number;
  size: number;
  opacity: number;
  animationDuration: number;
  rotation: number;
  color: string;
}

const fallAnimation = `
  @keyframes leafFall {
    0% {
      transform: translate(0, -10px) rotate(0deg);
    }
    100% {
      transform: translate(var(--drift), 100vh) rotate(var(--rotation));
    }
  }
`;

const leafColors = ["#FF6B6B", "#FFB347", "#D7892B", "#FFA07A"];

const Leaves: React.FC = () => {
  const [leaves, setLeaves] = useState<Leaf[]>([]);

  useEffect(() => {
    const initialLeaves: Leaf[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 8 + 4,
      opacity: Math.random() * 0.6 + 0.4,
      animationDuration: Math.random() * 20 + 15,
      rotation: Math.random() * 360,
      color: leafColors[Math.floor(Math.random() * leafColors.length)],
    }));

    setLeaves(initialLeaves);

    const interval = setInterval(() => {
      setLeaves((prev) =>
        [
          ...prev,
          {
            id: Date.now(),
            left: Math.random() * 100,
            size: Math.random() * 8 + 4,
            opacity: Math.random() * 0.6 + 0.4,
            animationDuration: Math.random() * 20 + 15,
            rotation: Math.random() * 360,
            color: leafColors[Math.floor(Math.random() * leafColors.length)],
          },
        ].slice(-20)
      );
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="LeavesContainer fixed inset-0 pointer-events-none overflow-hidden">
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className="absolute"
          style={
            {
              left: `${leaf.left}%`,
              width: `${leaf.size}px`,
              height: `${leaf.size}px`,
              opacity: leaf.opacity,
              animation: `leafFall ${leaf.animationDuration}s linear infinite`,
              top: "-10px",
              willChange: "transform",
              "--rotation": `${leaf.rotation}deg`,
              "--drift": `${Math.random() * 100 - 50}px`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 24 24" fill={leaf.color} className="w-full h-full">
            <path d="M12 3c-1.5 1.5-4.5 3-7.5 3 0 4.5 2.5 8.5 7.5 11.5 5-3 7.5-7 7.5-11.5-3 0-6-1.5-7.5-3z" />
          </svg>
        </div>
      ))}
      <style>{fallAnimation}</style>
    </div>
  );
};

export default Leaves;
