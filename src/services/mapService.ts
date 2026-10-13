import type { Place } from "../types";
export async function searchPlaces(
  query: string,
  signal: AbortSignal,
): Promise<Place[]> {
  const url = new URL("https://photon.komoot.io/api/");
  url.search = new URLSearchParams({
    q: query,
    lat: "-33.87",
    lon: "151.20",
    limit: "6",
  }).toString();
  const response = await fetch(url, {
    signal: AbortSignal.any([signal, AbortSignal.timeout(10000)]),
  });
  if (!response.ok)
    throw new Error(
      "Online search unavailable. Use the Sydney suggestions below.",
    );
  const data = await response.json();
  return data.features
    .filter(
      (f: any) =>
        f.geometry.coordinates[0] > 150.5 &&
        f.geometry.coordinates[0] < 151.5 &&
        f.geometry.coordinates[1] > -34.3 &&
        f.geometry.coordinates[1] < -33.3,
    )
    .map((f: any) => ({
      name: [f.properties.name, f.properties.street, f.properties.city]
        .filter(Boolean)
        .join(", "),
      coords: f.geometry.coordinates,
      source: "Photon · OpenStreetMap",
    }));
}
