import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
  places,
  routes,
  incident,
  messages as initialMessages,
  posts as initialPosts,
} from "./data/demo";
import { read, write } from "./services/storageService";

import type { User, Place, Message, Post, JourneyRoute } from "./types";
export function useStored<T>(
  key: string,
  fallback: T,
): [T, (value: T | ((previous: T) => T)) => void] {
  const [value, setValue] = useState<T>(() => read(key, fallback));
  const save = (next: T | ((previous: T) => T)) => {
    setValue((previous) => {
      const result =
        typeof next === "function" ? (next as (p: T) => T)(previous) : next;
      write(key, result);
      return result;
    });
  };
  return [value, save];
}
export function useSydneyGo() {
  const nav = useNavigate();
  const location = useLocation();
  const [user, setUser] = useStored<User | null>("user", null);
  const [origin, setOrigin] = useStored<Place>("origin", places[0]);
  const [destination, setDestination] = useStored<Place>(
    "destination",
    places[1],
  );
  const [selected, setSelected] = useStored<string>("selected", "a");
  const [chat, setChat] = useStored<Message[]>("messages", initialMessages);
  const [posts, setPosts] = useStored<Post[]>("posts", initialPosts);
  const [resolved, setResolved] = useStored<boolean>("resolved", false);
  const [saved, setSaved] = useStored<string[]>("saved", []);
  const [followed, setFollowed] = useStored<string[]>("followed", []);
  const [reports, setReports] = useStored<string[]>("reports", []);
  const [home, setHome] = useStored<Place | null>("home", null);
  const [toast, setToast] = useState("");
  useEffect(() => {
    const handler = (e: Event) => setToast((e as CustomEvent<string>).detail);
    window.addEventListener("sydneygo-storage-error", handler);
    document.documentElement.classList.toggle(
      "compact",
      read("compact", false),
    );
    return () => window.removeEventListener("sydneygo-storage-error", handler);
  }, []);
  const [mapKey, setMapKey] = useState(0);
  const [confirmOrigin, setConfirmOrigin] = useState(false);
  const [road, setRoad] = useState<{
    geometry: [number, number][];
    minutes: number;
    distance: number;
  } | null>(null);
  const [roadStatus, setRoadStatus] = useState("");
  const notify = (text: string) => setToast(text);
  useEffect(() => {
    if (toast) {
      const id = setTimeout(() => setToast(""), 5500);
      return () => clearTimeout(id);
    }
  }, [toast]);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  const openIncident = useCallback(() => nav("/incident/broadway"), [nav]);
  const current = routes.find((r) => r.id === selected) || routes[0];
  const toggle = (items: string[], id: string, save: (x: string[]) => void) =>
    save(items.includes(id) ? items.filter((x) => x !== id) : [...items, id]);
  const report = (id: string) => {
    if (reports.includes(id)) {
      notify("You have already reported this item.");
      return;
    }
    setReports([...reports, id]);
    notify(
      "Report saved on this device. This prototype has no moderation backend.",
    );
  };
  const select = (id: string) => {
    setSelected(id);
    nav(`/route/${id}`);
  };
  const plan = () => {
    if (!confirmOrigin) {
      notify("Please confirm your origin before planning.");
      return;
    }
    setRoad(null);
    setRoadStatus("");
    nav("/routes");
  };
  const geometry = (r: JourneyRoute) => [
    origin.coords,
    ...r.geometry.slice(1, -1),
    destination.coords,
  ];
  return {
    nav,
    location,
    user,
    setUser,
    origin,
    setOrigin,
    destination,
    setDestination,
    selected,
    setSelected,
    chat,
    setChat,
    posts,
    setPosts,
    resolved,
    setResolved,
    saved,
    setSaved,
    followed,
    setFollowed,
    reports,
    setReports,
    home,
    setHome,
    toast,
    setToast,
    mapKey,
    setMapKey,
    confirmOrigin,
    setConfirmOrigin,
    road,
    setRoad,
    roadStatus,
    setRoadStatus,
    notify,
    openIncident,
    current,
    toggle,
    report,
    select,
    plan,
    geometry,
  };
}
export const SydneyContext = createContext<ReturnType<
  typeof useSydneyGo
> | null>(null);
export function useSydney() {
  const state = useContext(SydneyContext);
  if (!state) throw new Error("SydneyGo context unavailable");
  return state;
}
