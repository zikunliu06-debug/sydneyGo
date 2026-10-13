import type { Place } from "../types";
export function locate(): Promise<Place> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation)
      return reject(
        new Error("Location is unavailable. Choose an origin manually."),
      );
    navigator.geolocation.getCurrentPosition(
      (p) =>
        resolve({
          name: "Current location",
          coords: [p.coords.longitude, p.coords.latitude],
          source: "Browser geolocation",
        }),
      () =>
        reject(
          new Error(
            "Location permission was denied or timed out. Using the Sydney demo origin; you can edit it.",
          ),
        ),
      { timeout: 10000, maximumAge: 60000 },
    );
  });
}
