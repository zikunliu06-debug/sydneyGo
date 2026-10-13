import { useState } from "react";
import { Link } from "react-router-dom";
import {
  MapPin,
  Users,
  Search,
  MessageCircle,
  Plus,
  Flag,
  Heart,
} from "lucide-react";

import { places, routes, incident, categories } from "../data/demo";

import { Badge, Intro, stamp } from "../components/Common";
import { useSydney } from "../state";
export function Community() {
  const { location, chat, posts, setPosts, report } = useSydney();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const visible = posts.filter(
    (p) =>
      (category === "All" || p.category === category) &&
      `${p.text} ${p.route} ${p.location} ${p.author}`
        .toLowerCase()
        .includes(search.toLowerCase()),
  );
  return (
    <>
      <Intro
        eyebrow="THE LONGER CONVERSATION"
        title="Your commute. Our community."
      >
        Tips, experiences and a little local knowledge.
      </Intro>
      <div className="notice plain">
        <Users size={17} />
        <span>
          Long-term transport discussions. For an active incident, use{" "}
          <Link to="/chat/broadway">Live Chat</Link>. Demo and your own local
          posts only.
        </span>
      </div>
      <div className="input-icon">
        <Search size={18} />
        <input
          aria-label="Search community posts"
          placeholder="Search routes, places or tips"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <div className="filters">
        {["All", ...categories].map((c) => (
          <button
            className={c === category ? "active" : ""}
            key={c}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>
      <div className="row between section-heading">
        <h2>From the community</h2>
        <Link className="mini-primary" to="/community/new">
          <Plus size={16} />
          New post
        </Link>
      </div>
      {visible.length === 0 && (
        <section className="panel">
          <h3>No posts found</h3>
          <p>Try another search or share your own experience.</p>
        </section>
      )}
      {visible.map((p) => (
        <article className="post-card" key={p.id}>
          <div className="row">
            <div className="avatar">{p.author.slice(0, 1)}</div>
            <div>
              <b>{p.author}</b>
              <small>
                {stamp(p.time)}
                {p.demo ? " · Demo post" : ""}
              </small>
            </div>
            <button
              className="report"
              aria-label={`Report post by ${p.author}`}
              onClick={() => report(p.id)}
            >
              <Flag size={15} />
            </button>
          </div>
          <div className="row post-tags">
            <Badge>{p.route}</Badge>
            <Badge tone="grey">{p.category}</Badge>
            <span>
              <MapPin size={12} />
              {p.location}
            </span>
          </div>
          <Link className="post-body" to={`/community/post/${p.id}`}>
            {p.text}
            {p.photo && <img src={p.photo} alt="Photo shared with post" />}
          </Link>
          <div className="post-actions">
            <button
              onClick={() => {
                setPosts(
                  posts.map((x) =>
                    x.id === p.id
                      ? {
                          ...x,
                          helpful: x.helpful.includes("local") ? [] : ["local"],
                        }
                      : x,
                  ),
                );
              }}
            >
              <Heart size={16} fill={p.helpful.length ? "#19928c" : "none"} />
              {p.helpful.length} helpful
            </button>
            <Link to={`/community/post/${p.id}`}>
              <MessageCircle size={16} />
              {p.comments.length} comments
            </Link>
          </div>
        </article>
      ))}
    </>
  );
}
