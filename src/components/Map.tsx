import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { incident } from "../data/demo";
import type { Place } from "../types";
export function MapView({
  origin,
  destination,
  geometry,
  traffic = false,
  onIncident,
}: {
  origin: Place;
  destination?: Place;
  geometry?: [number, number][];
  traffic?: boolean;
  onIncident: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!host.current) return;
    setLoading(true);
    setError("");
    let map: maplibregl.Map;
    let cancelled = false;
    try {
      map = new maplibregl.Map({
        container: host.current,
        center: origin.coords,
        zoom: 13.4,
        style: {
          version: 8,
          sources: {
            osm: {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution:
                '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors',
              maxzoom: 19,
            },
          },
          layers: [{ id: "osm", type: "raster", source: "osm" }],
        },
      });
      map.addControl(
        new maplibregl.NavigationControl({ showCompass: false }),
        "top-right",
      );
      map.on("error", () => {
        if (!cancelled) {
          setLoading(false);
          setError(
            "Map tiles could not load. Journey controls remain available. Check your connection and retry.",
          );
        }
      });
      map.on("load", () => {
        if (cancelled) return;
        setLoading(false);
        const marker = (
          coords: [number, number],
          color: string,
          label: string,
          action?: () => void,
        ) => {
          const el = document.createElement("button");
          el.className = "map-pin";
          el.style.background = color;
          el.textContent = label;
          el.setAttribute(
            "aria-label",
            label === "!"
              ? "Broadway incident"
              : label === "A"
                ? "Origin marker"
                : "Destination marker",
          );
          el.onclick = () => action?.();
          const pin = new maplibregl.Marker({ element: el })
            .setLngLat(coords)
            .addTo(map);
          if (!action)
            pin.setPopup(
              new maplibregl.Popup({ offset: 20 }).setText(
                label === "A"
                  ? `Origin: ${origin.name}`
                  : `Destination: ${destination?.name}`,
              ),
            );
        };
        marker(origin.coords, "#0c938e", "A");
        if (destination) marker(destination.coords, "#2563eb", "B");
        if (traffic) marker(incident.coords, "#dc534c", "!", onIncident);
        const line = (
          id: string,
          points: [number, number][],
          color: string,
          width: number,
        ) => {
          map.addSource(id, {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: { type: "LineString", coordinates: points },
            },
          });
          map.addLayer({
            id,
            type: "line",
            source: id,
            paint: {
              "line-color": color,
              "line-width": width,
              "line-opacity": 0.85,
            },
            layout: { "line-cap": "round", "line-join": "round" },
          });
        };
        if (geometry?.length) {
          line("journey", geometry, "#2563eb", 5);
          const bounds = new maplibregl.LngLatBounds();
          geometry.forEach((p) => bounds.extend(p));
          map.fitBounds(bounds, { padding: 55, maxZoom: 15 });
        }
        if (traffic) {
          line(
            "heavy",
            [
              [151.189, -33.885],
              [151.194, -33.8845],
              [151.202, -33.883],
            ],
            "#e45b56",
            7,
          );
          line(
            "moderate",
            [
              [151.193, -33.876],
              [151.201, -33.881],
            ],
            "#e5ac35",
            6,
          );
          line(
            "smooth",
            [
              [151.184, -33.874],
              [151.192, -33.878],
            ],
            "#36a27a",
            6,
          );
          map.on("click", "heavy", onIncident);
          map.on("mouseenter", "heavy", () => {
            map.getCanvas().style.cursor = "pointer";
          });
          map.on("mouseleave", "heavy", () => {
            map.getCanvas().style.cursor = "";
          });
        }
      });
    } catch {
      setLoading(false);
      setError(
        "Interactive maps require WebGL. Your browser cannot initialise the map; journey controls remain available.",
      );
    }
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [origin, destination, geometry, traffic, onIncident]);
  return (
    <div className="map-wrap">
      <div
        ref={host}
        className="map-canvas"
        aria-label="Interactive Sydney map"
      />
      {loading && <span className="map-loading">Loading Sydney map…</span>}
      {error && (
        <div className="map-error" role="status">
          {error}
        </div>
      )}
      <span className="map-label">
        {traffic ? "SIMULATED TRAFFIC" : "SYDNEY · OPENSTREETMAP"}
      </span>
    </div>
  );
}
