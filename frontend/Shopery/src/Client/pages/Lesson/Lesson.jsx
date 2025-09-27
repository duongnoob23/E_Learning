import React, { useMemo, useState } from "react";
import "./Lesson.css";

const lessons = [
  { id: 1, title: "Let's Get Started!", duration: "4:27", status: "done" },
  {
    id: 2,
    title: "What is Adobe Photoshop",
    duration: "13:12",
    status: "done",
  },
  {
    id: 3,
    title: "Tools in Adobe Photoshop",
    duration: "41:29",
    status: "done",
  },
  { id: 4, title: "Create Flower", duration: "19:52", status: "done" },
  { id: 5, title: "Easy Digital Painting", duration: "7:08", status: "done" },
  { id: 6, title: "Add Texture", duration: "16:12", status: "done" },
  { id: 7, title: "Painting Interaction", duration: "3:15", status: "current" },
  {
    id: 8,
    title: "Digital Imaging phase 1",
    duration: "--:--",
    status: "locked",
  },
  {
    id: 9,
    title: "Digital Imaging phase 2",
    duration: "--:--",
    status: "locked",
  },
  {
    id: 10,
    title: "Save and Documentation",
    duration: "--:--",
    status: "locked",
  },
];

const seedMsgs = [
  { id: 1, name: "Addison rae", text: "is anyone else learning english?" },
  {
    id: 2,
    name: "Zyon Brown",
    text: "@Galaxa Yeah me too, this is just to good.",
  },
  {
    id: 3,
    name: "Crystal moon",
    text: "@Addison rae you're not alone, me too here",
  },
  { id: 4, name: "Crystal moon", text: "Everything works well" },
  { id: 5, name: "Zyon Brown", text: "Nice One" },
];

