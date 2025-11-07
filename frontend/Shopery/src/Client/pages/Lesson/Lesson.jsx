// frontend/Shopery/src/Client/pages/Lesson/Lesson.jsx
import React, { useCallback, useMemo, useState } from "react";
import "./Lesson.css";

/**
 * ------------------------------------------------------------------------
 * Mock Data Definitions
 * ------------------------------------------------------------------------
 */

/**
 * Course chapters and lessons.
 * Each lesson contains all metadata needed to render state icons,
 * durations, and the simulated video asset.
 */
const COURSE_STRUCTURE = [
  {
    id: "chapter-1",
    title: "Chapter 1: Course Overview",
    totalVideos: 12,
    totalDuration: "1h 28m",
    lessons: [
      {
        id: "lesson-1-1",
        title: "Welcome & Interface Tour",
        duration: "06m",
        status: "available",
        videoId: "InU21w0vAsk",
        description:
          "Get to know the learning interface, playback controls, and how to navigate between chapters efficiently.",
      },
      {
        id: "lesson-1-2",
        title: "Installing Vue JS",
        duration: "12m",
        status: "available",
        videoId: "uYnZ77P0Nqs",
        description:
          "Install Vue CLI, configure the development environment, and run the very first hello-world project together.",
      },
      {
        id: "lesson-1-3",
        title: "Project Structure Overview",
        duration: "09m",
        status: "playing",
        videoId: "AnEJmMs6yDs",
        description:
          "Understand the anatomy of a Vue project including src folder layout, single file components, and tooling.",
      },
    ],
  },
  {
    id: "chapter-2",
    title: "Chapter 2: Curriculum",
    totalVideos: 12,
    totalDuration: "1h 28m",
    lessons: [
      {
        id: "lesson-2-1",
        title: "Understand Vue Components",
        duration: "09m",
        status: "available",
        videoId: "Nitl-K8IUmo",
        description:
          "Build the first reusable component, communicate via props, and evaluate component hierarchies with examples.",
      },
      {
        id: "lesson-2-2",
        title: "Vue Templating",
        duration: "12m",
        status: "available",
        videoId: "39Db8GPSpxQ",
        description:
          "Explore Vue template syntax including directives, computed values, watchers, and template level conditionals.",
      },
      {
        id: "lesson-2-3",
        title: "Vue Forms",
        duration: "10m",
        status: "available",
        videoId: "7DznJwNFxnE",
        description:
          "Build interactive form flows using v-model, validation patterns, and watchers for saving user progress.",
      },
    ],
  },
  {
    id: "chapter-3",
    title: "Chapter 3: Components",
    totalVideos: 12,
    totalDuration: "1h 28m",
    lessons: [],
  },
];
/**
 * Course reviews and meta information for the bottom section.
 */
const COURSE_REVIEWS = [
  {
    id: "review-1",
    name: "Leonardo Da Vinci",
    timestamp: "Today",
    avatarInitials: "LD",
    comment:
      "Loved the course. I have learned subtle techniques and feel confident building interfaces on my own.",
  },
  {
    id: "review-2",
    name: "Titania S",
    timestamp: "Today",
    avatarInitials: "TS",
    comment:
      "It had been a long time since I experimented with frontend frameworks. The examples are clear and engaging.",
  },
  {
    id: "review-3",
    name: "Zhirakov",
    timestamp: "2 days ago",
    avatarInitials: "ZH",
    comment:
      "The lessons on routing and state management were exactly what I needed. Practical insights throughout the curriculum.",
  },
  {
    id: "review-4",
    name: "Miphoska",
    timestamp: "2 days ago",
    avatarInitials: "MI",
    comment:
      "I would love to have some feedback from the teacher on my assignments. Nevertheless, the course is well structured.",
  },
];

const COURSE_SUMMARY = {
  title: "VUE JS SCRATCH COURSE",
  studioName: "Kitani Studio",
  studioTagline: "Design Studio",
  descriptionParagraphs: [
    "Vue (pronounced /vjuː/, like view) is a progressive framework for building user interfaces. Unlike other monolithic frameworks, Vue is designed from the ground up to be incrementally adoptable.",
    "The core library is focused on the view layer only, and is easy to pick up and integrate with other libraries or existing projects. On the other hand, Vue is also perfectly capable of powering sophisticated Single-Page Applications when used in combination with modern tooling and supporting libraries.",
  ],
};

