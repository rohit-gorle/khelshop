import Link from "next/link";
export default function NotFound() {
  return (
    <section className="not-found">
      <p className="eyebrow">404 / OUT OF BOUNDS</p>
      <h1>
        Lost in
        <br />
        <em>the sauce.</em>
      </h1>
      <p>That page took a wrong turn. Your next good game is still here.</p>
      <Link className="button button-volt" href="/">
        Back to home ↗
      </Link>
    </section>
  );
}
