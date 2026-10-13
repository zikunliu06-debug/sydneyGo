import { useState } from "react";
import { Link } from "react-router-dom";
import { Send, Flag, Heart } from "lucide-react";

import type { Post } from "../types";
import { Intro, stamp } from "../components/Common";
import { useSydney } from "../state";
export function PostDetails() {
  const { location, user, posts, setPosts, report } = useSydney();
  const p = posts.find((p) => p.id === location.pathname.split("/").pop());
  const [comment, setComment] = useState("");
  if (!p)
    return (
      <section className="panel">
        <h1>Post not found</h1>
        <Link to="/community">Back to Community</Link>
      </section>
    );
  return (
    <>
      <Intro
        eyebrow={p.category.toUpperCase()}
        title={`${p.route} · ${p.location}`}
      >
        Shared by {p.author} · {stamp(p.time)}
        {p.demo ? " · Demo post" : ""}
      </Intro>
      <section className="panel">
        <p className="post-full">{p.text}</p>
        {p.photo && (
          <img
            className="post-photo"
            src={p.photo}
            alt="Photo shared with this post"
          />
        )}
        <div className="row between">
          <button
            className="text-button"
            onClick={() =>
              setPosts(
                posts.map((x) =>
                  x.id === p.id
                    ? { ...x, helpful: x.helpful.length ? [] : ["local"] }
                    : x,
                ),
              )
            }
          >
            <Heart size={17} />
            {p.helpful.length} helpful
          </button>
          <button className="text-button" onClick={() => report(p.id)}>
            <Flag size={16} />
            Report
          </button>
        </div>
      </section>
      <h2 className="section-heading">Comments · {p.comments.length}</h2>
      {p.comments.map((c) => (
        <article className="message" key={c.id}>
          <div className="row between">
            <b>{c.author}</b>
            <button aria-label="Report comment" onClick={() => report(c.id)}>
              <Flag size={13} />
            </button>
          </div>
          <p>{c.text}</p>
          <small>
            {stamp(c.time)}
            {c.demo ? " · Demo comment" : ""}
          </small>
        </article>
      ))}
      <form
        className="panel stack"
        onSubmit={(e) => {
          e.preventDefault();
          if (!comment.trim()) return;
          setPosts(
            posts.map((x) =>
              x.id === p.id
                ? {
                    ...x,
                    comments: [
                      ...x.comments,
                      {
                        id: crypto.randomUUID(),
                        author: user?.name || "Guest commuter",
                        text: comment.trim(),
                        time: new Date().toISOString(),
                      },
                    ],
                  }
                : x,
            ),
          );
          setComment("");
        }}
      >
        <label>
          Add a comment
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
            maxLength={1000}
            placeholder="Share your thoughts"
          />
        </label>
        <button className="primary">
          Send comment
          <Send size={16} />
        </button>
      </form>
    </>
  );
}
