// The caps kicker + big headline + right-hand standfirst that opens every
// section on a Blend page. The `stop` prop is the system's one typographic
// tic: a full stop (or question mark) closing the headline in the accent
// colour. Use it at most once per screenful — it stops being a signature the
// moment every heading has one.

export default function SectionHead({ eyebrow, title, stop, aside }: {
  eyebrow: string;
  /** Sentence case, 3–7 words. The line break is a design decision, not a wrap. */
  title: string;
  /** Usually "." — rendered in the accent. Omit on headlines that need none. */
  stop?: string;
  /** One or two sentences, 12–28 words. Sits right, drops below on mobile. */
  aside: string;
}) {
  return (
    <div className="bt-sechead">
      <div>
        <p className="bt-eyebrow">{eyebrow}</p>
        <h2>
          {title}
          {stop && <span className="bt-stop">{stop}</span>}
        </h2>
      </div>
      <p className="bt-aside">{aside}</p>
    </div>
  );
}
