import { Clock } from "lucide-react";
import { MapView } from "../components/Map";
import { routes } from "../data/demo";

import { roadRoute } from "../services/routingService";

import { Intro, DemoNote, RouteCard } from "../components/Common";
import { useSydney } from "../state";
export function Results() {
  const {
    origin,
    destination,
    selected,
    road,
    setRoad,
    roadStatus,
    setRoadStatus,
    openIncident,
    select,
    geometry,
  } = useSydney();
  return (
    <>
      <Intro eyebrow="A CLEARER WAY THERE" title="Choose your journey">
        {origin.name} → {destination.name}
      </Intro>
      <DemoNote />
      <div className="notice plain">
        <Clock size={17} />
        <span>
          All timings below are simulated. Total time includes waiting, walking
          and the shown delay. Arrival is calculated from now, not a live
          prediction.
        </span>
      </div>
      <div className="stack">
        {routes.map((r) => (
          <RouteCard
            key={r.id}
            route={r}
            selected={r.id === selected}
            onSelect={() => select(r.id)}
          />
        ))}
      </div>
      <section className="panel">
        <h3>Want a real road reference?</h3>
        <p>
          OSRM provides a driving route, not bus schedules or walking
          directions. It cannot validate these demo transit options.
        </p>
        <button
          className="secondary"
          disabled={roadStatus === "Loading road route…"}
          onClick={async () => {
            setRoadStatus("Loading road route…");
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 12000);
            try {
              const result = await roadRoute(
                origin,
                destination,
                controller.signal,
              );
              setRoad(result);
              setRoadStatus(
                `Real road estimate: ${result.minutes} min driving · ${(result.distance / 1000).toFixed(1)} km. No live traffic.`,
              );
            } catch {
              setRoadStatus(
                "OSRM is unavailable. The three demo journey options remain usable.",
              );
            } finally {
              clearTimeout(timeout);
            }
          }}
        >
          Get real road reference
        </button>
        {roadStatus && <p role="status">{roadStatus}</p>}
        {road && (
          <MapView
            origin={origin}
            destination={destination}
            geometry={road.geometry}
            onIncident={openIncident}
          />
        )}
      </section>
    </>
  );
}
