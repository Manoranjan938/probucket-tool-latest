import React from "react";
import { FiImage, FiX } from "react-icons/fi";

import * as task from "features/tasks/styles/taskClasses";

import useImageSrc, { type ImageSource } from "features/tasks/hooks/useImageSrc";
import { formatFileSize } from "features/tasks/data";

interface AttachmentTileProps {
  source: ImageSource;
  name: string;
  size: number;
  onOpen: () => void;
  /** Shows a remove button */
  onRemove?: () => void;
}

// One thumbnail: click it for the full-size viewer
const AttachmentTile = ({ source, name, size, onOpen, onRemove }: AttachmentTileProps) => {
  const src = useImageSrc(source);

  return (
    <li className={task.attachmentTile}>
      <button type="button" className={task.attachmentOpen} onClick={onOpen} aria-label={`View ${name}`}>
        {src && src !== "error" ? (
          <img src={src} alt="" className={task.attachmentImage} />
        ) : (
          <span className={task.attachmentPlaceholder} aria-hidden="true">
            <FiImage />
          </span>
        )}
      </button>
      <span className={task.attachmentCaption}>
        <span className={task.attachmentName} title={name}>{name}</span>
        <span className={task.attachmentSize}>{src === "error" ? "Couldn't load" : formatFileSize(size)}</span>
      </span>
      {onRemove ? (
        <button type="button" className={task.attachmentRemove} onClick={onRemove} aria-label={`Remove ${name}`}>
          <FiX aria-hidden="true" />
        </button>
      ) : null}
    </li>
  );
};

export default AttachmentTile;
