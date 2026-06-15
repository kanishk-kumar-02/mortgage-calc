"use client";

import {
  useEffect,
  useRef,
  useState,
  ReactNode,
  TouchEvent,
  WheelEvent,
} from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollExpandMediaProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc?: string;
  title?: string;
  date?: string;
  scrollToExpand?: string;
  textBlend?: boolean;
  children?: ReactNode;
}

const ScrollExpandMedia = ({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  title,
  date,
  scrollToExpand,
  textBlend,
  children,
}: ScrollExpandMediaProps) => {
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [showContent, setShowContent] = useState<boolean>(false);
  const [mediaFullyExpanded, setMediaFullyExpanded] = useState<boolean>(false);
  const [touchStartY, setTouchStartY] = useState<number>(0);
  const [isMobileState, setIsMobileState] = useState<boolean>(false);

  const reduceMotion = useReducedMotion();
  const sectionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mediaFullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollDelta = e.deltaY * 0.0009;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      setTouchStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!touchStartY) return;

      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;

      if (mediaFullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setMediaFullyExpanded(false);
        e.preventDefault();
      } else if (!mediaFullyExpanded) {
        e.preventDefault();
        const scrollFactor = deltaY < 0 ? 0.008 : 0.005;
        const scrollDelta = deltaY * scrollFactor;
        const newProgress = Math.min(
          Math.max(scrollProgress + scrollDelta, 0),
          1
        );
        setScrollProgress(newProgress);

        if (newProgress >= 1) {
          setMediaFullyExpanded(true);
          setShowContent(true);
        } else if (newProgress < 0.75) {
          setShowContent(false);
        }

        setTouchStartY(touchY);
      }
    };

    const handleTouchEnd = (): void => {
      setTouchStartY(0);
    };

    const handleScroll = (): void => {
      if (!mediaFullyExpanded) {
        window.scrollTo(0, 0);
      }
    };

    window.addEventListener("wheel", handleWheel as unknown as EventListener, {
      passive: false,
    });
    window.addEventListener("scroll", handleScroll as EventListener);
    window.addEventListener(
      "touchstart",
      handleTouchStart as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener(
      "touchmove",
      handleTouchMove as unknown as EventListener,
      { passive: false }
    );
    window.addEventListener("touchend", handleTouchEnd as EventListener);

    return () => {
      window.removeEventListener(
        "wheel",
        handleWheel as unknown as EventListener
      );
      window.removeEventListener("scroll", handleScroll as EventListener);
      window.removeEventListener(
        "touchstart",
        handleTouchStart as unknown as EventListener
      );
      window.removeEventListener(
        "touchmove",
        handleTouchMove as unknown as EventListener
      );
      window.removeEventListener("touchend", handleTouchEnd as EventListener);
    };
  }, [scrollProgress, mediaFullyExpanded, touchStartY]);

  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobileState(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const mediaWidth = 420 + scrollProgress * (isMobileState ? 650 : 1250);
  const mediaHeight = 520 + scrollProgress * (isMobileState ? 200 : 400);
  const textTranslateX = scrollProgress * (isMobileState ? 180 : 150);
  const introOpacity = 1 - scrollProgress;

  const firstWord = title ? title.split(" ")[0] : "";
  const restOfTitle = title ? title.split(" ").slice(1).join(" ") : "";
  const scrollToExpandText = scrollToExpand?.replace(/\s*↓\s*$/, "");

  return (
    <div
      ref={sectionRef}
      className="transition-colors duration-700 ease-in-out overflow-x-hidden"
    >
      <section className="relative flex flex-col items-center justify-start min-h-[100dvh]">
        <div className="relative w-full flex flex-col items-center min-h-[100dvh]">
          <div
            className="absolute inset-0 z-0 h-full"
            style={{ background: "var(--color-ink)" }}
          />

          <div className="container mx-auto flex flex-col items-center relative z-10">
            <div className="flex flex-col items-center justify-center gap-8 w-full min-h-[100dvh] px-5 py-28 relative">
              {date && (
                <p
                  className="text-xs font-semibold uppercase tracking-[0.25em] text-gold sm:text-sm"
                  style={{ opacity: introOpacity }}
                >
                  {date}
                </p>
              )}

              <div
                className={`flex flex-col items-center text-center gap-3 relative z-10 transition-none ${
                  textBlend ? "mix-blend-difference" : "mix-blend-normal"
                }`}
                style={{ opacity: introOpacity }}
              >
                <div className="flex flex-col items-center gap-2">
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-cream transition-none"
                    style={{ transform: `translateX(-${textTranslateX}vw)` }}
                  >
                    {firstWord}
                  </motion.h2>
                  <motion.h2
                    className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-cream transition-none"
                    style={{ transform: `translateX(${textTranslateX}vw)` }}
                  >
                    {restOfTitle}
                  </motion.h2>
                </div>
                <span className="h-1 w-16 rounded-full bg-gold" aria-hidden="true" />
              </div>

              <div
                className="relative z-0 rounded-2xl transition-none"
                style={{
                  width: `${mediaWidth}px`,
                  height: `${mediaHeight}px`,
                  maxWidth: "95vw",
                  maxHeight: "70vh",
                  boxShadow:
                    "0 0 50px rgba(0, 0, 0, 0.3), 0 0 60px rgba(212, 165, 55, 0.25)",
                }}
              >
                {mediaType === "video" ? (
                  <div className="relative w-full h-full pointer-events-none">
                    <video
                      src={mediaSrc}
                      poster={posterSrc}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="auto"
                      className="w-full h-full object-cover rounded-2xl"
                      controls={false}
                      disablePictureInPicture
                      disableRemotePlayback
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/30 rounded-2xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.5 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                ) : (
                  <div className="relative w-full h-full">
                    <Image
                      src={mediaSrc}
                      alt={title || "Media content"}
                      width={1280}
                      height={720}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                    <motion.div
                      className="absolute inset-0 bg-black/50 rounded-2xl"
                      initial={{ opacity: 0.7 }}
                      animate={{ opacity: 0.7 - scrollProgress * 0.3 }}
                      transition={{ duration: 0.2 }}
                    />
                  </div>
                )}
              </div>

              {scrollToExpandText && (
                <div
                  className="flex flex-col items-center gap-2 text-cream/60"
                  style={{ opacity: introOpacity }}
                >
                  <p className="text-xs">{scrollToExpandText}</p>
                  <motion.span
                    aria-hidden="true"
                    className="text-base"
                    animate={
                      reduceMotion
                        ? undefined
                        : { y: [0, 6, 0], opacity: [0.4, 1, 0.4] }
                    }
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                  >
                    ↓
                  </motion.span>
                </div>
              )}
            </div>

            <motion.section
              className="flex flex-col w-full relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: showContent ? 1 : 0 }}
              transition={{ duration: 0.7 }}
            >
              {children}
            </motion.section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScrollExpandMedia;
