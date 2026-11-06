import React from "react";
import { Dialog } from "@mui/material";
import { FiChevronLeft, FiChevronRight, FiDownload, FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import useImageSrc, { type ImageSource } from "features/tasks/hooks/useImageSrc";
import { formatFileSize } from "features/tasks/data";

export interface ViewerImage {
  key: string;
  source: ImageSource;
  name: string;
  size: number;
}

interface ImageViewerProps {
  images: ViewerImage[];
  /** The image shown; null when the viewer is closed */
  index: number | null;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}

// The image large over the page, with the previous and next ones a click or an arrow key away
const ImageViewer = ({ images, index, onIndexChange, onClose }: ImageViewerProps) => {
  const open = index !== null && index < images.length;
  const current = open ? images[index] : images[0];
  // Nothing is fetched while the viewer is closed
  const src = useImageSrc(open ? current.source : null);
  const hasPrevious = open && index > 0;
  const hasNext = open && index < images.length - 1;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft" && hasPrevious) {
      onIndexChange(index - 1);
    } else if (e.key === "ArrowRight" && hasNext) {
      onIndexChange(index + 1);
    }
  };

  if (!current) {
    return null;
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      onKeyDown={handleKeyDown}
      PaperProps={{ className: task.viewerPaper }}
      slotProps={{ backdrop: { sx: { backgroundColor: "rgba(10, 10, 16, 0.85)" } } }}
      aria-labelledby="image-viewer-title"
    >
      <div className={task.viewerHeader}>
        <div className={task.viewerTitle}>
          <h2 id="image-viewer-title" className={task.viewerName} title={current.name}>{current.name}</h2>
          <span className={task.viewerMeta}>
            {formatFileSize(current.size)}
            {images.length > 1 ? ` · ${(index ?? 0) + 1} of ${images.length}` : ""}
          </span>
        </div>
        {src && src !== "error" ? (
          <a className={task.viewerButton} href={src} download={current.name}>
            <FiDownload aria-hidden="true" />
            Download
          </a>
        ) : null}
        <button type="button" className={task.viewerIconButton} onClick={onClose} aria-label="Close">
          <FiX aria-hidden="true" />
        </button>
      </div>
      <div className={task.viewerStage}>
        {src === "error" ? (
          <p className={task.viewerMeta}>This image couldn't be loaded.</p>
        ) : src ? (
          <img src={src} alt={current.name} className={task.viewerImage} />
        ) : (
          <p className={task.viewerMeta}>Loading…</p>
        )}
        {hasPrevious ? (
          <button type="button" className={`${task.viewerNav} left-3`} onClick={() => onIndexChange(index - 1)} aria-label="Previous image">
            <FiChevronLeft aria-hidden="true" />
          </button>
        ) : null}
        {hasNext ? (
          <button type="button" className={`${task.viewerNav} right-3`} onClick={() => onIndexChange(index + 1)} aria-label="Next image">
            <FiChevronRight aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </Dialog>
  );
};

export default ImageViewer;
