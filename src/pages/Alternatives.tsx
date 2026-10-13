import { Route } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { routes } from "../data/demo";

import { Intro, DemoNote, RouteCard } from "../components/Common";
import { useSydney } from "../state";
export function Alternatives() {
  const { nav, selected, current, select } = useSydney();
  const alternative =
    routes.find((r) => r.id !== current.id && r.id === "b") || routes[2];
  const savedMinutes = current.minutes - alternative.minutes;
  return (
    <>
      <Intro eyebrow="WAIT OR MAKE A MOVE?" title="A different way forward">
        Compare your current journey with an alternative.
      </Intro>
      <DemoNote />
      <div className="saving">
        <ArrowUpRight />
        <div>
          <b>
            {savedMinutes > 0
              ? `Alternative saves ${savedMinutes} minutes`
              : "Your current route is already faster"}
          </b>
          <p>
            {savedMinutes > 0
              ? "A little more walking. A little less waiting."
              : "Consider walking and transfers before switching."}
          </p>
        </div>
      </div>
      <h2 className="section-heading">Original Route</h2>
      <RouteCard
        route={current}
        selected
        onSelect={() => nav(`/route/${current.id}`)}
      />
      <h2 className="section-heading">Recommended Alternative</h2>
      <RouteCard
        route={alternative}
        onSelect={() => nav(`/route/${alternative.id}`)}
      />
      <button className="primary" onClick={() => select(alternative.id)}>
        Switch to alternative route
        <ArrowRight size={18} />
      </button>
      <button
        className="secondary"
        onClick={() => nav(`/route/${alternative.id}`)}
      >
        Preview alternative on map
      </button>
      <button
        className="text-button"
        onClick={() => nav(`/route/${current.id}`)}
      >
        Keep current route
      </button>
    </>
  );
}
