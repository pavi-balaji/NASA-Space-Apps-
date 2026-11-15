import { useEffect, useRef, useState } from "react";

type Route = "home" | "account" | "messages" | "help";
type CheckType = "activity" | "sleep" | "vitals" | "mental" | "cognition";

const featureLinks = [
  { label: "Sleep tracker", target: "sleep" },
  { label: "Mental health", target: "mental" },
  { label: "Vitals", target: "vitals" },
  { label: "Activity", target: "activity" },
];

const accountDetails = [
  ["Mission name", "Astra Nova"],
  ["Astronaut ID", "ORB-2049"],
  ["Current station", "Odyssey Research Station"],
  ["Mission day", "143"],
  ["Earth contact", "Houston Flight Control"],
];

const messages = [
  {
    type: "Daily announcement",
    date: "MISSION DAY 143 · 07:30",
    subject: "Solar observation window",
    body: "Crew observation begins at 13:20 station time. Remember to complete your vitals check before entering the cupola.",
  },
  {
    type: "Message from Earth",
    date: "RECEIVED TODAY · 06:12",
    subject: "A note from home",
    body: "We watched the station pass overhead last night. Everyone waved, even though we know you could not see us. We miss you.",
  },
  {
    type: "Flight control",
    date: "RECEIVED YESTERDAY · 18:45",
    subject: "Tomorrow's schedule",
    body: "Your sleep window has been moved forward by thirty minutes. The updated schedule is ready in the sleep tracker.",
  },
];

const faqs = [
  {
    question: "How often should I log my vitals?",
    answer:
      "Log pulse readings in the morning, afternoon, and evening. Contact flight control if a reading falls outside your personal baseline.",
  },
  {
    question: "Can I edit a sleep entry?",
    answer: "Yes. Open Sleep Tracker, choose Sleep Log, and select the entry you want to update.",
  },
  {
    question: "Who can see my mental health check-ins?",
    answer:
      "Your check-ins are private to you and the assigned mission health team. They are used to support your wellbeing during the mission.",
  },
  {
    question: "What should I do if I need immediate help?",
    answer:
      "Use the priority contact channel to reach flight control. For an onboard emergency, follow the station emergency procedure immediately.",
  },
];

function getRouteFromHash(): Route {
  const route = window.location.hash.replace("#/", "");
  return route === "account" || route === "messages" || route === "help" ? route : "home";
}

