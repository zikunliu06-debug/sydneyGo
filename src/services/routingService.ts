import type { Place } from "../types";
export async function roadRoute(
  origin: Place,
  destination: Place,
  signal: AbortSignal,
) {
  const url = `https://router.project-osrm.org/route/v1/driving/${origin.coords.join(",")};${destination.coords.join(",")}?overview=full&geometries=geojson`;
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Road routing unavailable");
  const data = await response.json();
  if (data.code !== "Ok" || !data.routes?.length)
    throw new Error("No road route available");
  return {
    geometry: data.routes[0].geometry.coordinates as [number, number][],
    minutes: Math.ceil(data.routes[0].duration / 60),
    distance: data.routes[0].distance,
  };
}
