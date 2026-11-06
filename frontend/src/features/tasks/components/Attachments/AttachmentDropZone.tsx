import React, { useRef, useState } from "react";
import { FiUploadCloud } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import { ATTACHMENT_TYPES, pastedImages } from "features/tasks/data";

interface AttachmentDropZoneProps {
  onFiles: (files: File[]) => void;
  /** Smaller, once there are images above it */
  compact?: boolean;
  /** For an Attach button elsewhere that opens the same file picker */
  inputRef?: React.RefObject<HTMLInputElement | null>;
  id?: string;
}

// Click to browse, drop image files on it, or paste a screenshot while it has the focus
const AttachmentDropZone = ({ onFiles, compact = false, inputRef, id }: AttachmentDropZoneProps) => {
  const ownRef = useRef<HTMLInputElement>(null);
  const input = inputRef ?? ownRef;
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      onFiles(files);
    }
  };

  return (
    <>
      <button
        type="button"
        id={id}
        className={`${dragging ? task.dropZoneActive : task.dropZone} ${compact ? task.dropZoneCompact : ""}`}
        onClick={() => input.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onPaste={(e) => {
          const files = pastedImages(e.clipboardData);
          if (files.length) {
            e.preventDefault();
            onFiles(files);
          }
        }}
      >
        <FiUploadCloud className={task.dropZoneIcon} aria-hidden="true" />
        <span className={task.dropZoneTitle}>
          Drop images here or <span className={task.dropZoneBrowse}>browse</span>
        </span>
        {compact ? null : <span>You can also paste a screenshot. PNG, JPG, GIF or WebP, up to 5 MB each.</span>}
      </button>
      <input
        ref={input}
        type="file"
        accept={ATTACHMENT_TYPES.join(",")}
        multiple
        hidden
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          // Picking the same file again must fire a change
          e.target.value = "";
          if (files.length) {
            onFiles(files);
          }
        }}
      />
    </>
  );
};

export default AttachmentDropZone;