const FEATURED_WEBINAR = {
  badge: "WEBINAR",
  instructor: "Ana Kursova",
  title: "Masterclass in Design Thinking, Innovation & Creativity",
  background:
    "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80",
  stats: {
    attendees: "2.3k",
    likes: "1.4k",
  },
};

const getYoutubeEmbedUrl = (videoId) =>
  `https://www.youtube.com/embed/${videoId}?rel=0`;

/**
 * ------------------------------------------------------------------------
 * Utility Helpers
 * ------------------------------------------------------------------------
 */

/**
 * Returns the default lesson to display on first render.
 * Prefers a lesson marked as "playing", otherwise the first lesson encountered.
 */
const getInitialLesson = () => {
  for (const chapter of COURSE_STRUCTURE) {
    const current = chapter.lessons.find(
      (lesson) => lesson.status === "playing"
    );
    if (current) {
      return { chapterId: chapter.id, lessonId: current.id };
    }
  }

  const fallbackChapter = COURSE_STRUCTURE[0];
  const fallbackLesson = fallbackChapter.lessons[0];
  return { chapterId: fallbackChapter.id, lessonId: fallbackLesson.id };
};

/**
 * Returns a CSS modifier based on lesson status.
 */
const getLessonModifier = (status) => {
  if (status === "playing") return "lesson-page__lesson-item--playing";
  return "lesson-page__lesson-item--available";
};

