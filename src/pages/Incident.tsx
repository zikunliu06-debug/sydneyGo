import { Routes, Link } from "react-router-dom";
import { ArrowRight, Bus, TriangleAlert, MessageCircle } from "lucide-react";
import { MapView } from "../components/Map";
import { incident } from "../data/demo";
import { read } from "../services/storageService";

import { Badge, Intro, stamp } from "../components/Common";
import { useSydney } from "../state";
export function Incident() {
  const { nav, location, origin, chat, resolved, setResolved, openIncident } =
    useSydney();
  return (
    <>
      <Intro eyebrow="INCIDENT DETAILS" title={incident.title}>
        {incident.location}
      </Intro>
      <div className="row">
        <Badge tone="coral">Demo incident</Badge>
        <Badge tone={resolved ? "teal" : "coral"}>
          {resolved ? "Resolved" : "Active disruption"}
        </Badge>
      </div>
      <MapView origin={origin} traffic onIncident={openIncident} />
      <section className="panel">
        <div className="delay-display">
          <TriangleAlert />
          <div>
            <strong>{resolved ? "0" : "~12"} min</strong>
            <span>Estimated extra delay · Bus 370</span>
          </div>
        </div>
        <h2>What’s happening?</h2>
        <p>
          {resolved
            ? "Traffic back to normal in this simulated scenario. The incident chat is now read-only."
            : incident.description}
        </p>
        <dl>
          <dt>Incident type</dt>
          <dd>Traffic accident / congestion</dd>
          <dt>Affected service</dt>
          <dd>Bus 370</dd>
          <dt>Information source</dt>
          <dd>{incident.source}</dd>
          <dt>Last updated</dt>
          <dd>{stamp(incident.updated)} (scenario timestamp)</dd>
          <dt>Reliability</dt>
          <dd>Illustrative estimate. Not official traffic information.</dd>
        </dl>
        <button className="primary" onClick={() => nav("/chat/broadway")}>
          <MessageCircle size={18} />
          View Live Chat
        </button>
        <button className="secondary" onClick={() => nav("/alternatives")}>
          View Alternative Routes
          <ArrowRight size={17} />
        </button>
        <Link className="text-link" to="/map">
          Back to Map
        </Link>
      </section>
      <button
        className="text-button"
        onClick={() => {
          setResolved(!resolved);
          nav(resolved ? "/incident/broadway" : "/resolved");
        }}
      >
        {resolved ? "Reopen demo incident" : "Simulate incident resolved"}
      </button>
    </>
  );
}
