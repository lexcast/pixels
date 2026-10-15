import { memo, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { fileToImage } from "../lib/image";

const FileDropzone = ({ onImages, compact = false }) => {
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(
    async (acceptedFiles, rejectedFiles) => {
      const failed = rejectedFiles.map(({ file }) => file.name);
      setLoading(true);

      const results = await Promise.allSettled(acceptedFiles.map(fileToImage));
      const images = [];
      results.forEach((result, i) => {
        if (result.status === "fulfilled") images.push(result.value);
        else failed.push(acceptedFiles[i].name);
      });

      setLoading(false);
      setErrors(failed);
      if (images.length > 0) onImages(images);
    },
    [onImages],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`group flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed text-center transition ${
          compact ? "p-4" : "p-10"
        } ${
          isDragActive
            ? "border-accent bg-accent/10"
            : "border-ink-600 hover:border-accent/60 hover:bg-ink-800/60"
        }`}
      >
        <input {...getInputProps()} aria-label="Upload images" />
        <span
          aria-hidden="true"
          className={`grid place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-ink-950 shadow-lg shadow-accent/20 transition group-hover:scale-105 ${
            compact ? "size-9 text-lg" : "size-14 text-2xl"
          }`}
        >
          ↑
        </span>
        <p className={compact ? "text-sm" : "text-base font-medium"}>
          {loading
            ? "Reading images…"
            : isDragActive
              ? "Drop the images here"
              : "Drop sprites here or click to browse"}
        </p>
        {!compact && (
          <p className="text-xs text-ink-400">
            PNG, GIF, WebP… Transparent pixels are ignored.
          </p>
        )}
      </div>
      {errors.length > 0 && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          Could not read: {errors.join(", ")}
        </p>
      )}
    </div>
  );
};

export default memo(FileDropzone);