export default function Lesson() {
  const [tab, setTab] = useState("chat");
  const [selected, setSelected] = useState(
    lessons.find((l) => l.status === "current")?.id || 1
  );
  const [msgs, setMsgs] = useState(seedMsgs);
  const [draft, setDraft] = useState("");

  const current = useMemo(
    () => lessons.find((l) => l.id === selected) || lessons[0],
    [selected]
  );

  const send = (e) => {
    e.preventDefault();
    const t = draft.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: Date.now(), name: "You", text: t }]);
    setDraft("");
  };

  return (
    <div className="lesson">
      <div className="lesson__container">
        <div className="lesson__row">
          {/* MAIN */}
          <section className="lesson__col lesson__col--main">
            <div className="lesson__videoWrap">
              <span className="lesson__liveTag">LIVE NOW</span>

              <video
                className="lesson__video"
                poster="https://images.unsplash.com/photo-1529336953121-c82189b8792d?q=80&w=1600&auto=format&fit=crop"
                controls
              />

              <div className="lesson__miniCam">
                <img
                  className="lesson__miniCam-img"
                  alt="Instructor"
                  src="https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=700&auto=format&fit=crop"
                />
                <div className="lesson__miniCam-tools">
                  <span className="lesson__tool">HD</span>
                  <span className="lesson__tool">CC</span>
                  <span className="lesson__tool">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                  </span>
                  <span className="lesson__tool">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 22c5.4 0 9.8-4.4 9.8-9.8S17.4 2.4 12 2.4 2.2 6.8 2.2 12.2 6.6 22 12 22zm-1-6.5h2v2h-2v-2zm0-9h2v7h-2v-7z" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>

            <div className="lesson__heading">
              <h2 className="lesson__title">
                {current.id}. {current.title}
              </h2>
              <div className="lesson__stats">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12c-2.761 0-5-2.239-5-5s2.239-5 5-5 5 2.239 5 5-2.239 5-5 5z" />
                </svg>
                <span>2.3K</span>
              </div>
            </div>

            <div className="lesson__authorBar">
              <div className="lesson__authorMeta">
                <div className="lesson__avatar">Bē</div>
                <div className="lesson__authorTxt">
                  <div className="lesson__authorName">Marius Ciocirland</div>
                  <div className="lesson__authorSub">Behance</div>
                </div>
              </div>
              <span className="lesson__chip lesson__chip--live">LIVE NOW</span>
            </div>

            <div className="lesson__card">
              <div className="lesson__tabs">
                <button
                  type="button"
                  className={`lesson__tab ${
                    tab === "about" ? "lesson__tab--active" : ""
                  }`}
                  onClick={() => setTab("about")}
                >
                  About
                </button>
                <button
                  type="button"
                  className={`lesson__tab ${
                    tab === "chat" ? "lesson__tab--active" : ""
                  }`}
                  onClick={() => setTab("chat")}
                >
                  Live Chat
                </button>
              </div>

              {tab === "about" ? (
                <div className="lesson__about">
                  <p>
                    Learn practical techniques for digital painting and photo
                    editing. This session covers brushes, layers, and real-time
                    interaction with the instructor.
                  </p>
                </div>
              ) : (
                <div className="lesson__chat">
                  <ul className="lesson__chatList">
                    {msgs.map((m) => (
                      <li key={m.id} className="lesson__chatItem">
                        <div className="lesson__chatAvatar" />
                        <div className="lesson__chatBubble">
                          <div className="lesson__chatName">{m.name}</div>
                          <div className="lesson__chatText">{m.text}</div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <form className="lesson__chatForm" onSubmit={send}>
                    <input
                      className="lesson__input"
                      placeholder="Ask Something..."
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="lesson__send"
                      aria-label="Send"
                    >
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M2 21l21-9L2 3v7l15 2-15 2v7z" />
                      </svg>
                    </button>
                  </form>
                </div>
              )}
            </div>
          </section>

          {/* SIDE */}
          <aside className="lesson__col lesson__col--side">
            <div className="lesson__playlist">
              <div className="lesson__playlistHead">
                <div>
                  <div className="lesson__course">
                    How to Become a Designer on 2020
                  </div>
                  <div className="lesson__courseMeta">
                    Saturday, 18 Sep 2020 • Start on 01:00 PM
                  </div>
                </div>
                <button className="lesson__follow" type="button">
                  Follow
                </button>
              </div>

              <ul className="lesson__list">
                {lessons.map((item) => {
                  const isDone = item.status === "done";
                  const isCur = item.status === "current";
                  const isLocked = item.status === "locked";
                  return (
                    <li
                      key={item.id}
                      className={[
                        "lesson__item",
                        isDone && "lesson__item--done",
                        isCur && "lesson__item--current",
                        isLocked && "lesson__item--locked",
                        selected === item.id && "lesson__item--selected",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      onClick={() => !isLocked && setSelected(item.id)}
                    >
                      <div className="lesson__itemL">
                        <span className="lesson__itemIcon" aria-hidden>
                          {isDone ? (
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                            >
                              <path d="M9 16.2l-3.5-3.5L4 14.2l5 5 12-12-1.5-1.5z" />
                            </svg>
                          ) : isCur ? (
                            <span className="lesson__dot lesson__dot--live" />
                          ) : (
                            <span className="lesson__dot" />
                          )}
                        </span>
                        <span className="lesson__itemIndex">{item.id}.</span>
                        <span className="lesson__itemTitle">{item.title}</span>
                      </div>
                      <span className="lesson__itemTime">{item.duration}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>
        </div>

        <div className="lesson__row lesson__row--bottom">
          <div className="lesson__col lesson__col--main" />
          <aside className="lesson__col lesson__col--side">
            <div className="lesson__banner">
              <div className="lesson__bannerTop">
                <span className="lesson__bannerTag">WEBINAR</span>
                <span className="lesson__bannerDate">August 24, 2020</span>
              </div>
              <h3 className="lesson__bannerTitle">One Day Learn a Photo.</h3>
              <img
                className="lesson__bannerImg"
                alt="Sarah Molek"
                src="https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&w=1200&auto=format&fit=crop"
              />
              <button className="lesson__bannerCta" type="button">
                Get it Now
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
