import { useState } from "react";
import { Route, Link } from "react-router-dom";
import {
  ArrowRight,
  Navigation,
  Map as MapIcon,
  Users,
  Bus,
  ArrowUpRight,
  TriangleAlert,
  Route as RouteIcon,
} from "lucide-react";
import { MapView } from "../components/Map";
import { incident, places } from "../data/demo";

import { locate } from "../services/locationService";

import { Intro } from "../components/Common";
import { useSydney } from "../state";
import { PlaceSearch } from "../components/PlaceSearch";
export function Plan() {
  const {
    location,
    origin,
    setOrigin,
    destination,
    setDestination,
    saved,
    home,
    setHome,
    mapKey,
    confirmOrigin,
    setConfirmOrigin,
    notify,
    openIncident,
    plan,
  } = useSydney();
  const [locating, setLocating] = useState(false);
  return (
    <>
      <Intro eyebrow="MAKE YOUR NEXT MOVE" title="Where are we heading?">
        Your journey, with a little more certainty.
      </Intro>
      <div className="map-home">
        <MapView
          key={mapKey}
          origin={origin}
          destination={destination}
          onIncident={openIncident}
        />
        <div className="map-caption">
          <span className="pulse" />
          Explore Sydney
        </div>
      </div>
      <section className="panel planner">
        <div className="row between">
          <h2>Plan your journey</h2>
          <RouteIcon size={20} color="#178f92" />
        </div>
        <PlaceSearch
          label="From · your origin"
          value={origin}
          onChange={(p) => {
            setOrigin(p);
            setConfirmOrigin(false);
          }}
        />
        <div className="row small-actions">
          <button
            onClick={async () => {
              setLocating(true);
              try {
                setOrigin(await locate());
                setConfirmOrigin(false);
                notify(
                  "Location found. Confirm it before planning; it is not automatically your home.",
                );
              } catch (e) {
                setOrigin(places[0]);
                setConfirmOrigin(false);
                notify((e as Error).message);
              } finally {
                setLocating(false);
              }
            }}
          >
            <Navigation size={13} />
            {locating ? "Locating…" : "Use my location"}
          </button>
          <button
            onClick={() => {
              setHome({ ...origin, name: "Saved Home" });
              notify("Current origin saved as Home.");
            }}
          >
            Save as Home
          </button>
          {home && (
            <button
              onClick={() => {
                setOrigin(home);
                setConfirmOrigin(false);
              }}
            >
              Use Home
            </button>
          )}
        </div>
        <PlaceSearch
          label="To · your destination"
          value={destination}
          onChange={setDestination}
        />
        <label className="checkline">
          <input
            type="checkbox"
            checked={confirmOrigin}
            onChange={(e) => setConfirmOrigin(e.target.checked)}
          />
          <span>
            I confirm my origin: <b>{origin.name}</b>
          </span>
        </label>
        <p className="fine">
          {origin.source} · You can edit both locations above.
        </p>
        <button className="primary" onClick={plan}>
          Plan Route
          <ArrowRight size={18} />
        </button>
      </section>
      <section className="insight">
        <span className="icon-soft">
          <TriangleAlert size={20} />
        </span>
        <div>
          <h3>A heads-up for Broadway</h3>
          <p>Bus 370 has a simulated 12-minute delay.</p>
          <Link to="/incident/broadway">
            See what’s happening <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>
      <div className="row between section-heading">
        <h2>Your city, connected</h2>
        <span>EXPLORE</span>
      </div>
      <div className="shortcut-grid">
        <Link to="/map">
          <MapIcon />
          <b>Road conditions</b>
          <small>See the bigger picture</small>
        </Link>
        <Link to="/community">
          <Users />
          <b>Community</b>
          <small>Learn from locals</small>
        </Link>
      </div>
    </>
  );
}
