// Normalizes any user-selected image (HEIC/HEIF, AVIF, BMP, TIFF, GIF, PNG, JPEG, WEBP, etc.)
// into a square JPEG blob suitable for upload + reliable display in <img>.
// Falls back gracefully if the browser can't decode an exotic format.

export interface NormalizedImage {
  blob: Blob;
  ext: "jpg";
  contentType: "image/jpeg";
}

const MAX_DIM = 1024;
const QUALITY = 0.9;

const loadImage = (src: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Browser cannot decode this image format. Try JPG, PNG, or WEBP."));
    img.src = src;
  });

export async function normalizeImageForUpload(file: File): Promise<NormalizedImage> {
  // Reject obviously non-image files early
  if (!file.type.startsWith("image/") && !/\.(heic|heif)$/i.test(file.name)) {
    throw new Error("Selected file is not an image.");
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);

    // Square crop centered, then scale down to MAX_DIM
    const size = Math.min(img.naturalWidth, img.naturalHeight);
    const sx = (img.naturalWidth - size) / 2;
    const sy = (img.naturalHeight - size) / 2;
    const target = Math.min(size, MAX_DIM);

    const canvas = document.createElement("canvas");
    canvas.width = target;
    canvas.height = target;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas not supported in this browser.");
    // White background so transparent PNGs convert cleanly to JPEG
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, target, target);
    ctx.drawImage(img, sx, sy, size, size, 0, 0, target, target);

    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("Failed to encode image."))),
        "image/jpeg",
        QUALITY
      )
    );

    return { blob, ext: "jpg", contentType: "image/jpeg" };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}
