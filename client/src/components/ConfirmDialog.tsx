import { useEffect, useId, useRef } from "react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
}

// A native <dialog> opened with showModal(): the browser puts it in the top
// layer, makes the rest of the page inert, focuses its first button (Cancel)
// and closes it on Escape.
const ConfirmDialog = ({
  open,
  title,
  message,
  onCancel,
  onConfirm,
}: ConfirmDialogProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const messageId = useId();

  // `open` stays in charge: the dialog only opens and closes here
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
      opener.current?.focus();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={messageId}
      onCancel={(event) => {
        // Escape: let the parent close it through `open`
        event.preventDefault();
        onCancel();
      }}
      onClose={() => {
        // The browser can still close it on its own, e.g. on Android's back
        // gesture. Keep `open` in step, or the dialog couldn't open again.
        if (open) onCancel();
      }}
      className="w-80 p-6 rounded-lg bg-white shadow-xl backdrop:bg-black/40"
    >
      <h2 id={titleId} className="text-lg font-semibold mb-2">
        {title}
      </h2>
      <p id={messageId} className="text-sm text-gray-600">
        {message}
      </p>
      <div className="flex justify-end gap-3 mt-6">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 rounded border border-gray-300 text-gray-700 hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
        >
          Confirm
        </button>
      </div>
    </dialog>
  );
};

export default ConfirmDialog;
