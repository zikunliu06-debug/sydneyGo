import { Camera } from "lucide-react";

import { photoFile } from "../services/storageService";

import { useSydney } from "../state";
export function PhotoInput({ onPhoto }: { onPhoto: (p: string) => void }) {
  const { notify } = useSydney();
  return (
    <label className="photo-control">
      <Camera size={18} />
      Attach a photo
      <input
        type="file"
        accept="image/*"
        onChange={async (e) => {
          const file = e.target.files?.[0];
          if (file)
            try {
              onPhoto(await photoFile(file));
            } catch (err) {
              notify((err as Error).message);
            }
          e.target.value = "";
        }}
      />
      <small>
        Images under 2 MB. Avoid faces, number plates and personal details.
      </small>
    </label>
  );
}
