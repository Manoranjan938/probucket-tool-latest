import { useEffect, useState } from "react";

import axios from "shared/services/axios";

/** A saved attachment, fetched with the login, or a file picked but not uploaded yet */
export type ImageSource = { attachmentId: string; file?: undefined } | { file: File; attachmentId?: undefined };

/**
 * An object URL for an image. Saved images come through the logged-in API (never a public URL), so an <img> can't load
 * them directly; the browser keeps them in its cache, since an attachment never changes.
 * "error" when it couldn't be loaded; null while loading, or when source is null (nothing to show).
 */
const useImageSrc = (source: ImageSource | null) => {
  const [src, setSrc] = useState<string | null>(null);
  const attachmentId = source?.attachmentId;
  const file = source?.file;

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    setSrc(null);

    if (!attachmentId && !file) {
      return undefined;
    }
    if (file) {
      url = URL.createObjectURL(file);
      setSrc(url);
    } else {
      axios
        .get<Blob>(`/task/attachment/${attachmentId}`, { responseType: "blob" })
        .then((res) => {
          if (!cancelled) {
            url = URL.createObjectURL(res.data);
            setSrc(url);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setSrc("error");
          }
        });
    }

    return () => {
      cancelled = true;
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [attachmentId, file]);

  return src;
};

export default useImageSrc;