const LessonStatusIcon = ({ status }) => {
  if (status === "playing") {
    return (
      <svg className="lesson-page__lesson-status-icon" viewBox="0 0 24 24">
        <path d="M8 5v14l11-7z" />
      </svg>
    );
  }
  return (
    <svg className="lesson-page__lesson-status-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
};

/**
 * ------------------------------------------------------------------------
 * Page Component
 * ------------------------------------------------------------------------
 */

const Lesson = () => {
  const initial = useMemo(() => getInitialLesson(), []);
  const [activeChapterId, setActiveChapterId] = useState(initial.chapterId);
  const [activeLessonId, setActiveLessonId] = useState(initial.lessonId);

  /**
   * Derived state: active lesson object.
   */
  const activeLesson = useMemo(() => {
    const chapter = COURSE_STRUCTURE.find(
      (section) => section.id === activeChapterId
    );
    if (!chapter) return COURSE_STRUCTURE[0].lessons[0];
    return (
      chapter.lessons.find((item) => item.id === activeLessonId) ||
      chapter.lessons[0]
    );
  }, [activeChapterId, activeLessonId]);

  /**
   * Handler toggling accordion visibility.
   */
  const handleToggleChapter = useCallback(
    (chapterId) => {
      setActiveChapterId((prev) => (prev === chapterId ? "" : chapterId));
    },
    [setActiveChapterId]
  );

  /**
   * Handler switching lesson.
   */
  const handleSelectLesson = useCallback((chapterId, lesson) => {
    setActiveChapterId(chapterId);
    setActiveLessonId(lesson.id);
  }, []);

  /**
   * Derived progress for the video progress bar.
   * Completed lessons count as progress, plus half progress for current playing.
   */
  const videoProgress = useMemo(() => {
    const totalLessons = COURSE_STRUCTURE.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0
    );
    const completedLessons = COURSE_STRUCTURE.reduce((sum, chapter) => {
      const completed = chapter.lessons.filter(
        (lesson) => lesson.status === "completed"
      ).length;
      return sum + completed;
    }, 0);

    const playingBonus = 0.5;
    const raw = (completedLessons + playingBonus) / totalLessons;
    return Math.min(1, raw);
  }, []);

  return (
    <div className="lesson-page">
      <div className="lesson-page__container">
        {/* Top Section */}
        <section className="lesson-page__layout">
          <div className="lesson-page__layout-left">
            <div className="lesson-page__video-panel">
              <div className="lesson-page__video-wrapper">
                <div className="lesson-page__player-shell">
                  <div className="lesson-page__video-frame">
                    <iframe
                      src={getYoutubeEmbedUrl(activeLesson.videoId)}
                      title={activeLesson.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              </div>
            </div>

            <header className="lesson-page__course-header">
              <h2 className="lesson-page__course-title">
                {COURSE_SUMMARY.title}
              </h2>
              <div className="lesson-page__course-badge">
                <div className="lesson-page__course-logo">KS</div>
                <div className="lesson-page__course-meta">
                  <span className="lesson-page__course-studio">
                    {COURSE_SUMMARY.studioName}
                  </span>
                  <span className="lesson-page__course-tagline">
                    {COURSE_SUMMARY.studioTagline}
                  </span>
                </div>
              </div>
            </header>

            <article className="lesson-page__about-course">
              <h3 className="lesson-page__section-heading">About Course</h3>
              {COURSE_SUMMARY.descriptionParagraphs.map((paragraph, index) => (
                <p className="lesson-page__about-text" key={`about-${index}`}>
                  {paragraph}
                </p>
              ))}
            </article>

            <section className="lesson-page__reviews">
              <h3 className="lesson-page__section-heading">Review</h3>
              <ul className="lesson-page__review-list">
                {COURSE_REVIEWS.map((review) => (
                  <li className="lesson-page__review-item" key={review.id}>
                    <div
                      className="lesson-page__review-avatar"
                      aria-hidden="true"
                    >
                      {review.avatarInitials}
                    </div>
                    <div className="lesson-page__review-content">
                      <div className="lesson-page__review-header">
                        <span className="lesson-page__review-name">
                          {review.name}
                        </span>
                        <span className="lesson-page__review-time">
                          {review.timestamp}
                        </span>
                      </div>
                      <p className="lesson-page__review-text">
                        {review.comment}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lesson-page__layout-right">
            {COURSE_STRUCTURE.map((chapter) => {
              const isOpen = activeChapterId === chapter.id;
              return (
                <div
                  className={`lesson-page__chapter ${
                    isOpen ? "lesson-page__chapter--open" : ""
                  }`}
                  key={chapter.id}
                >
                  <button
                    type="button"
                    className="lesson-page__chapter-header"
                    onClick={() => handleToggleChapter(chapter.id)}
                  >
                    <div className="lesson-page__chapter-header-text">
                      <h3 className="lesson-page__chapter-title">
                        {chapter.title}
                      </h3>
                      <span className="lesson-page__chapter-meta">
                        {chapter.totalVideos} Videos • {chapter.totalDuration}
                      </span>
                    </div>
                    <svg
                      className="lesson-page__chapter-arrow"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </button>

                  <div
                    className="lesson-page__lesson-list"
                    aria-hidden={!isOpen}
                  >
                    {chapter.lessons.map((lesson) => {
                      const isActiveLesson = activeLessonId === lesson.id;
                      const statusModifier = getLessonModifier(lesson.status);
                      return (
                        <button
                          key={lesson.id}
                          type="button"
                          className={`lesson-page__lesson-item ${statusModifier} ${
                            isActiveLesson
                              ? "lesson-page__lesson-item--active"
                              : ""
                          }`}
                          onClick={() => handleSelectLesson(chapter.id, lesson)}
                        >
                          <span className="lesson-page__lesson-state">
                            <LessonStatusIcon status={lesson.status} />
                          </span>
                          <span className="lesson-page__lesson-name">
                            {lesson.title}
                          </span>
                          <span className="lesson-page__lesson-duration">
                            {lesson.duration}
                          </span>
                          <span
                            className={`lesson-page__lesson-badge ${
                              lesson.status === "playing"
                                ? "lesson-page__lesson-badge--playing"
                                : "lesson-page__lesson-badge--available"
                            }`}
                          >
                            {lesson.status === "playing"
                              ? "Playing"
                              : "Available"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            <div
              className="lesson-page__webinar-card"
              style={{ backgroundImage: `url(${FEATURED_WEBINAR.background})` }}
            >
              <div className="lesson-page__webinar-overlay" />
              <div className="lesson-page__webinar-content">
                <span className="lesson-page__webinar-badge">
                  {FEATURED_WEBINAR.badge}
                </span>
                <span className="lesson-page__webinar-instructor">
                  {FEATURED_WEBINAR.instructor}
                </span>
                <h4 className="lesson-page__webinar-title">
                  {FEATURED_WEBINAR.title}
                </h4>
                <div className="lesson-page__webinar-stats">
                  <span className="lesson-page__webinar-stat">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
                    </svg>
                    {FEATURED_WEBINAR.stats.attendees}
                  </span>
                  <span className="lesson-page__webinar-stat">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                    {FEATURED_WEBINAR.stats.likes}
                  </span>
                </div>
                <button type="button" className="lesson-page__webinar-button">
                  Browse
                </button>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </div>
  );
};

export default Lesson;
