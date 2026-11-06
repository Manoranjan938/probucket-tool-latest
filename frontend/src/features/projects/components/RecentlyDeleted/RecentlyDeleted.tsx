import React, { useState } from "react";
import { useSnackbar } from "notistack";
import { FiRotateCcw } from "react-icons/fi";

import * as project from "features/projects/styles/projectClasses";

import { useGetDeletedProjectsQuery, useRestoreProjectMutation } from "features/projects/api/projectsApi";
import { daysLeft, PROJECT_RETENTION_DAYS } from "features/projects/data";
import { formatDate, toastOptions } from "features/tasks/data";
import { getApiErrorMessage } from "shared/services/apiError";
import type { DeletedProject } from "features/projects/types";

const remaining = (item: DeletedProject) => {
  const days = daysLeft(item.deleteForeverOn);
  return days === 0 ? "Deleted for good soon" : `${days} ${days === 1 ? "day" : "days"} left`;
};

// The lead's deleted projects, with a way to bring each one back. Hidden while there are none.
const RecentlyDeleted = ({ userId }: { userId: string }) => {
  // Shown as nothing if it couldn't be loaded
  const { data: deleted = [] } = useGetDeletedProjectsQuery(userId);
  const [restoreProject] = useRestoreProjectMutation();
  const [restoring, setRestoring] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  if (deleted.length === 0) {
    return null;
  }

  const handleRestore = async (item: DeletedProject) => {
    setRestoring(item.projectId);
    try {
      await restoreProject(item.projectId).unwrap();
      enqueueSnackbar(`${item.projectName} restored`, { ...toastOptions, variant: "success" });
    } catch (err) {
      enqueueSnackbar(getApiErrorMessage(err, "Couldn't restore the project. Please try again."), {
        ...toastOptions,
        variant: "error",
      });
    } finally {
      setRestoring(null);
    }
  };

  return (
    <section className={project.deletedSection} aria-labelledby="recently-deleted-title">
      <h2 id="recently-deleted-title" className={project.deletedTitle}>Recently deleted</h2>
      <p className={project.deletedText}>
        Only you can see these. Each one is deleted for good {PROJECT_RETENTION_DAYS} days after it was deleted.
      </p>
      <ul className={project.deletedList}>
        {deleted.map((item) => (
          <li key={item.projectId} className={project.deletedRow}>
            <span className={project.deletedAvatar} aria-hidden="true">{item.projectName.substring(0, 1)}</span>
            <div className={project.deletedInfo}>
              <p className={project.deletedName}>
                <span className="truncate">{item.projectName}</span>
                <span className={project.detailKey}>{item.projectIdentifier}</span>
              </p>
              <p className={project.deletedMeta}>
                <span className="capitalize">{item.projectType}</span>
                <span aria-hidden="true">·</span>
                <span>Deleted {formatDate(item.deletedOn)}</span>
                <span aria-hidden="true">·</span>
                <span className={project.deletedDays}>{remaining(item)}</span>
              </p>
            </div>
            <button
              type="button"
              className={project.settingsButtonGhost}
              onClick={() => handleRestore(item)}
              disabled={restoring !== null}
              aria-label={`Restore ${item.projectName}`}
            >
              <FiRotateCcw aria-hidden="true" className="mr-1.5" />
              {restoring === item.projectId ? "Restoring…" : "Restore"}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default RecentlyDeleted;
