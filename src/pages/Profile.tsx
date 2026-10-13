import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  UserRound,
  Bus,
  ChevronRight,
  Plus,
  Bookmark,
  Check,
  LogOut,
  SlidersHorizontal,
} from "lucide-react";

import { routes, incident } from "../data/demo";
import { read, write } from "../services/storageService";

import type { User } from "../types";
import { Badge, Intro } from "../components/Common";
import { useSydney, useStored } from "../state";
export function Profile({ setup = false }: { setup?: boolean }) {
  const {
    nav,
    user,
    setUser,
    posts,
    setResolved,
    saved,
    followed,
    home,
    notify,
    toggle,
    plan,
  } = useSydney();
  const [editing, setEditing] = useState(setup);
  const [compact, setCompact] = useStored<boolean>("compact", false);
  return (
    <>
      <Intro
        eyebrow="YOUR SYDNEYGO"
        title={setup ? "Make yourself at home." : "A journey that’s yours."}
      >
        Your details and favourite ways around Sydney.
      </Intro>
      <section className="profile-banner">
        <div className="avatar large">{(user?.name || "G").slice(0, 1)}</div>
        <h2>{user?.name || "Guest commuter"}</h2>
        <p>
          {user?.guest ? "Guest access · no account required" : user?.email}
        </p>
        <Badge tone="teal">{user?.bio || "Exploring Sydney"}</Badge>
      </section>
      {editing ? (
        <form
          className="panel stack"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            const updated = {
              ...(user || { guest: true }),
              name: String(d.get("name")).trim(),
              email: String(d.get("email")).trim(),
              bio: String(d.get("bio")).trim(),
            } as User;
            setUser(updated);
            if (!updated.guest)
              write("profiles", {
                ...read<Record<string, User>>("profiles", {}),
                [user!.email]: updated,
              });
            setEditing(false);
            notify("Profile saved on this device.");
            if (setup) nav("/plan");
          }}
        >
          <label>
            Display name
            <input
              name="name"
              required
              maxLength={50}
              defaultValue={user?.name}
            />
          </label>
          <label>
            Email
            <input
              name="email"
              type="email"
              defaultValue={user?.email}
              readOnly={!user?.guest}
            />
          </label>
          <label>
            A little about you
            <input name="bio" maxLength={150} defaultValue={user?.bio} />
          </label>
          <button className="primary">
            Save profile
            <Check size={18} />
          </button>
        </form>
      ) : (
        <button className="secondary" onClick={() => setEditing(true)}>
          Edit profile
          <UserRound size={17} />
        </button>
      )}
      <section className="panel">
        <h2>
          <Bookmark size={18} />
          Saved routes
        </h2>
        {saved.length ? (
          saved.map((id) => (
            <button
              className="list-button"
              key={id}
              onClick={() => nav(`/route/${id}`)}
            >
              {routes.find((r) => r.id === id)?.name}
              <ChevronRight size={17} />
            </button>
          ))
        ) : (
          <p>No saved routes yet. Save one from its journey details.</p>
        )}
        <h2>
          <Bus size={18} />
          Followed services
        </h2>
        {followed.length ? (
          followed.map((id) => (
            <button
              className="list-button"
              key={id}
              onClick={() => nav(`/route/${id}`)}
            >
              Service {routes.find((r) => r.id === id)?.line}
              <ChevronRight size={17} />
            </button>
          ))
        ) : (
          <p>Follow a service from its route details.</p>
        )}
      </section>
      <section className="panel">
        <h2>Your posts</h2>
        {posts
          .filter((p) => !p.demo && p.author === user?.name)
          .map((p) => (
            <Link
              className="list-button"
              key={p.id}
              to={`/community/post/${p.id}`}
            >
              {p.route} · {p.text.slice(0, 40)}
              <ChevronRight size={16} />
            </Link>
          ))}
        <Link className="text-link" to="/community/new">
          Share a new post
          <Plus size={16} />
        </Link>
      </section>
      <section className="panel">
        <h2>
          <SlidersHorizontal size={18} />
          Settings
        </h2>
        <label className="checkline">
          <input
            type="checkbox"
            checked={compact}
            onChange={(e) => {
              setCompact(e.target.checked);
              document.documentElement.classList.toggle(
                "compact",
                e.target.checked,
              );
            }}
          />
          Compact spacing
        </label>
        <p className="fine">
          Local prototype · no tracking or server synchronisation. Map, search
          and routing providers receive network requests.
        </p>
        <button
          className="text-button"
          onClick={() => {
            setResolved(false);
            notify(
              "Demo incident reopened. Your messages and posts were preserved.",
            );
          }}
        >
          Reset demo incident status
        </button>
      </section>
      <button
        className="secondary"
        onClick={() => {
          setUser(null);
          nav("/");
        }}
      >
        <LogOut size={17} />
        {user?.guest ? "Leave guest session" : "Log out"}
      </button>
      {user?.guest && (
        <Link className="text-link" to="/signup">
          Create a local account
          <ArrowRight size={16} />
        </Link>
      )}
    </>
  );
}
