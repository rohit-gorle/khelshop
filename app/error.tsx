"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <section className="empty section">
      <h2>A little timeout.</h2>
      <p>Something didn’t load. Let’s give it another shot.</p>
      <button className="button button-volt" onClick={reset}>
        Try again
      </button>
    </section>
  );
}