function App() {
  const [route, setRoute] = useState<Route>(getRouteFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [streakOpen, setStreakOpen] = useState(false);
  const [activeCheck, setActiveCheck] = useState<CheckType | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onHashChange = () => {
      const nextRoute = getRouteFromHash();
      setRoute(nextRoute);
      setMenuOpen(false);
      if (nextRoute === "home") {
        window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
      }
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const closeMenu = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent) {
        if (event.key === "Escape") setMenuOpen(false);
        return;
      }
      if (menuOpen && menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenu);
    document.addEventListener("keydown", closeMenu);
    return () => {
      document.removeEventListener("mousedown", closeMenu);
      document.removeEventListener("keydown", closeMenu);
    };
  }, [menuOpen]);

  useEffect(() => {
    document.title =
      route === "home" ? "Orbitrack" : `${route[0].toUpperCase()}${route.slice(1)} | Orbitrack`;
  }, [route]);

  const navigate = (nextRoute: Route) => {
    setMenuOpen(false);
    window.location.hash = nextRoute === "home" ? "#/" : `#/${nextRoute}`;
    setRoute(nextRoute);
    window.requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };

  const scrollTo = (target: string) => {
    document.getElementById(target)?.scrollIntoView({ behavior: "auto", block: "start" });
  };

  if (route !== "home") {
    return <SubPage route={route} onBack={() => navigate("home")} />;
  }

  return (
    <main className="space-app">
      <section className="slide hero-slide" id="home" aria-label="Orbitrack home">
        <img
          className="slide-art"
          src="/assets/start/8a329.png"
          alt="Orbitrack pixel-art control screen in outer space"
        />

        <nav className="feature-nav" aria-label="Orbitrack features">
          {featureLinks.map((link) => (
            <button key={link.target} onClick={() => scrollTo(link.target)}>
              {link.label}
            </button>
          ))}
        </nav>

        <button
          className="start-hotspot"
          onClick={() => scrollTo("sleep")}
          aria-label="Start exploring Orbitrack"
        />

        <div className="astronaut-menu" ref={menuRef}>
          <button
            className="astronaut-hotspot"
            aria-label="Open astronaut menu"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-controls="astronaut-dropdown"
            onClick={() => setMenuOpen((open) => !open)}
          />
          {menuOpen && (
            <div className="pixel-dropdown" id="astronaut-dropdown" role="menu">
              <div className="window-dots" aria-hidden="true">
                •••
              </div>
              {(["account", "messages", "help"] as const).map((item) => (
                <button key={item} role="menuitem" onClick={() => navigate(item)}>
                  {item}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          className="insights-hotspot"
          onClick={() => scrollTo("insights")}
          aria-label="Open health insights"
        />
        <button
          className="streak-hotspot"
          onClick={() => setStreakOpen(true)}
          aria-label="Open mission health streak"
        />

        <div className="scroll-cue" aria-hidden="true">
          <span>SCROLL TO EXPLORE</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </section>

      <FeatureSlide
        id="sleep"
        image="/assets/sleep/ca215.png"
        alt="Sleep Tracker feature in a pixel-art space scene"
        kicker="FEATURE 01"
        title="Sleep tracker"
        description="Keep your rest cycle steady, even when sunrise happens sixteen times a day."
        onHome={() => scrollTo("home")}
      >
        <button
          className="hotspot sleep-log"
          onClick={() => setActiveCheck("sleep")}
          aria-label="Open sleep quality check"
        />
        <button
          className="hotspot sleep-total"
          onClick={() => setActiveCheck("sleep")}
          aria-label="Open sleep summary"
        />
      </FeatureSlide>

      <FeatureSlide
        id="mental"
        image="/assets/mental/3260a.png"
        alt="Mental Health feature in a pixel-art space scene"
        kicker="FEATURE 02"
        title="Mental health"
        description="Check in with your mood, emotions, concentration, and cognition."
        onHome={() => scrollTo("home")}
      >
        <button
          className="hotspot mental-mood"
          onClick={() => setActiveCheck("mental")}
          aria-label="Open mood and stress check"
        />
        <button
          className="hotspot mental-focus"
          onClick={() => setActiveCheck("cognition")}
          aria-label="Open concentration and cognition check-in"
        />
      </FeatureSlide>

      <FeatureSlide
        id="vitals"
        image="/assets/vitals/1fe30.png"
        alt="Vitals feature in a pixel-art space scene"
        kicker="FEATURE 03"
        title="Vitals"
        description="Record pulse checks across the day and keep your health team in the loop."
        onHome={() => scrollTo("home")}
      >
        <button
          className="hotspot vitals-pulse"
          onClick={() => setActiveCheck("vitals")}
          aria-label="Open vitals status and cardiac check"
        />
      </FeatureSlide>

      <ActivitySlide onHome={() => scrollTo("home")} onOpenLog={() => setActiveCheck("activity")} />

      <InsightsSlide onHome={() => scrollTo("home")} />

      {activeCheck && <StatusCheckSlide type={activeCheck} onDone={() => setActiveCheck(null)} />}
      {streakOpen && <StreakPanel onClose={() => setStreakOpen(false)} />}
    </main>
  );
}

function FeatureSlide({
  id,
  image,
  alt,
  kicker,
  title,
  description,
  onHome,
  children,
}: {
  id: string;
  image: string;
  alt: string;
  kicker: string;
  title: string;
  description: string;
  onHome: () => void;
  children: React.ReactNode;
}) {
  return (
    <section
      className={`slide feature-slide feature-${id}`}
      id={id}
      aria-labelledby={`${id}-title`}
    >
      <SlideReturnControls onHome={onHome} />
      <div className="art-stage">
        <img className="slide-art" src={image} alt={alt} />
        {children}
      </div>
      <div className="sr-only">
        <span>{kicker}</span>
        <h2 id={`${id}-title`}>{title}</h2>
        <p>{description}</p>
      </div>
    </section>
  );
}

function SlideReturnControls({ onHome }: { onHome: () => void }) {
  return (
    <div className="slide-return-controls">
      <button className="slide-logo" onClick={onHome} aria-label="Return to Orbitrack home">
        ORBITRACK
      </button>
      <button className="slide-back" onClick={onHome}>
        [ BACK ]
      </button>
    </div>
  );
}

function InsightsSlide({ onHome }: { onHome: () => void }) {
  return (
    <section className="slide insights-slide" id="insights" aria-labelledby="insights-title">
      <SlideReturnControls onHome={onHome} />
      <div className="insights-shell">
        <header className="insights-header">
          <div>
            <span>FEATURE 05 · MISSION DAY 143</span>
            <h2 id="insights-title">Health insights</h2>
          </div>
          <div className="insights-status">
            <i aria-hidden="true" />
            LIVE DIAGNOSTIC
          </div>
        </header>

        <div className="insights-grid">
          <article className="diagnostic-card diagnostic-summary">
            <p className="eyebrow">CROSS-REFERENCED DIAGNOSTIC</p>
            <h3>Recovery load detected</h3>
            <p>
              Reduced sleep and an elevated resting pulse suggest your body needs a lighter mission
              day.
            </p>
            <div className="signal-row" aria-label="Recovery score 68 out of 100">
              <span>RECOVERY</span>
              <div>
                <b style={{ width: "68%" }} />
              </div>
              <strong>68</strong>
            </div>
          </article>

          <div className="metric-stack">
            <article className="diagnostic-card metric-card">
              <span>SLEEP</span>
              <strong>6H 12M</strong>
              <small>48 MIN BELOW GOAL</small>
            </article>
            <article className="diagnostic-card metric-card">
              <span>RESTING PULSE</span>
              <strong>78 BPM</strong>
              <small>+6 ABOVE BASELINE</small>
            </article>
            <article className="diagnostic-card metric-card">
              <span>MOOD</span>
              <strong>STABLE</strong>
              <small>3 DAY TREND</small>
            </article>
          </div>

          <article className="diagnostic-card action-card">
            <p className="eyebrow">RECOMMENDED ACTION</p>
            <div className="action-number">01</div>
            <h3>Run recovery protocol</h3>
            <ul>
              <li>Schedule a 20 minute rest window</li>
              <li>Complete hydration check</li>
              <li>Repeat pulse reading at 14:00</li>
            </ul>
            <button onClick={() => scrollToFeature("sleep")}>OPEN SLEEP TRACKER</button>
          </article>
        </div>
      </div>
    </section>
  );
}

function ActivitySlide({ onHome, onOpenLog }: { onHome: () => void; onOpenLog: () => void }) {
  return (
    <section className="slide activity-slide" id="activity" aria-labelledby="activity-title">
      <SlideReturnControls onHome={onHome} />
      <div className="activity-orbit" aria-hidden="true" />
      <div className="activity-dashboard">
        <header>
          <span>FEATURE 04 · PHYSICAL WELLNESS</span>
          <h2 id="activity-title">Activity</h2>
          <p>Maintain strength, mobility, and cardiovascular health throughout the mission.</p>
        </header>
        <div className="activity-panels">
          <article className="workout-today">
            <p className="eyebrow">TODAY'S WORKOUT</p>
            <h3>Resistance circuit</h3>
            <div className="activity-checklist" aria-label="Physical activity checklist">
              <button onClick={onOpenLog}>
                <span aria-hidden="true">✓</span>
                Treadmill · 22 min
              </button>
              <button onClick={onOpenLog}>
                <span aria-hidden="true">✓</span>
                ARED strength · 20 min
              </button>
            </div>
            <div className="workout-stats">
              <div>
                <strong>42</strong>
                <span>MINUTES</span>
              </div>
              <div>
                <strong>318</strong>
                <span>CALORIES</span>
              </div>
              <div>
                <strong>86%</strong>
                <span>GOAL</span>
              </div>
            </div>
            <button onClick={onOpenLog}>OPEN WORKOUT LOG</button>
          </article>
          <article className="weekly-activity">
            <p className="eyebrow">WEEKLY MOVEMENT</p>
            <div className="activity-bars" aria-label="Seven day activity chart">
              {[68, 90, 55, 82, 74, 96, 42].map((height, index) => (
                <div key={index}>
                  <i style={{ height: `${height}%` }} />
                  <span>{["M", "T", "W", "T", "F", "S", "S"][index]}</span>
                </div>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

const checkContent: Record<
  CheckType,
  {
    eyebrow: string;
    title: string;
    summary: string;
    score: string;
    scoreLabel: string;
    metrics: [string, string, string][];
    guidance: string;
  }
> = {
  activity: {
    eyebrow: "WORKOUT CHECK · COMPLETE",
    title: "Physical wellness",
    summary: "Resistance and cardiovascular targets are logged for mission day 143.",
    score: "86%",
    scoreLabel: "DAILY GOAL",
    metrics: [
      ["Treadmill", "22 min", "COMPLETE"],
      ["ARED strength", "20 min", "COMPLETE"],
      ["Active energy", "318 kcal", "ON TARGET"],
    ],
    guidance: "Complete a five-minute mobility cooldown and rehydrate before your next task.",
  },
  sleep: {
    eyebrow: "SLEEP CHECK · LOGGED",
    title: "Rest summary",
    summary: "Your latest sleep window has been saved and compared with your mission baseline.",
    score: "82",
    scoreLabel: "QUALITY SCORE",
    metrics: [
      ["Rest duration", "6h 42m", "LOGGED"],
      ["Sleep quality", "Good", "82 / 100"],
      ["Sleep deficit", "48 min", "RECOVERY NEEDED"],
    ],
    guidance:
      "Schedule a 20-minute recovery window and begin tonight's sleep routine 30 minutes early.",
  },
  vitals: {
    eyebrow: "CARDIAC CHECK · RECORDED",
    title: "Vitals status",
    summary: "Pulse history is stable and remains within your personalized flight baseline.",
    score: "72",
    scoreLabel: "CURRENT BPM",
    metrics: [
      ["Morning pulse", "68 BPM", "BASELINE"],
      ["Afternoon pulse", "76 BPM", "NORMAL"],
      ["Evening pulse", "72 BPM", "CURRENT"],
    ],
    guidance: "No action required. Repeat the optical pulse check after your next exercise block.",
  },
  mental: {
    eyebrow: "REFLECTION CHECK · SAVED",
    title: "Mental health",
    summary:
      "Your mood and stress reflection has been privately logged for the mission health team.",
    score: "8",
    scoreLabel: "MOOD / 10",
    metrics: [
      ["Mood", "Good", "8 / 10"],
      ["Stress level", "Low", "3 / 10"],
      ["Primary emotion", "Content", "STABLE"],
    ],
    guidance:
      "Continue your current routine. Take three slow breaths before the next scheduled task.",
  },
  cognition: {
    eyebrow: "COGNITION CHECK · COMPLETE",
    title: "Focus status",
    summary:
      "Concentration, response speed, and short-term recall remain within your normal range.",
    score: "94%",
    scoreLabel: "ACCURACY",
    metrics: [
      ["Reaction time", "284 ms", "NORMAL"],
      ["Pattern recall", "9 / 10", "STRONG"],
      ["Focus stability", "High", "BASELINE"],
    ],
    guidance: "Cognition is mission-ready. Take a screen break in 45 minutes to maintain focus.",
  },
};

function StatusCheckSlide({ type, onDone }: { type: CheckType; onDone: () => void }) {
  const content = checkContent[type];

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onDone();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onDone]);

  return (
    <section
      className={`status-check status-${type}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="status-check-title"
    >
      <div className="status-window">
        <header className="status-window-bar">
          <span aria-hidden="true">•••</span>
          <p>{content.eyebrow}</p>
          <button onClick={onDone} aria-label="Back to category slide">
            ×
          </button>
        </header>
        <div className="status-content">
          <div className="status-intro">
            <p className="eyebrow">{content.eyebrow}</p>
            <h2 id="status-check-title">{content.title}</h2>
            <p>{content.summary}</p>
          </div>
          <div className="status-score">
            <strong>{content.score}</strong>
            <span>{content.scoreLabel}</span>
          </div>
          <div className="status-metrics">
            {content.metrics.map(([label, value, state]) => (
              <article key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
                <small>
                  <i aria-hidden="true">✓</i>
                  {state}
                </small>
              </article>
            ))}
          </div>
          <div className="status-guidance">
            <span>MISSION GUIDANCE</span>
            <p>{content.guidance}</p>
          </div>
          <div className="status-actions">
            <button onClick={onDone}>[ BACK ]</button>
            <button onClick={onDone}>[ DONE ]</button>
          </div>
        </div>
      </div>
    </section>
  );
}

function StreakPanel({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  return (
    <section
      className="streak-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="streak-title"
    >
      <div className="streak-window">
        <header className="status-window-bar">
          <span aria-hidden="true">•••</span>
          <p>MISSION STREAK</p>
          <button onClick={onClose} aria-label="Close mission streak">
            ×
          </button>
        </header>
        <div className="streak-content">
          <div className="streak-star" aria-hidden="true">
            ★
          </div>
          <p className="eyebrow">HEALTH CHECK-IN STREAK</p>
          <h2 id="streak-title">16 days strong</h2>
          <p>Every daily health check has been completed for more than two mission weeks.</p>
          <div className="streak-week" aria-label="Seven completed check-in days">
            {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
              <div key={`${day}-${index}`}>
                <span>{day}</span>
                <b aria-label="Complete">✓</b>
              </div>
            ))}
          </div>
          <div className="streak-record">
            <span>PERSONAL RECORD</span>
            <strong>16 DAYS</strong>
          </div>
          <button className="pixel-button" onClick={onClose}>
            [ DONE ]
          </button>
        </div>
      </div>
    </section>
  );
}

function scrollToFeature(target: string) {
  document.getElementById(target)?.scrollIntoView({ behavior: "auto", block: "start" });
}

function SubPage({ route, onBack }: { route: Exclude<Route, "home">; onBack: () => void }) {
  return (
    <main className="subpage">
      <div className="subpage-window">
        <header className="window-header subpage-header">
          <span aria-hidden="true">•••</span>
          <h1>{route}</h1>
          <button aria-label="Back to Orbitrack home" onClick={onBack}>
            ×
          </button>
        </header>
        <div className="subpage-body">
          {route === "account" && <AccountPage />}
          {route === "messages" && <MessagesPage />}
          {route === "help" && <HelpPage />}
        </div>
        <footer className="subpage-footer">
          <button className="pixel-button" onClick={onBack}>
            ← Back
          </button>
          <span>ORBITRACK · MISSION DAY 143</span>
        </footer>
      </div>
    </main>
  );
}

function AccountPage() {
  return (
    <div className="account-layout">
      <section className="profile-card">
        <div className="helmet" aria-hidden="true">
          <div className="helmet-glass">✦</div>
        </div>
        <p className="eyebrow">CURRENT ASTRONAUT</p>
        <h2>Astra Nova</h2>
        <span className="status-badge">● ON MISSION</span>
      </section>
      <section className="details-card" aria-label="Account details">
        <p className="eyebrow">ACCOUNT DETAILS</p>
        <dl>
          {accountDetails.map(([label, value]) => (
            <div key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}

function MessagesPage() {
  return (
    <section className="messages-layout">
      <div className="section-intro">
        <p className="eyebrow">INCOMING TRANSMISSIONS</p>
        <h2>Messages from Earth</h2>
        <span>{messages.length} RECEIVED</span>
      </div>
      <div className="message-list">
        {messages.map((message, index) => (
          <article className="message-card" key={message.subject}>
            <div className="message-number">0{index + 1}</div>
            <div>
              <span>{message.type}</span>
              <h3>{message.subject}</h3>
              <time>{message.date}</time>
              <p>{message.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function HelpPage() {
  return (
    <section className="help-layout">
      <div className="section-intro">
        <p className="eyebrow">MISSION SUPPORT</p>
        <h2>How can we help?</h2>
        <p>Select a question to view its answer.</p>
      </div>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <details key={faq.question} open={index === 0}>
            <summary>
              <span>0{index + 1}</span>
              {faq.question}
              <b aria-hidden="true">+</b>
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

export default App;
