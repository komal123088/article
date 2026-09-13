// Resizes and compresses an image in the browser before it's sent to the
// server. This fixes two real problems:
//  1. Vercel's serverless functions reject request bodies over ~4.5MB —
//     an uncompressed phone photo (8-12MB) blows past that instantly.
//  2. Smaller images upload faster and make the site feel snappier.
export function compressImage(
  file: File,
  maxWidth = 1600,
  quality = 0.8,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not process image."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
