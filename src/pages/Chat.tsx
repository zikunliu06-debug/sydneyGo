import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Bus,
  MessageCircle,
  Send,
  Flag,
  CheckCircle2,
} from "lucide-react";

import { incident } from "../data/demo";
import { read } from "../services/storageService";

import { Intro, stamp } from "../components/Common";
import { useSydney } from "../state";
import { PhotoInput } from "../components/PhotoInput";
export function Chat() {
  const { user, chat, setChat, resolved, notify, report } = useSydney();
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState("");
  const send = (e: FormEvent) => {
    e.preventDefault();
    if (resolved) return;
    if (!text.trim()) {
      notify(
        photo
          ? "Add a caption before sending your photo."
          : "Write a message first.",
      );
      return;
    }
    setChat([
      ...chat,
      {
        id: crypto.randomUUID(),
        author: user?.name || "Guest commuter",
        text: text.trim(),
        photo: photo || undefined,
        time: new Date().toISOString(),
      },
    ]);
    setText("");
    setPhoto("");
  };
  return (
    <>
      <Intro eyebrow="TEMPORARY INCIDENT LIVE CHAT" title="Broadway, together.">
        Heavy Traffic · Bus 370 · Broadway
      </Intro>
      <div className="chat-status">
        <span className="pulse" />
        <b>
          {resolved
            ? "Read-only · Traffic back to normal"
            : "Active demo incident"}
        </b>
        <span>3 demo participants + you</span>
      </div>
      <div className="notice plain">
        <MessageCircle size={17} />
        <span>
          This chat is for this incident only. Single-device prototype: messages
          are not sent to other commuters. For lasting discussions, visit{" "}
          <Link to="/community">Community</Link>.
        </span>
      </div>
      {resolved && (
        <div className="saving">
          <CheckCircle2 />
          <div>
            <b>Traffic back to normal</b>
            <p>
              The simulated incident is resolved. You can still read previous
              messages.
            </p>
          </div>
        </div>
      )}
      <div className="chat-list">
        {chat.map((m) => (
          <article
            className={`message ${m.author === user?.name ? "own" : ""}`}
            key={m.id}
          >
            <div className="row between">
              <b>{m.author}</b>
              <button
                aria-label={`Report message from ${m.author}`}
                onClick={() => report(m.id)}
              >
                <Flag size={13} />
              </button>
            </div>
            <p>{m.text}</p>
            {m.photo && <img src={m.photo} alt={m.text} />}
            <small>
              {stamp(m.time)} {m.demo ? "· Demo message" : ""}
            </small>
          </article>
        ))}
      </div>
      {!resolved && (
        <form className="panel composer" onSubmit={send}>
          <label>
            {photo ? "Photo caption" : "Your commuter update"}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="What are you seeing on your journey?"
              maxLength={1000}
            />
          </label>
          {photo && (
            <div className="photo-preview">
              <img src={photo} alt="Pending attachment" />
              <button type="button" onClick={() => setPhoto("")}>
                Remove photo
              </button>
            </div>
          )}
          <PhotoInput onPhoto={setPhoto} />
          <button className="primary">
            Send message
            <Send size={17} />
          </button>
        </form>
      )}
      <Link className="text-link" to="/map">
        Back to Map
        <ArrowRight size={16} />
      </Link>
    </>
  );
}
