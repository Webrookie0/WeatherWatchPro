import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface GaugeProps {
  value: number;
  min: number;
  max: number;
  className?: string;
  color?: string;
  label?: string;
  unit?: string;
}

export function Gauge({ 
  value, 
  min, 
  max, 
  className,
  color = "linear-gradient(90deg, var(--primary), var(--primary-light, #64B5F6))",
  label,
  unit = ""
}: GaugeProps) {
  const fillRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (fillRef.current) {
      // Calculate rotation (0 to 180 degrees)
      const normalizedValue = Math.max(min, Math.min(max, value));
      const percentage = (normalizedValue - min) / (max - min);
      const rotation = percentage * 180;
      
      // Apply rotation
      fillRef.current.style.transform = `rotate(${rotation}deg)`;
      
      // Create the color gradient
      if (typeof color === 'string' && color.includes('linear-gradient')) {
        fillRef.current.style.background = color;
      } else {
        fillRef.current.style.backgroundColor = color;
      }
    }
  }, [value, min, max, color]);

  return (
    <div className={cn("relative h-[120px] w-[160px] mx-auto", className)}>
      <div className="absolute rounded-t-full h-[80px] w-[160px] bg-[#e0e0e0] z-0"></div>
      <div ref={fillRef} className="absolute rounded-t-full h-[80px] w-[160px] bg-primary z-10 origin-bottom"></div>
      <div className="absolute w-full bottom-0 text-center text-2xl font-medium text-gray-800">
        {value.toFixed(1)}{unit}
      </div>
      {label && (
        <div className="absolute w-full bottom-[-25px] text-center text-sm text-gray-600">
          {label}
        </div>
      )}
    </div>
  );
}
