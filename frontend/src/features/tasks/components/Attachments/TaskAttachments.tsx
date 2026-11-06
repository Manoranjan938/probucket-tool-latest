import React, { useState } from "react";
import { CircularProgress, Dialog } from "@mui/material";

import * as task from "features/tasks/styles/taskClasses";

import AttachmentDropZone from "features/tasks/components/Attachments/AttachmentDropZone";
import AttachmentTile from "features/tasks/components/Attachments/AttachmentTile";
import ImageViewer from "features/tasks/components/Attachments/ImageViewer";
import { MAX_ATTACHMENTS } from "features/tasks/data";
import type { TaskAttachmentsState } from "features/tasks/hooks/useTaskAttachments";
import type { Attachment } from "features/tasks/types";

interface TaskAttachmentsProps {
  state: TaskAttachmentsState;
  /** The file input, which the Attach button above opens too */
  inputRef: React.RefObject<HTMLInputElement | null>;
}

// A saved task's images: thumbnails, the full-size viewer, and a drop zone while there's room for more
const TaskAttachments = ({ state, inputRef }: TaskAttachmentsProps) => {
  const { attachments, uploading, add, remove } = state;
  const [viewing, setViewing] = useState<number | null>(null);
  const [confirming, setConfirming] = useState<Attachment | null>(null);
  const [deleting, setDeleting] = useState(false);
  const full = attachments.length + uploading >= MAX_ATTACHMENTS;

  const confirmDelete = async () => {
    setDeleting(true);
    const deleted = await remove(confirming!);
    setDeleting(false);
    if (deleted) {
      setConfirming(null);
      setViewing(null);
    }
  };

  return (
    <section className={task.section} aria-labelledby="attachments-title">
      <div className={task.attachmentsHeader}>
        <h3 id="attachments-title" className={task.sectionTitle}>Attachments</h3>
        {attachments.length ? (
          <span className={task.attachmentsCount}>{attachments.length} / {MAX_ATTACHMENTS}</span>
        ) : null}
      </div>
      {attachments.length || uploading ? (
        <ul className={`${task.attachmentGrid} mb-3`}>
          {attachments.map((attachment, index) => (
            <AttachmentTile
              key={attachment.attachmentId}
              source={{ attachmentId: attachment.attachmentId }}
              name={attachment.fileName}
              size={attachment.size}
              onOpen={() => setViewing(index)}
              onRemove={attachment.canDelete ? () => setConfirming(attachment) : undefined}
            />
          ))}
          {Array.from({ length: uploading }, (_, index) => (
            <li key={`uploading-${index}`} className={task.attachmentUploading} aria-live="polite">
              <CircularProgress size={20} />
              Uploading…
            </li>
          ))}
        </ul>
      ) : null}
      {full ? (
        <p className={task.fieldHint}>This task has the most images it can have ({MAX_ATTACHMENTS}).</p>
      ) : (
        <AttachmentDropZone id="task-attachments-drop" onFiles={add} inputRef={inputRef} compact={attachments.length > 0} />
      )}

      <ImageViewer
        images={attachments.map((attachment) => ({
          key: attachment.attachmentId,
          source: { attachmentId: attachment.attachmentId },
          name: attachment.fileName,
          size: attachment.size,
        }))}
        index={viewing}
        onIndexChange={setViewing}
        onClose={() => setViewing(null)}
      />

      <Dialog
        open={confirming !== null}
        onClose={() => setConfirming(null)}
        PaperProps={{ className: task.dialogPaper }}
        aria-labelledby="delete-image-title"
      >
        <div className={task.dialogHeader}>
          <h2 id="delete-image-title" className={task.dialogTitle}>Delete image?</h2>
        </div>
        <div className={task.dialogBody}>
          <p className="m-0 text-[14px] [overflow-wrap:anywhere]">
            {confirming?.fileName} will be deleted for everyone. This can't be undone.
          </p>
        </div>
        <div className={task.dialogFooter}>
          <button type="button" className={task.btnGhost} onClick={() => setConfirming(null)}>Cancel</button>
          <button type="button" className={task.btnDanger} onClick={confirmDelete} disabled={deleting}>
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </Dialog>
    </section>
  );
};

export default TaskAttachments;
