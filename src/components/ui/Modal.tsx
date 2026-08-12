import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton, X } from './primitives';
import { useLockBodyScroll, useFocusReturn, useReducedMotion } from '@/hooks';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  showClose?: boolean;
  labelledBy?: string;
}

export const Modal: React.FC<ModalProps> = ({
  open,
  onClose,
  children,
  className = '',
  showClose = true,
  labelledBy,
}) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useLockBodyScroll(open);
  const { returnFocus } = useFocusReturn(open);

  const handleKey = useCallback(
    (e: KeyboardEvent) => {
      if (!open) return;
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [open, onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener('keydown', handleKey);
    const dialog = dialogRef.current;
    if (!dialog) return;

    const focusables = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener('keydown', trap);
    window.setTimeout(() => first?.focus(), 0);

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('keydown', trap);
      returnFocus();
    };
  }, [open, handleKey, returnFocus]);

  return (
    <AnimatePresence>
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
          aria-modal="true"
          role="dialog"
          aria-labelledby={labelledBy}
        >
          <motion.div
            initial={reduced ? { opacity: 0 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="absolute inset-0 bg-matcha-950/85 backdrop-blur-sm"
          />
          <motion.div
            ref={dialogRef}
            initial={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`relative w-full max-w-5xl max-h-[90svh] overflow-y-auto rounded-3xl bg-matcha-900 border border-cream-100/5 shadow-modal ${className}`}
            onClick={(e) => e.stopPropagation()}
          >
            {showClose && (
              <div className="absolute top-3 right-3 z-10">
                <IconButton
                  icon={X}
                  size="md"
                  variant="solid"
                  label="Close"
                  onClick={onClose}
                />
              </div>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
