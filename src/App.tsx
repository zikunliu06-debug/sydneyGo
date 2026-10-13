import { Routes, Route, NavLink, Link, Navigate } from "react-router-dom";
import {
  ArrowRight,
  ArrowLeft,
  MapPin,
  Navigation,
  Map as MapIcon,
  Users,
  UserRound,
  RefreshCw,
  Bus,
  Route as RouteIcon,
  CheckCircle2,
} from "lucide-react";

import { routes, incident } from "./data/demo";
import { read } from "./services/storageService";

import { SydneyContext, useSydneyGo } from "./state";
import { Badge, Intro } from "./components/Common";
import { Auth } from "./pages/Auth";
import { Plan } from "./pages/Plan";
import { Results } from "./pages/Results";
import { Details } from "./pages/Details";
import { Traffic } from "./pages/Traffic";
import { Incident } from "./pages/Incident";
import { Alternatives } from "./pages/Alternatives";
import { Chat } from "./pages/Chat";
import { Community } from "./pages/Community";
import { CreatePost } from "./pages/CreatePost";
import { PostDetails } from "./pages/PostDetails";
import { Profile } from "./pages/Profile";
export default function App() {
  const state = useSydneyGo();
  const {
    nav,
    location,
    setUser,
    destination,
    chat,
    resolved,
    reports,
    toast,
    setToast,
    setMapKey,
    road,
    notify,
    plan,
  } = state;
  const welcome =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup";
  return (
    <SydneyContext.Provider value={state}>
      <div className="phone-shell">
        <header>
          <Link to="/plan" className="brand">
            <span>
              <Navigation size={22} fill="currentColor" />
            </span>
            SydneyGo
          </Link>
          <div className="header-right">
            <span>SYDNEY, AU</span>
            <button
              aria-label="Refresh available data"
              onClick={() => {
                setMapKey((k) => k + 1);
                notify(
                  "Map reloaded. Demo transport reports retain their original scenario timestamps.",
                );
              }}
            >
              <RefreshCw size={18} />
            </button>
          </div>
        </header>
        {!welcome && (
          <div className="subbar">
            <button
              className="back"
              onClick={() => {
                if (window.history.state?.idx > 0) nav(-1);
                else nav("/plan");
              }}
            >
              <ArrowLeft size={16} />
              Back
            </button>
            <span>UNIVERSITY PROTOTYPE</span>
          </div>
        )}
        {toast && (
          <div className="toast" role="status">
            {toast}
            <button
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
            >
              ×
            </button>
          </div>
        )}
        <div className={welcome ? "" : "page-content"}>
          <Routes>
            <Route
              path="/"
              element={
                <main className="welcome">
                  <div className="welcome-top">
                    <Badge tone="teal">A clearer commute starts here</Badge>
                    <h1>
                      Your city.
                      <br />
                      Your journey.
                      <br />
                      <em>Less uncertainty.</em>
                    </h1>
                    <p>
                      Know your options, understand the delays, and keep moving
                      through Sydney.
                    </p>
                  </div>
                  <div className="welcome-art">
                    <div className="art-road r1" />
                    <div className="art-road r2" />
                    <div className="art-road r3" />
                    <div className="art-stop one">
                      <Bus />
                      370
                    </div>
                    <div className="art-stop two">
                      <MapPin />
                      UTS
                    </div>
                    <span className="art-caption">
                      <CheckCircle2 size={16} />A little more confidence, every
                      day.
                    </span>
                  </div>
                  <div className="welcome-bottom">
                    <Link className="primary" to="/login">
                      Let’s get moving
                      <ArrowRight size={19} />
                    </Link>
                    <button
                      className="secondary"
                      onClick={() => {
                        setUser({
                          name: "Guest commuter",
                          email: "",
                          bio: "Exploring Sydney",
                          guest: true,
                        });
                        nav("/plan");
                      }}
                    >
                      Continue as Guest
                    </button>
                    <p>
                      New around here?{" "}
                      <Link to="/signup">Create an account</Link>
                    </p>
                    <small>
                      Real maps. Clearly labelled demo transport information.
                    </small>
                  </div>
                </main>
              }
            />
            <Route path="/login" element={<Auth />} />
            <Route path="/signup" element={<Auth signup />} />
            <Route path="/profile/setup" element={<Profile setup />} />
            <Route path="/plan" element={<Plan />} />
            <Route path="/destination" element={<Plan />} />
            <Route path="/routes" element={<Results />} />
            <Route path="/route/:id" element={<Details />} />
            <Route path="/map" element={<Traffic />} />
            <Route path="/incident/:id" element={<Incident />} />
            <Route path="/alternatives" element={<Alternatives />} />
            <Route path="/chat/:id" element={<Chat />} />
            <Route
              path="/resolved"
              element={
                <>
                  <Intro
                    eyebrow="INCIDENT RESOLVED"
                    title="Traffic back to normal."
                  >
                    Broadway · Bus 370 · simulated scenario
                  </Intro>
                  <div className="resolved-symbol">
                    <CheckCircle2 size={60} />
                  </div>
                  <section className="panel">
                    <h2>A little breathing room.</h2>
                    <p>
                      The demo congestion has cleared. The incident chat is
                      closed and remains available to read. No official live
                      status is implied.
                    </p>
                    <Link className="primary" to="/chat/broadway">
                      Read incident chat
                    </Link>
                    <Link className="secondary" to="/map">
                      Back to Map
                    </Link>
                  </section>
                </>
              }
            />
            <Route path="/community" element={<Community />} />
            <Route path="/community/new" element={<CreatePost />} />
            <Route path="/community/post/:id" element={<PostDetails />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
        {!welcome && (
          <nav className="bottom-nav" aria-label="Main navigation">
            {[
              {
                path: "/plan",
                text: "Plan",
                icon: RouteIcon,
                extra: ["/routes", "/route/", "/alternatives", "/destination"],
              },
              {
                path: "/map",
                text: "Map",
                icon: MapIcon,
                extra: ["/incident/", "/chat/", "/resolved"],
              },
              { path: "/community", text: "Community", icon: Users, extra: [] },
              { path: "/profile", text: "Profile", icon: UserRound, extra: [] },
            ].map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive ||
                  item.extra.some((p) => location.pathname.startsWith(p))
                    ? "active"
                    : ""
                }
              >
                <item.icon size={21} />
                <span>{item.text}</span>
              </NavLink>
            ))}
          </nav>
        )}
      </div>
    </SydneyContext.Provider>
  );
}
