import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon, Film } from "lucide-react";
import { uploadToCloudinary, cloudinaryConfigured, type CloudinaryAsset } from "@/lib/cloudinary";

type Props = {
  folder: string;
  accept?: string;
  label?: string;
  currentUrl?: string | null;
  onUploaded: (asset: CloudinaryAsset) => void;
  onClear?: () => void;
  compact?: boolean;
};

export function CloudinaryUploader({
  folder,
  accept = "image/*,video/*",
  label = "Drop file or click to upload",
  currentUrl,
  onUploaded,
  onClear,
  compact,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const configured = cloudinaryConfigured();

  const handleFile = async (file: File) => {
    setError(null);
    setProgress(0);
    try {
      const asset = await uploadToCloudinary(file, folder, setProgress);
      onUploaded(asset);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setProgress(null);
    }
  };

  const isVideo = !!currentUrl && /\.(mp4|webm|mov|m4v)$/i.test(currentUrl);
  const previewH = compact ? "h-24" : "h-36";

  return (
    <div className="w-full">
      {currentUrl ? (
        <div className="relative group rounded-3xl border border-ink/12 overflow-hidden bg-paper-deep">
          {isVideo ? (
            <video src={currentUrl} className={`w-full ${previewH} object-cover`} muted playsInline />
          ) : (
            <img src={currentUrl} alt="" className={`w-full ${previewH} object-cover`} />
          )}
          <div className="absolute top-2 right-2 flex gap-1.5">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 h-7 rounded-full text-[10px] tracking-[0.2em] uppercase bg-paper text-ink hover:bg-paper-fold transition-colors border border-ink/10"
            >
              Replace
            </button>
            {onClear && (
              <button
                type="button"
                onClick={onClear}
                className="w-7 h-7 rounded-full bg-paper text-ink hover:bg-paper-fold inline-flex items-center justify-center border border-ink/10 transition-colors"
                aria-label="Remove"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="absolute bottom-2 left-2 inline-flex items-center gap-1.5 px-2 h-6 rounded-full bg-ink/70 text-paper text-[10px] tracking-[0.18em] uppercase font-mono">
            {isVideo ? <Film className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
            {folder.split("/").pop()}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault(); setDrag(false);
            const f = e.dataTransfer.files?.[0];
            if (f) handleFile(f);
          }}
          className={`w-full ${compact ? "h-24" : "h-32"} rounded-3xl border border-dashed transition-colors flex flex-col items-center justify-center gap-2 text-ink/55 ${
            drag
              ? "border-ink bg-ink/[0.05] text-ink"
              : "border-ink/15 hover:border-ink/40 hover:bg-ink/[0.03] hover:text-ink/80"
          }`}
        >
          {progress !== null ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-ink" />
              <span className="text-[10.5px] tracking-[0.22em] uppercase font-mono">
                Uploading · {progress}%
              </span>
              <div className="w-32 h-0.5 rounded-full bg-ink/10 overflow-hidden">
                <div className="h-full bg-ink transition-all" style={{ width: `${progress}%` }} />
              </div>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5" />
              <span className="text-[11px] tracking-[0.22em] uppercase font-mono">{label}</span>
              <span className="text-[9.5px] tracking-[0.2em] uppercase text-ink/35 font-mono">
                → cloudinary / {folder}
              </span>
            </>
          )}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />

      {!configured && (
        <p className="mt-2 text-[10px] tracking-[0.18em] uppercase text-amber-700 font-mono">
          Cloudinary env vars missing
        </p>
      )}
      {error && (
        <p className="mt-2 text-[10px] tracking-[0.18em] uppercase text-[oklch(0.5_0.18_28)] font-mono">
          {error}
        </p>
      )}
    </div>
  );
}
