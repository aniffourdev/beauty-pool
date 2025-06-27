"use client";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";

export const BackgroundGradientAnimation = ({
  children,
  className,
  containerClassName,
}: {
  children?: React.ReactNode;
  className?: string;
  containerClassName?: string;
}) => {
  const interactiveRef = useRef<HTMLDivElement>(null);

  const [curX, setCurX] = useState(0);
  const [curY, setCurY] = useState(0);
  const [tgX, setTgX] = useState(0);
  const [tgY, setTgY] = useState(0);

  useEffect(() => {
    document.body.style.setProperty("--primary-color", "#38bdf8");
    document.body.style.setProperty("--secondary-color", "#34d399");
    document.body.style.setProperty("--tertiary-color", "#a7f3d0");
    document.body.style.setProperty("--quaternary-color", "#bae6fd");
    document.body.style.setProperty("--quinary-color", "#67e8f9");
    document.body.style.setProperty("--pointer-color", "#ffffff");
    document.body.style.setProperty("--size", "15%"); // Adjusted size
    document.body.style.setProperty("--blending-value", "hard-light");
  }, []);

  useEffect(() => {
    function move() {
      if (!interactiveRef.current) {
        return;
      }
      setCurX(curX + (tgX - curX) / 20);
      setCurY(curY + (tgY - curY) / 20);
      interactiveRef.current.style.transform = `translate(${Math.round(
        curX
      )}px, ${Math.round(curY)}px)`;
    }

    move();
  }, [tgX, tgY]);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (interactiveRef.current) {
      const rect = interactiveRef.current.getBoundingClientRect();
      setTgX(event.clientX - rect.left);
      setTgY(event.clientY - rect.top);
    }
  };

  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    setIsSafari(/^((?!chrome|android).)*safari/i.test(navigator.userAgent));
  }, []);

  const [gradientStyles, setGradientStyles] = useState<
    { top: string; left: string; animationDuration: string; animationDelay: string }[]
  >([]);

  useEffect(() => {
    const styles = [...Array(9)].map((_, index) => ({
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 10 + 15}s`,
      animationDelay: `${index * 0.5}s`,
    }));
    setGradientStyles(styles);
  }, []);

  return (
    <div
      className={cn(
        "h-screen w-screen relative overflow-hidden top-0 left-0 bg-white",
        containerClassName
      )}
    >
      <svg className="hidden">
        <defs>
          <filter id="blurMe">
            <feGaussianBlur
              in="SourceGraphic"
              stdDeviation="10"
              result="blur"
            />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
            <feBlend in="SourceGraphic" in2="goo" />
          </filter>
        </defs>
      </svg>
      <div className={cn("", className)}>{children}</div>
      <div
        className={cn(
          "gradients-container h-full w-full blur-xl",
          isSafari ? "blur-2xl" : "[filter:url(#blurMe)_blur(90px)]"
        )}
      >
        {gradientStyles.map((style, index) => (
          <div
            key={index}
            className={cn(
              `absolute [background:radial-gradient(circle_at_center,_var(--primary-color)_0,_var(--primary-color)_50%)_no-repeat]`,
              `[mix-blend-mode:var(--blending-value)] w-[var(--size)] h-[var(--size)]`,
              `animate-circle`,
              `opacity-100`,
              `animation-delay-${index}`
            )}
            style={style}
          ></div>
        ))}
      </div>
    </div>
  );
};
