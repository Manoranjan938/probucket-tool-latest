import { useState } from "react";
import { useSnackbar } from "notistack";

import { useDeleteAttachmentMutation, useGetAttachmentsQuery, useUploadAttachmentsMutation } from "features/tasks/api/tasksApi";
import { checkImages, toastOptions } from "features/tasks/data";
import type { Attachment } from "features/tasks/types";
import { getApiErrorMessage } from "shared/services/apiError";

// A saved task's images: the list, adding (picked, dropped or pasted) and deleting, each with a toast
const useTaskAttachments = (taskId: string) => {
  const { currentData: attachments = [] } = useGetAttachmentsQuery(taskId);
  const [uploadAttachments] = useUploadAttachmentsMutation();
  const [deleteAttachment] = useDeleteAttachmentMutation();
  const [uploading, setUploading] = useState(0);
  const { enqueueSnackbar } = useSnackbar();

  const add = async (files: File[]) => {
    const { accepted, problem } = checkImages(files, attachments.length + uploading);
    if (problem) {
      enqueueSnackbar(problem, { ...toastOptions, variant: "warning" });
    }
    if (!accepted.length) {
      return;
    }
    setUploading((count) => count + accepted.length);
    try {
      await uploadAttachments({ taskId, files: accepted }).unwrap();
      enqueueSnackbar(accepted.length === 1 ? "Image attached" : `${accepted.length} images attached`, {
        ...toastOptions,
        variant: "success",
      });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't attach the images. Please try again."), { ...toastOptions, variant: "error" });
    } finally {
      setUploading((count) => count - accepted.length);
    }
  };

  const remove = async (attachment: Attachment) => {
    try {
      await deleteAttachment(attachment.attachmentId).unwrap();
      enqueueSnackbar("Image deleted", { ...toastOptions, variant: "success" });
      return true;
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't delete the image. Please try again."), { ...toastOptions, variant: "error" });
      return false;
    }
  };

  return { attachments, uploading, add, remove };
};

export type TaskAttachmentsState = ReturnType<typeof useTaskAttachments>;

export default useTaskAttachments;
