import React, { useEffect, useState } from "react";

interface BloomLoaderProps {
  loadingText?: string;
  size?: "sm" | "md" | "lg";
}

export const BloomLoader: React.FC<BloomLoaderProps> = ({
  loadingText = "Cultivating your experience",
  size = "md"
}) => {
  const [dots, setDots] = useState<string>("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  const sizeMap = {
    sm: { box: "w-16 h-16", text: "text-xs mt-3" },
    md: { box: "w-24 h-24", text: "text-sm mt-5" },
    lg: { box: "w-36 h-36", text: "text-base mt-7" }
  };

  const selectedSize = sizeMap[size];

  // Inline dynamic keyframe styles to maintain single-file zero-config dependency
  const styles = `
    @keyframes bloom-spin-clockwise {
      0% { transform: rotate(0deg) scale(1); border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
      50% { transform: rotate(180deg) scale(1.05); border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
      100% { transform: rotate(360deg) scale(1); border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
    }
    @keyframes bloom-spin-counter {
      0% { transform: rotate(360deg) scale(1); border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
      50% { transform: rotate(180deg) scale(0.95); border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; }
      100% { transform: rotate(0deg) scale(1); border-radius: 70% 30% 52% 48% / 60% 40% 60% 40%; }
    }
    @keyframes bloom-pulse-core {
      0%, 100% { transform: scale(1); opacity: 0.9; }
      50% { transform: scale(1.2); opacity: 1; box-shadow: 0 0 12px #fbbf24; }
    }
    .bloom-petal-1 { animation: bloom-spin-clockwise 7s infinite linear; }
    .bloom-petal-2 { animation: bloom-spin-counter 10s infinite linear; }
    .bloom-core { animation: bloom-pulse-core 2s infinite ease-in-out; }
  `;

  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[200px] w-full bg-transparent p-4 select-none font-sans"
      style={{ opacity: 0, animation: "fadeIn 0.4s ease-out forwards" }}
    >
      {/* Injecting CSS Keyframes directly */}
      <style dangerouslySetInnerHTML={{ __html: styles + "@keyframes fadeIn { to { opacity: 1; } }" }} />

      {/* Animated Floral Layers */}
      <div className={`relative ${selectedSize.box} flex items-center justify-center`}>
        
        {/* Outer Emerald Petal */}
        <div 
          className="absolute inset-0 bg-emerald-100/60 bloom-petal-1 mix-blend-multiply filter blur-[0.5px]"
          style={{ backgroundColor: "rgba(209, 250, 229, 0.6)" }}
        />
        
        {/* Middle Rose Petal */}
        <div 
          className="absolute inset-2 bg-rose-200/50 bloom-petal-2 mix-blend-multiply"
          style={{ backgroundColor: "rgba(fecdd3, 0.5)" }}
        />
        
        {/* Inner Blossom Petal */}
        <div 
          className="absolute inset-4 bg-rose-300/40 bloom-petal-1"
          style={{ backgroundColor: "rgba(fda4af, 0.4)", animationDuration: "5s" }}
        />

        {/* Central Core Pistil */}
        <div 
          className="w-3 h-3 bg-amber-400 rounded-full bloom-core z-10"
          style={{ backgroundColor: "#fbbf24" }}
        />
      </div>

      {/* Typography Layout */}
      <p className={`${selectedSize.text} font-light tracking-widest text-neutral-500 uppercase text-center min-w-[250px]`}>
        {loadingText}
        <span className="inline-block text-left w-4 ml-0.5 font-medium text-emerald-600">{dots}</span>
      </p>
    </div>
  );
};

export default BloomLoader;
