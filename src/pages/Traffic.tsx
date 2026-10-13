import { Bus, TriangleAlert, ChevronRight } from "lucide-react";
import { MapView } from "../components/Map";
import { incident } from "../data/demo";

import { Badge, Intro, DemoNote, stamp } from "../components/Common";
import { useSydney } from "../state";
export function Traffic() {
  const {
    nav,
    origin,
    destination,
    selected,
    resolved,
    mapKey,
    openIncident,
    current,
    report,
    geometry,
  } = useSydney();
  return (
    <>
      <Intro eyebrow="KNOW BEFORE YOU GO" title="The city at a glance">
        Road conditions around your Sydney journey.
      </Intro>
      <DemoNote />
      <MapView
        key={mapKey}
        origin={origin}
        destination={destination}
        geometry={geometry(current)}
        traffic
        onIncident={openIncident}
      />
      <section className="legend" aria-label="Traffic colour legend">
        <span>
          <i className="green-dot" />
          Smooth
        </span>
        <span>
          <i className="yellow-dot" />
          Moderate
        </span>
        <span>
          <i className="red-dot" />
          Heavy
        </span>
        <small>Simulated overlays · blue is your selected route</small>
      </section>
      <div className="row between section-heading">
        <h2>On your radar</h2>
        <Badge tone={resolved ? "teal" : "coral"}>
          {resolved ? "Resolved" : "1 demo incident"}
        </Badge>
      </div>
      <button className="incident-card" onClick={openIncident}>
        <span className="alert-circle">
          <TriangleAlert />
        </span>
        <div>
          <Badge tone="coral">Demo incident · Bus 370</Badge>
          <h3>{incident.title}</h3>
          <p>
            {resolved ? "Traffic back to normal" : "+12 min estimated delay"} ·
            Broadway
          </p>
          <small>
            Source: simulated report · Updated {stamp(incident.updated)}
          </small>
        </div>
        <ChevronRight size={18} />
      </button>
      <section className="panel">
        <h3>Your selected journey</h3>
        <p>
          {current.name} · {current.minutes} min total · simulated
        </p>
        <button
          className="secondary"
          onClick={() => nav(`/route/${current.id}`)}
        >
          View journey details
        </button>
      </section>
    </>
  );
}
