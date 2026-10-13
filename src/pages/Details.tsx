import { Link } from "react-router-dom";
import { ArrowRight, Navigation, Bookmark } from "lucide-react";
import { MapView } from "../components/Map";
import { routes } from "../data/demo";

import { Intro, DemoNote, RouteCard } from "../components/Common";
import { useSydney } from "../state";
export function Details() {
  const {
    nav,
    location,
    origin,
    destination,
    selected,
    setSelected,
    saved,
    setSaved,
    followed,
    setFollowed,
    notify,
    openIncident,
    current,
    toggle,
    geometry,
  } = useSydney();
  const id = location.pathname.split("/").pop();
  const r = routes.find((r) => r.id === id) || current;
  return (
    <>
      <Intro eyebrow="YOUR JOURNEY" title={r.name}>
        {origin.name} → {destination.name}
      </Intro>
      <DemoNote />
      <MapView
        origin={origin}
        destination={destination}
        geometry={geometry(r)}
        onIncident={openIncident}
      />
      <RouteCard
        route={r}
        selected={selected === r.id}
        onSelect={() => {
          setSelected(r.id);
          notify("This route is now your current journey.");
        }}
      />
      <section className="panel">
        <h2>A little clarity on your ETA</h2>
        <p>
          {r.note} This demo estimate includes {r.walk} minutes of walking
          {r.delay ? ` and ${r.delay} minutes of delay` : ""}. Actual services
          and conditions may differ. Verify official service information before
          travelling.
        </p>
        <div className="journey-steps">
          <div>
            <span>1</span>
            <p>
              Start at <b>{origin.name}</b>
            </p>
          </div>
          <div>
            <span>2</span>
            <p>
              Take <b>{r.line}</b> · {r.mode}{" "}
              <small>
                Illustrative transit itinerary, not validated directions
              </small>
            </p>
          </div>
          <div>
            <span>3</span>
            <p>
              Walk {r.walk} minutes to <b>{destination.name}</b>
            </p>
          </div>
        </div>
        <button
          className="primary"
          onClick={() => {
            setSelected(r.id);
            notify(
              "Journey selected. Monitor the map for simulated disruptions.",
            );
            nav("/map");
          }}
        >
          Start this journey
          <Navigation size={18} />
        </button>
        <button
          className="secondary"
          onClick={() => toggle(saved, r.id, setSaved)}
        >
          <Bookmark size={17} />
          {saved.includes(r.id) ? "Remove saved route" : "Save route"}
        </button>
        <button
          className="text-button"
          onClick={() => toggle(followed, r.id, setFollowed)}
        >
          {followed.includes(r.id) ? "Unfollow" : "Follow"} service {r.line}
        </button>
      </section>
      <Link className="text-link" to="/routes">
        Compare all routes
        <ArrowRight size={16} />
      </Link>
    </>
  );
}
