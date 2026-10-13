import { Route } from "react-router-dom";
import {
  Bus,
  TrainFront,
  Footprints,
  Clock,
  ArrowUpRight,
  TriangleAlert,
  ChevronRight,
} from "lucide-react";

import type { JourneyRoute } from "../types";
export const stamp = (t: string) =>
  new Date(t).toLocaleString("en-AU", {
    timeZone: "Australia/Sydney",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
export const arrival = (m: number) =>
  new Date(Date.now() + m * 60000).toLocaleTimeString("en-AU", {
    timeZone: "Australia/Sydney",
    hour: "2-digit",
    minute: "2-digit",
  });
export function Badge({
  children,
  tone = "blue",
}: {
  children: React.ReactNode;
  tone?: string;
}) {
  return <span className={`badge ${tone}`}>{children}</span>;
}
export function Intro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="intro">
      <div className="eyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      {children && <p>{children}</p>}
    </div>
  );
}
export function DemoNote() {
  return (
    <div className="notice">
      <TriangleAlert size={15} />
      <span>Simulated transport data · not live bus arrivals</span>
    </div>
  );
}
export function RouteCard({
  route,
  onSelect,
  selected = false,
}: {
  route: JourneyRoute;
  onSelect: () => void;
  selected?: boolean;
}) {
  return (
    <button
      className={`route-card ${route.id === "b" ? "fastest" : ""} ${selected ? "chosen" : ""}`}
      onClick={onSelect}
    >
      <div className="row between">
        <span className="transport-icon">
          {route.mode.includes("rail") ? (
            <TrainFront size={21} />
          ) : (
            <Bus size={21} />
          )}
        </span>
        {route.id === "b" ? (
          <Badge tone="teal">Fastest Route</Badge>
        ) : (
          <Badge tone={route.delay ? "coral" : "grey"}>
            {route.delay ? `+${route.delay} min delay` : "No demo delay"}
          </Badge>
        )}
      </div>
      <h3>
        {route.name}
        <ArrowUpRight size={18} />
      </h3>
      <div className="route-time">
        <strong>
          {route.minutes}
          <small> min</small>
        </strong>
        <span>
          Total Journey Time
          <br />
          <b>Arrive ~{arrival(route.minutes)}</b>
        </span>
      </div>
      <div className="route-metrics">
        <span>
          <Clock size={14} />
          {route.bus === null
            ? "Next bus: not applicable"
            : `Next Bus Arrival: ~${route.bus} min`}
        </span>
        <span>
          <Footprints size={14} />
          {route.walk} min walk · {route.transfers} transfer
          {route.transfers !== 1 ? "s" : ""}
        </span>
      </div>
      <p>{route.note}</p>
      <div className="card-footer">
        {selected ? "Selected journey" : "View route details"}
        <ChevronRight size={16} />
      </div>
    </button>
  );
}
