import { useState, useEffect } from "react";

import { MapPin, Search } from "lucide-react";

import { places } from "../data/demo";

import { searchPlaces } from "../services/mapService";

import type { Place } from "../types";

import { useSydney } from "../state";
export function PlaceSearch({
  value,
  onChange,
  label,
}: {
  value: Place;
  onChange: (p: Place) => void;
  label: string;
}) {
  const { location } = useSydney();
  const [query, setQuery] = useState(value.name);
  const [results, setResults] = useState<Place[]>([]);
  const [online, setOnline] = useState("");
  const [active, setActive] = useState(false);
  useEffect(() => {
    setQuery(value.name);
    setActive(false);
  }, [value.name]);
  useEffect(() => {
    if (!active || query.length < 3) return;
    const controller = new AbortController();
    const id = setTimeout(() => {
      setOnline("Searching OpenStreetMap places…");
      searchPlaces(query, controller.signal)
        .then((p) => {
          setResults(p);
          setOnline(
            p.length
              ? "OpenStreetMap search results"
              : "Use a curated Sydney place below.",
          );
        })
        .catch((e) => {
          if (e.name !== "AbortError")
            setOnline(
              "Online search unavailable. Curated Sydney places are still available.",
            );
        });
    }, 700);
    return () => {
      clearTimeout(id);
      controller.abort();
    };
  }, [query, active]);
  const local = places.filter(
    (p) =>
      (query.toLowerCase() === "uts" && p.name.includes("Technology")) ||
      p.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="place-search">
      <label>
        {label}
        <div className="input-icon">
          <MapPin size={17} />
          <input
            value={query}
            onFocus={() => setActive(true)}
            onChange={(e) => {
              setQuery(e.target.value);
              setResults([]);
              setActive(true);
            }}
            placeholder="Search a Sydney place"
          />
        </div>
      </label>
      {active && (
        <div className="suggestions">
          {[
            ...local,
            ...results.filter((p) => !local.some((l) => l.name === p.name)),
          ].map((p, i) => (
            <button
              key={p.name + i}
              onClick={() => {
                onChange(p);
                setQuery(p.name);
                setActive(false);
              }}
            >
              <MapPin size={16} />
              <span>
                {p.name}
                <small>{p.source}</small>
              </span>
            </button>
          ))}
          {!local.length && !results.length && (
            <p>Type a Sydney location or try “UTS”.</p>
          )}
          <small>{online}</small>
          <button className="text-button" onClick={() => setActive(false)}>
            Close suggestions
          </button>
        </div>
      )}
    </div>
  );
}
