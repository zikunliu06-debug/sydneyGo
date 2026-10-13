export function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem("sydneygo:" + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}
export function write(key: string, value: unknown) {
  try {
    localStorage.setItem("sydneygo:" + key, JSON.stringify(value));
  } catch {
    window.dispatchEvent(
      new CustomEvent("sydneygo-storage-error", {
        detail:
          "Your browser storage is full or unavailable. Changes work in this session but could not be saved.",
      }),
    );
  }
}
export async function photoFile(file: File): Promise<string> {
  if (!file.type.startsWith("image/") || file.size > 2 * 1024 * 1024)
    throw new Error("Choose an image smaller than 2 MB.");
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read photo."));
    r.readAsDataURL(file);
  });
}
