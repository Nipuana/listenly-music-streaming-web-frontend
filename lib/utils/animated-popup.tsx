"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { createClientOnlyComponent } from "./client-only";

interface AnimatedPopupProps {
  isOpen: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
  backdropClassName?: string;
  motionProps?: HTMLMotionProps<"div">;
  backdropMotionProps?: HTMLMotionProps<"div">;
}

/**
 * Standardized animated popup wrapper component
 * Provides consistent open/close animations for all popups in the app
 */
const AnimatedPopupComponent = ({
  isOpen,
  onClose,
  children,
  className = "relative bg-background rounded-xl shadow-2xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto",
  backdropClassName = "absolute inset-0 bg-black/50 backdrop-blur-sm",
  motionProps,
  backdropMotionProps,
}: AnimatedPopupProps) => {
  const [container] = useState(() => {
    try {
      const el = document.createElement("div");
      el.className = "animated-popup-portal";
      return el;
    } catch {
      return null as unknown as HTMLDivElement;
    }
  });

  useEffect(() => {
    if (!container) return;
    document.body.appendChild(container);
    return () => {
      if (container.parentElement) container.parentElement.removeChild(container);
    };
  }, [container]);

  if (!container) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${backdropClassName} z-0`}
            onClick={(e) => {
              e.stopPropagation();
              onClose?.();
            }}
            {...backdropMotionProps}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={`${className} relative z-[100000]`}
            {...motionProps}
          >
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    container
  );
};

export const AnimatedPopup = createClientOnlyComponent(AnimatedPopupComponent);