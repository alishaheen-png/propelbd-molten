"use client";

/* Fixed nav — wordmark + single CTA. Per MOLTEN_DESIGN law (kept as an invariant): the
   wordmark and primary CTA must NOT move. No entrance animation on this component. */
export default function EmberforgeNav() {
  return (
    <header className="emberforge-nav">
      <a href="#emberforge-top" className="emberforge-wordmark">
        PROPEL<span>BD</span>
      </a>
      <a
        href="https://cal.com/propelbd/deep-dive"
        className="emberforge-nav-cta"
        target="_blank"
        rel="noopener noreferrer"
      >
        Book a deep-dive
      </a>
      <style jsx>{`
        .emberforge-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 30;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.25rem 1.75rem;
          pointer-events: none;
        }
        .emberforge-wordmark {
          pointer-events: auto;
          font-family: var(--font-display-stack, sans-serif);
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.04em;
          color: #f5f0e6;
          text-decoration: none;
        }
        .emberforge-wordmark span {
          color: #ff5a1f;
        }
        .emberforge-nav-cta {
          pointer-events: auto;
          font-family: var(--font-body-stack, sans-serif);
          font-size: 0.8rem;
          font-weight: 600;
          color: #0a0908;
          background: #ff5a1f;
          padding: 0.6rem 1.1rem;
          border-radius: 2px;
          text-decoration: none;
          transition: background-color 0.2s ease;
          cursor: pointer;
        }
        .emberforge-nav-cta:hover {
          background: #ff8a4c;
        }
        .emberforge-nav-cta:focus-visible {
          outline: 2px solid #ff8a4c;
          outline-offset: 3px;
        }
        @media (max-width: 640px) {
          .emberforge-nav {
            padding: 1rem 1.1rem;
          }
          .emberforge-nav-cta {
            font-size: 0.72rem;
            padding: 0.5rem 0.85rem;
          }
        }
      `}</style>
    </header>
  );
}
