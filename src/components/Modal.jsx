import { useEffect, useId, useRef } from "react";

const Modal = ({ title, onClose, children, className = "", headerExtra }) => {
  const titleId = useId();
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    dialogRef.current?.focus();

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const handleKey = (e) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        data-testid="modal-backdrop"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`animate-pop-in relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl border border-ink-700 bg-ink-850 shadow-2xl shadow-black/50 outline-none ${className}`}
      >
        <header className="flex items-center gap-3 border-b border-ink-700 px-5 py-3">
          <h2 id={titleId} className="min-w-0 flex-1 truncate font-semibold">
            {title}
          </h2>
          {headerExtra}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid size-8 place-items-center rounded-lg text-ink-400 transition hover:bg-ink-700 hover:text-ink-100"
          >
            ✕
          </button>
        </header>
        <div className="scrollbar-thin overflow-auto">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
