import { useState, type FormEvent } from "react";
import { Route } from "react-router-dom";
import { ArrowRight, Bus } from "lucide-react";

import { categories } from "../data/demo";

import type { Post } from "../types";
import { Intro } from "../components/Common";
import { useSydney } from "../state";
import { PhotoInput } from "../components/PhotoInput";
export function CreatePost() {
  const { nav, location, user, posts, setPosts, saved, notify, select } =
    useSydney();
  const [photo, setPhoto] = useState("");
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const p: Post = {
      id: crypto.randomUUID(),
      author: user?.name || "Guest commuter",
      route: String(d.get("route")).trim(),
      category: String(d.get("category")),
      location: String(d.get("location")).trim(),
      text: String(d.get("text")).trim(),
      time: new Date().toISOString(),
      photo: photo || undefined,
      helpful: [],
      comments: [],
    };
    if (!p.text || !p.route || !p.location)
      return notify("Please complete the post fields.");
    setPosts([p, ...posts]);
    nav(`/community/post/${p.id}`);
  };
  return (
    <>
      <Intro eyebrow="SHARE A LITTLE LOCAL KNOWLEDGE" title="Create a post">
        Keep it useful, kind and free of personal information.
      </Intro>
      <form onSubmit={submit} className="panel stack">
        <label>
          Route or service
          <input
            name="route"
            required
            maxLength={30}
            placeholder="e.g. Bus 370"
          />
        </label>
        <label>
          Category
          <select name="category">
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </label>
        <label>
          Location
          <input
            name="location"
            required
            maxLength={100}
            placeholder="e.g. Broadway"
          />
        </label>
        <label>
          Your experience
          <textarea
            name="text"
            required
            maxLength={2000}
            placeholder="What would help another commuter?"
          />
        </label>
        <PhotoInput onPhoto={setPhoto} />
        {photo && (
          <div className="photo-preview">
            <img src={photo} alt="Post attachment" />
            <button type="button" onClick={() => setPhoto("")}>
              Remove photo
            </button>
          </div>
        )}
        <button className="primary">
          Publish locally
          <ArrowRight size={18} />
        </button>
        <p className="fine">This post is saved on your device only.</p>
      </form>
    </>
  );
}
