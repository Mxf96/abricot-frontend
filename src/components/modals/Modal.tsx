'use client';

import { ReactNode, useEffect, useRef } from 'react';

import styles from '@/styles/components/modals/Modal.module.scss';

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  ariaLabel: string;
};

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function Modal({
  isOpen,
  onClose,
  children,
  ariaLabel,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousActiveElement =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;

    const previousOverflow = document.body.style.overflow;

    const focusableElements = Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
    );

    const firstFocusableElement = focusableElements[0] ?? modalRef.current;

    requestAnimationFrame(() => {
      firstFocusableElement?.focus();
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const currentFocusableElements = Array.from(
        modalRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? []
      );

      if (currentFocusableElements.length === 0) {
        event.preventDefault();
        modalRef.current?.focus();
        return;
      }

      const firstElement = currentFocusableElements[0];
      const lastElement =
        currentFocusableElements[currentFocusableElements.length - 1];

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      } else if (!event.shiftKey && document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement?.focus();
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onMouseDown={onClose}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel}
        tabIndex={-1}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fermer la fenêtre"
        >
          ×
        </button>

        {children}
      </div>
    </div>
  );
}
